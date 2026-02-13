"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHabits } from "@/store/habitSlice";
import api from "@/lib/axios";
import API from "@/lib/apiRoutes";

export default function Dashboard(){
    const dispatch = useDispatch();
    const habits = useSelector((state: any) => state.habits.list);

    useEffect(()=>{
        const loadHabits = async ()=>{
            const res = await api.get(API.HABITS.GET_ALL)

            dispatch(setHabits(res.data));
        };
        loadHabits();
    }, [])

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="mt-4">
                {habits.map((habit: any) => (
                    <div key={habit._id} className="border p-2 mb-2">
                        <h2 className="text-lg">{habit.title}</h2>
                        <p>{habit.streak}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}