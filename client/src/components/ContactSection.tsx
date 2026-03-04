import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare
} from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "전화번호",
      content: "010-3641-0735",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "이메일",
      content: "shh7197@naver.com",
      color: "text-primary",
      bg: "bg-primary/5"
    },
    {
      icon: MapPin,
      title: "활동 지역",
      content: "전라남도 순천시 신대지구",
      color: "text-accent",
      bg: "bg-accent/5"
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", href: "#", bg: "bg-[#1877F2]/10", color: "text-[#1877F2]" },
    { icon: Instagram, name: "Instagram", href: "https://www.instagram.com/hongseonghun8064/", bg: "bg-[#E4405F]/10", color: "text-[#E4405F]" },
    { icon: Youtube, name: "Youtube", href: "#", bg: "bg-[#FF0000]/10", color: "text-[#FF0000]" }
  ];

  return (
    <section id="contact" className="py-16 px-6 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">함께 소통해요</h2>
        <p className="text-slate-500 text-sm max-w-[240px] mx-auto">
          신대지구의 발전을 위한 소중한 의견을 기다립니다.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 ${info.bg} ${info.color} rounded-xl flex items-center justify-center`}>
                  <info.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">{info.title}</p>
                  <p className="text-slate-900 font-bold text-base leading-tight">{info.content}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Social Media Grid */}
      <div className="bg-slate-50 rounded-3xl p-6 text-center">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          소셜 미디어 채널
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              className="flex flex-col items-center gap-2"
              whileTap={{ scale: 0.9 }}
            >
              <div className={`w-14 h-14 ${social.bg} ${social.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <social.icon size={28} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{social.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}