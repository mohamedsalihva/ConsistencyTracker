"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { setUser } from "@/store/authSlice";

type Role = "manager" | "member";
type SubscriptionStatus = "none" | "pending" | "active" | "failed";

type DashboardUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: Role;
  subscriptionStatus?: SubscriptionStatus;
  workspaceId?: string | null;
};

export type WorkspaceOverview = {
  workspaceId: string;
  workspaceName: string;
  inviteCode: string;
  memberCount: number;
  ownerId: string;
};

export type WorkspaceMember = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function useWorkspaceManagement(user: DashboardUser | null) {
  const dispatch = useDispatch();

  const [overview, setOverview] = useState<WorkspaceOverview | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  const [managerError, setManagerError] = useState("");
  const [managerActionLoading, setManagerActionLoading] = useState(false);

  const loadManagerWorkspace = useCallback(async () => {
    if (user?.role !== "manager") return;

    setLoading(true);
    setManagerError("");
    try {
      const [overviewRes, membersRes] = await Promise.all([
        api.get<WorkspaceOverview>(API.WORKSPACE.OVERVIEW),
        api.get<WorkspaceMember[]>(API.WORKSPACE.MEMBERS),
      ]);
      setOverview(overviewRes.data);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : []);
    } catch (err: any) {
      setManagerError(err?.response?.data?.message || "Failed to load workspace data.");
      setOverview(null);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadManagerWorkspace();
  }, [loadManagerWorkspace]);

  const joinWorkspace = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      setJoinError("Invite code is required.");
      return;
    }

    setJoinError("");
    setJoinSuccess("");
    setJoinLoading(true);

    try {
      const res = await api.post(API.WORKSPACE.JOIN, { inviteCode: code });
      dispatch(setUser(res.data.user));
      setJoinCode("");
      setJoinSuccess(`Joined workspace: ${res.data.workspace?.name ?? "Success"}`);
    } catch (err: any) {
      setJoinError(err?.response?.data?.message || "Failed to join workspace.");
    } finally {
      setJoinLoading(false);
    }
  };

  const regenerateInvite = async () => {
    if (user?.role !== "manager") return;
    setManagerError("");
    setManagerActionLoading(true);

    try {
      const res = await api.post<{
        workspaceId: string;
        workspaceName: string;
        inviteCode: string;
      }>(API.WORKSPACE.REGENERATE_INVITE);

      setOverview((prev) =>
        prev
          ? { ...prev, inviteCode: res.data.inviteCode }
          : {
              workspaceId: res.data.workspaceId,
              workspaceName: res.data.workspaceName,
              inviteCode: res.data.inviteCode,
              memberCount: 0,
              ownerId: user?._id || "",
            },
      );
    } catch (err: any) {
      setManagerError(err?.response?.data?.message || "Failed to regenerate invite code.");
    } finally {
      setManagerActionLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (user?.role !== "manager") return;
    setManagerError("");
    setManagerActionLoading(true);

    try {
      await api.delete(API.WORKSPACE.REMOVE_MEMBER(memberId));
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
      setOverview((prev) =>
        prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev,
      );
    } catch (err: any) {
      setManagerError(err?.response?.data?.message || "Failed to remove member.");
    } finally {
      setManagerActionLoading(false);
    }
  };

  return {
    overview,
    members,
    loading,
    managerError,
    managerActionLoading,
    loadManagerWorkspace,
    regenerateInvite,
    removeMember,

    joinCode,
    setJoinCode,
    joinLoading,
    joinError,
    joinSuccess,
    joinWorkspace,
  };
}
