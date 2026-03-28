import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-8 pb-20 px-6 text-center">
      <div className="max-w-[320px] mx-auto space-y-4">
        <div className="space-y-2">
          <h3 className="text-4xl font-black tracking-tight flex items-baseline justify-center gap-2">
            <span className="text-amber-400 text-5xl font-black">3</span>
            <span className="tracking-[0.2em]">홍 성 훈</span>
          </h3>
          <p className="text-slate-300 text-sm font-semibold">조국혁신당</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            전남광주통합특별시의회의원선거<br />
            순천제7선거구 예비후보자
          </p>
        </div>

        <div className="h-px bg-slate-800 w-full" />

        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] text-slate-500 font-medium">
            © {currentYear} HONG SEONG HOON. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <span>Made with</span>
            <Heart size={10} className="text-accent fill-accent" />
            <span>DSBH_KKK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}