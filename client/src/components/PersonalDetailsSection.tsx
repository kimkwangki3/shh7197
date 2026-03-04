import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Building, GraduationCap, Award, ChevronRight } from "lucide-react";
import candidatePortrait from "@assets/new_profile.png";
import appointment1 from "@assets/KakaoTalk_20250916_133547719_02_1758009010519.jpg";
import appointment2 from "@assets/KakaoTalk_20250916_133547719_03_1758009010520.jpg";

export default function PersonalDetailsSection() {
  const personalInfo = [
    { icon: CalendarDays, label: "생년월일", value: "1975년 2월 28일" },
    { icon: MapPin, label: "출생지", value: "전라남도 장흥군" },
    { icon: Building, label: "직장", value: "㈜포스코 플랜텍 리튬TF" }
  ];

  const educationHistory = [
    { school: "국립 경상대학교", major: "기계공학과 졸업" },
    { school: "순천공업고등학교", major: "공업계열 졸업" },
    { school: "회덕중학교", major: "중학교 졸업" }
  ];

  return (
    <section className="py-12 px-6 bg-[#F8FAFC]">
      {/* Profile Image & Basic Info */}
      <div className="flex flex-col items-center mb-10 text-center">
        <motion.div
          className="relative w-40 h-40 mb-6 rounded-3xl overflow-hidden border-4 border-white shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <img src={candidatePortrait} alt="홍성훈" className="w-full h-full object-cover object-top" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-1">홍성훈</h2>
          <p className="text-primary font-semibold mb-4">Hong Seong-hoon</p>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto">
            순천 신대지구의 더 나은 미래를 위해<br />
            주민과 함께 활동하는 실천가입니다.
          </p>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4 mb-12">
        {personalInfo.map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="text-slate-900 font-bold">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education & Appointments Sections */}
      <div className="space-y-6">
        {/* Education History */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 px-1">
            <GraduationCap className="text-primary" size={20} />
            학력 사항
          </h3>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
            {educationHistory.map((edu, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between group">
                <div>
                  <p className="font-bold text-slate-900">{edu.school}</p>
                  <p className="text-xs text-slate-400">{edu.major}</p>
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-primary transition-colors" size={16} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}