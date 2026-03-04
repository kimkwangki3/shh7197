import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  Heart
} from "lucide-react";
import { SiKakaotalk } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "소개", href: "#about" },
    { name: "경력", href: "#timeline" },
    { name: "연락처", href: "#contact" }
  ];

  const contactInfo = [
    { icon: Phone, text: "010-3641-0735" },
    { icon: Mail, text: "shh7197@naver.com" },
    { icon: MapPin, text: "전라남도 순천시" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "페이스북" },
    { icon: Instagram, href: "https://www.instagram.com/hongseonghun8064/", label: "인스타그램" },
    { icon: Youtube, href: "#", label: "유튜브" },
    { icon: SiKakaotalk, href: "#", label: "카카오톡" }
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-white py-16" data-testid="footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xl">홍</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">홍성훈</h3>
                <p className="text-white/80 text-sm">순천 신대지구를 위해 지금도 달리고 있습니다.</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              순천 신대지구 발전 위원회 · 순천 교육 발전 위원회 · ㈜포스코플랜텍 리튬TF에서
              활동하며 지역 사회 발전에 기여
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold">바로가기</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-white/80 hover:text-accent transition-colors duration-200"
                    data-testid={`footer-link-${link.name}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold">연락처</h4>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-center space-x-3" data-testid={`footer-contact-${index}`}>
                  <contact.icon className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-white/80 text-sm">{contact.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold">소셜미디어</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-200 group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`footer-social-${index}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-white group-hover:text-primary" />
                </motion.a>
              ))}
            </div>
            <p className="text-white/80 text-sm">
              일상과 공익 활동을 실시간으로 공유합니다
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              className="flex items-center space-x-2 text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span className="text-sm">
                © {currentYear} 홍성훈. 모든 권리 보유.
              </span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2 text-white/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-sm">Made with</span>
              <Heart className="h-4 w-4 text-accent" />
              <span className="text-sm">for the people</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}