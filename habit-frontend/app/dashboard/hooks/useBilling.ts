"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { setUser } from "@/store/authSlice";


type BillingUser = {
  name?: string;
  email?: string;
};

export function useBilling(user: BillingUser | null) {
  const dispatch = useDispatch();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handlePayNow = async () => {
    try {
      setPaymentError("");
      setPaymentLoading(true);

      const scriptId = "razorpay-checkout-js";
      if (!document.getElementById(scriptId)) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay script"));
          document.body.appendChild(script);
        });
      }

      const orderRes = await api.post(API.BILLING.CREATE_ORDER);
      const { orderId, amount, currency, keyId } = orderRes.data;

      const rz = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "HabitFlow",
        description: "Manager activation payment",
        order_id: orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#ff7b1a" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await api.post(API.BILLING.VERIFY_PAYMENT, response);
          dispatch(setUser(verifyRes.data.user));
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      });

      rz.open();
    } catch (err: any) {
      setPaymentError(err?.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return { paymentLoading, paymentError, handlePayNow };
}
