"use client";
import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { NotificationType, useNotificationStore } from "@/store/useNotificationStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToastProps {
  id: string;
  type: NotificationType;
  message: string;
}

const icons = {
  success: <CheckCircle className="text-green-400" size={20} />,
  error: <AlertCircle className="text-red-400" size={20} />,
  info: <Info className="text-blue-400" size={20} />,
  warning: <AlertTriangle className="text-yellow-400" size={20} />,
};

const styles = {
  success: "border-green-500/20 bg-green-950/80 text-green-200 shadow-green-500/10",
  error: "border-red-500/20 bg-red-950/80 text-red-200 shadow-red-500/10",
  info: "border-blue-500/20 bg-blue-950/80 text-blue-200 shadow-blue-500/10",
  warning: "border-yellow-500/20 bg-yellow-950/80 text-yellow-200 shadow-yellow-500/10",
};

export const Toast: React.FC<ToastProps> = ({ id, type, message }) => {
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      layout
      className={cn(
        "flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-md shadow-2xl pointer-events-auto mt-4",
        styles[type]
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button
        onClick={() => removeNotification(id)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
