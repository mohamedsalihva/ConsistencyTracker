"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

export type NotificationHistoryItem = {
  _id: string;
  dateKey: string;
  createdAt: string;
};

export function useManagerInsights(role?: "manager" | "member") {
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyHistory, setNotifyHistory] = useState<NotificationHistoryItem[]>([]);

  useEffect(() => {
    const loadManagerData = async () => {
      if (role !== "manager") return;

      setNotifyLoading(true);
      try {
        const [inviteRes, historyRes] = await Promise.allSettled([
          api.get(API.WORKSPACE.MY_INVITE),
          api.get<NotificationHistoryItem[]>(API.NOTIFICATION.MY_HISTORY),
        ]);

        if (inviteRes.status === "fulfilled") {
          setInviteCode(inviteRes.value.data.inviteCode || "");
        } else {
          setInviteCode("");
        }

        if (historyRes.status === "fulfilled") {
          setNotifyHistory(Array.isArray(historyRes.value.data) ? historyRes.value.data : []);
        } else {
          setNotifyHistory([]);
        }
      } finally {
        setNotifyLoading(false);
      }
    };

    loadManagerData();
  }, [role]);

  const copyInvite = useCallback(async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }, [inviteCode]);

  return { inviteCode, copied, copyInvite, notifyHistory, notifyLoading };
}

