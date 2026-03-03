"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";
import { logout, setUser } from "@/store/authSlice";
import { clearStoredToken } from "@/lib/authToken";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(()=>{
    let active = true;

    (async ()=>{
       try {
       const res = await api.get(API.AUTH.ME);
        if(active) store.dispatch(setUser(res.data.user))
       } catch (error) {
        clearStoredToken();
        if (active) store.dispatch(logout());
       }
    })();
    return ()=>{
      active = false;
    };
  },[]);
  return <Provider store={store}>{children}</Provider>;
}
