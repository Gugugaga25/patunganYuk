"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type FlashType = "success" | "error" | "warning" | "info";

interface FlashContextType {
  showFlash: (title: string, message: string, type?: FlashType, duration?: number) => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export const FlashProvider = ({ children }: { children: React.ReactNode }) => {
  const [flash, setFlash] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: FlashType;
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
  });

  const showFlash = useCallback((title: string, message: string, type: FlashType = "error", duration = 4000) => {
    setFlash({ visible: true, title, message, type });

    const timer = setTimeout(() => {
      setFlash((prev) => ({ ...prev, visible: false }));
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideFlash = () => setFlash((prev) => ({ ...prev, visible: false }));

  return (
    <FlashContext.Provider value={{ showFlash }}>
      {children}
      {flash.visible && <FlashUI title={flash.title} message={flash.message} type={flash.type} onClose={hideFlash} />}
    </FlashContext.Provider>
  );
};

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) throw new Error("useFlash harus di dalam FlashProvider");
  return context;
};

const FlashUI = ({ title, message, type, onClose }: any) => {
  const config = {
    error: { border: "border-red-500", iconBg: "bg-red-500", iconShadow: "shadow-red-200", textColor: "text-red-600", icon: "fa-triangle-exclamation" },
    success: { border: "border-green-500", iconBg: "bg-green-500", iconShadow: "shadow-green-200", textColor: "text-green-600", icon: "fa-circle-check" },
    warning: { border: "border-yellow-500", iconBg: "bg-yellow-500", iconShadow: "shadow-yellow-200", textColor: "text-yellow-600", icon: "fa-circle-exclamation" },
    info: { border: "border-blue-500", iconBg: "bg-blue-500", iconShadow: "shadow-blue-200", textColor: "text-blue-600", icon: "fa-circle-info" },
  };

  const s = config[type as FlashType];

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[999] animate-pop px-4 w-full max-w-sm">
      <div className={`bg-white border-2 ${s.border} rounded-3xl p-5 shadow-2xl flex items-center gap-4`}>
        <div className={`${s.iconBg} text-white w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${s.iconShadow}`}>
          <i className={`fas ${s.icon}`}></i>
        </div>
        <div className="flex-1 text-left">
          <h4 className={`text-[10px] font-black uppercase tracking-widest ${s.textColor} leading-none`}>{title}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight mt-1">{message}</p>
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-red-500 transition-colors">
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>
  );
};
