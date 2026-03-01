"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useDashboard } from "./hooks/useDashboard";
import { useManagerInsights } from "./hooks/useManagerInsights";
import { useWorkspaceManagement } from "./hooks/useWorkspaceManagement";
import { Hero } from "./components/Hero";
import { DailyChart } from "./components/DailyChart";
import { KpiGrid } from "./components/KpiGrid";
import { RingSection } from "./components/RingSection";
import { Matrix } from "./components/Matrix";
import { TopHabits } from "./components/TopHabits";
import { WeekStrip } from "./components/WeekStrip";
import { CreateHabitModal } from "./components/CreateHabitModal";
import { CoachChat } from "./components/CoachChat";
import { DashboardTopBar } from "./components/DashboardTopBar";
import { RolePanels } from "./components/RolePanels";
import { WorkspaceManagerPanel } from "./components/WorkspaceManagerPanel";
import { JoinWorkspaceCard } from "./components/JoinWorkspaceCard";
import { useBilling } from "./hooks/useBilling";

type DashboardUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: "manager" | "member";
  subscriptionStatus?: "none" | "pending" | "active" | "failed";
  workspaceId?: string | null;
};

export default function DashboardPage() {
  const user = useSelector((s: RootState) => s.auth.user as DashboardUser | null);

  const {
    habits,
    loading,
    error,
    chartMode,
    setChartMode,
    showCreateModal,
    newHabitTitles,
    setNewHabitTitles,
    createError,
    creatingHabit,
    view,
    remainingSlots,
    openCreateModal,
    closeCreateModal,
    handleCreateHabit,
    completeToday,
    renameHabit,
    deleteHabit,
    toggleCheckin,
    signOut,
  } = useDashboard();

  const { notifyHistory, notifyLoading } = useManagerInsights(user?.role);
  const { paymentLoading, paymentError, handlePayNow } = useBilling(user);

  const {
    overview,
    members,
    loading: workspaceLoading,
    managerError,
    managerActionLoading,
    regenerateInvite,
    removeMember,
    joinCode,
    setJoinCode,
    joinLoading,
    joinError,
    joinSuccess,
    joinWorkspace,
  } = useWorkspaceManagement(user);

  const [copied, setCopied] = useState(false);

  const inviteCode = overview?.inviteCode ?? "";
  const copyInvite = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email";

  const initials = useMemo(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [displayName]);

  return (
    <div className="min-h-screen text-foreground" style={{ background: "var(--gradient-page)" }}>
      <div className="mx-auto max-w-[1560px] px-4 pb-10 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8 lg:pb-20 lg:pt-9">
        <DashboardTopBar
          displayName={displayName}
          displayEmail={displayEmail}
          initials={initials}
          role={user?.role}
          notifyLoading={notifyLoading}
          notifyHistory={notifyHistory}
          onCreateHabit={openCreateModal}
          onSignOut={signOut}
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
            <Hero
              today={view.today}
              habitsCount={habits.length}
              todayPct={view.todayPct}
              maxStreak={view.maxStreak}
              activeDays={view.activeDays}
            />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
            <KpiGrid
              habitsCount={habits.length}
              todayCount={view.todayCount}
              maxStreak={view.maxStreak}
              totalDone={view.totalDone}
            />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
          >
            <div className="flex flex-col gap-6">
              <Matrix
                habits={habits}
                last35={view.last35}
                todayKey={view.todayKey}
                completedToday={completeToday}
                onToggleCheckin={toggleCheckin}
                onRenameHabit={renameHabit}
                onDeleteHabit={deleteHabit}
              />
              <RingSection
                todayPct={view.todayPct}
                weekPct={view.weekPct}
                monthPct={view.monthPct}
                allPct={view.allPct}
              />
              <WeekStrip
                last7={view.last7}
                map={view.map}
                habitsCount={habits.length}
                todayKey={view.todayKey}
              />
            </div>

            <div className="flex flex-col gap-6">
              <RolePanels
                role={user?.role}
                subscriptionStatus={user?.subscriptionStatus}
                workspaceId={user?.workspaceId}
                inviteCode={inviteCode}
                copied={copied}
                onCopyInvite={copyInvite}
                onPayNow={handlePayNow}
                paymentError={paymentError}
                paymentLoading={paymentLoading}
              />

              {user?.role === "manager" && (
                <WorkspaceManagerPanel
                  workspaceName={overview?.workspaceName}
                  inviteCode={overview?.inviteCode}
                  memberCount={overview?.memberCount}
                  members={members}
                  loading={workspaceLoading}
                  error={managerError}
                  actionLoading={managerActionLoading}
                  onRegenerateInvite={regenerateInvite}
                  onRemoveMember={removeMember}
                  onCopyInvite={copyInvite}
                />
              )}

              {user?.role === "member" && !user?.workspaceId && (
                <JoinWorkspaceCard
                  inviteCode={joinCode}
                  setInviteCode={setJoinCode}
                  loading={joinLoading}
                  error={joinError}
                  success={joinSuccess}
                  onJoin={joinWorkspace}
                />
              )}

              <TopHabits topHabits={view.topHabits} />
              <DailyChart
                chartMode={chartMode}
                setChartMode={setChartMode}
                chartData={view.chartData}
                maxBar={view.maxBar}
              />
            </div>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
            className="mt-6"
          >
            <CoachChat
              context={`todayPct=${view.todayPct}, habits=${habits.length}, maxStreak=${view.maxStreak}, activeDays=${view.activeDays}, totalDone=${view.totalDone}`}
            />
          </motion.div>
        </motion.div>

        {loading && <p className="mt-4 text-sm text-muted-foreground">Loading habits...</p>}
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>

      <motion.button
        onClick={openCreateModal}
        className="btn-cta fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full p-0 shadow-xl sm:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <CreateHabitModal
        show={showCreateModal}
        onClose={closeCreateModal}
        onSubmit={handleCreateHabit}
        titles={newHabitTitles}
        setTitles={setNewHabitTitles}
        createError={createError}
        creatingHabit={creatingHabit}
        currentHabitsCount={habits.length}
        remainingSlots={remainingSlots}
      />
    </div>
  );
}
