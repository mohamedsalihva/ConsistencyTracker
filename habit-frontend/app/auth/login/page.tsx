"use client";

import { useState } from "react";;
import { setUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

export default function LoginPage(){
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async ()=>{
        try {
            const res = await  api.post(API.AUTH.LOGIN,{
                email,
                password,
            });
            
            dispatch(setUser(res.data.user));

        } catch (error: any) {
            console.error("Invalid email or password", error);
        }
    };

    return(
        <div className=""></div>

    )
}