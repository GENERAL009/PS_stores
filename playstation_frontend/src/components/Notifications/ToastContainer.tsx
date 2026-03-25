"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Toast } from "./Toast";

export const ToastContainer: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-none p-4 w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <Toast key={n.id} id={n.id} type={n.type} message={n.message} />
        ))}
      </AnimatePresence>
    </div>
  );
};
