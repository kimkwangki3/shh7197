import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-24 px-6 text-center">
      <div className="max-w-[320px] mx-auto space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">홍성훈</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            순천 신대지구의 더 나은 미래를 위해<br />
            진심을 다해 일하겠습니다.
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
            <span>for Suncheon Sindae</span>
          </div>
        </div>
      </div>
    </footer>
  );
}