import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ADMIN_TOKEN_KEY } from "@/components/admin/AdminLogin";
import { ShieldCheck } from "lucide-react";

import { useNavigate } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useNavigate();

  const navItems = [
    { name: "소개", href: "#about" },
    { name: "경력", href: "#timeline" },
    { name: "연락처", href: "#contact" }
  ];

  // Verify admin status from server
  const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return { isAdmin: false };
      try {
        const res = await apiRequest("GET", "/api/admin/check", undefined, {
          headers: { "x-admin-token": token }
        });
        return res.json();
      } catch (e) {
        return { isAdmin: false };
      }
    }
  });

  const isAdmin = !!adminCheck?.isAdmin;

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAdminLogout = () => {
    if (confirm("관리자 모드를 종료하시겠습니까?")) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
      window.location.reload();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">홍</span>
              </div>
              {isAdmin && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm"
                  title="관리자 모드 활성화"
                >
                  <ShieldCheck className="w-3 h-3" />
                </motion.div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-primary">홍성훈</h1>
                {isAdmin && (
                  <button
                    onClick={handleAdminLogout}
                    className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-tighter hover:bg-amber-200 transition-colors cursor-pointer"
                    title="관리자 로그아웃"
                  >
                    Admin
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">순천 신대지구를 위해 지금도 달리고 있습니다.</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                data-testid={`nav-link-${item.name}`}
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => handleNavClick("#contact")}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-contact"
            >
              연락하기
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-3 space-y-2 border-t border-border mt-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left py-2 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                    data-testid={`mobile-nav-link-${item.name}`}
                  >
                    {item.name}
                  </button>
                ))}
                <Button
                  onClick={() => handleNavClick("#contact")}
                  className="w-full mt-4"
                  data-testid="mobile-button-contact"
                >
                  연락하기
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}