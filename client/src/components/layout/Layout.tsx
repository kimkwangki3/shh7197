import { ReactNode, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, CheckSquare, Lightbulb, ClipboardList, BookOpen, User, Bell, Menu, LogOut, ShieldCheck } from "lucide-react";
import KakaoLogin from "@/components/KakaoLogin";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ADMIN_TOKEN_KEY } from "@/components/admin/AdminLogin";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [location] = useLocation();
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (mainRef.current) mainRef.current.scrollTop = 0;
    }, [location]);

    // Verify admin status from server
    const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
        queryKey: ["/api/admin/check"],
        queryFn: async () => {
            const token = localStorage.getItem(ADMIN_TOKEN_KEY);
            if (!token) return { isAdmin: false };
            const res = await apiRequest("GET", "/api/admin/check", undefined, {
                headers: { "x-admin-token": token }
            });
            return res.json();
        }
    });

    const isAdmin = !!adminCheck?.isAdmin;

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const navItems = [
        { href: "/", label: "홍성훈", icon: User },
        { href: "/home", label: "홈", icon: Home },
        { href: "/votes", label: "투표소", icon: CheckSquare },
        { href: "/suggestions", label: "의견", icon: Lightbulb },
        { href: "/board", label: "게시판", icon: ClipboardList },
        ...(user?.isAdmin ? [{ href: "/promises", label: "공약", icon: BookOpen }] : []),
    ];

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    const handleAdminLogout = () => {
        if (confirm("관리자 모드를 종료하시겠습니까?")) {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex flex-col items-center">
            {/* Mobile Container (max-width 480px) */}
            <div className="w-full max-w-[480px] min-h-screen bg-white shadow-xl flex flex-col relative">

                {/* Header */}
                <header className="bg-primary px-4 py-2 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src="/images/candidate.png" alt="Candidate" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                            <h1 className="text-white font-bold text-[13px] leading-tight tracking-tight">
                                기호3 홍성훈
                                <span className="block text-[10px] font-medium opacity-90 tracking-normal">전남광주특별시의회의원선거 순천제7선거구 예비후보자</span>
                            </h1>
                            {isAdmin && (
                                <button
                                    onClick={handleAdminLogout}
                                    className="flex items-center gap-1 bg-amber-400 text-white px-2 py-0.5 rounded-full shadow-sm animate-in fade-in zoom-in-95 duration-300 hover:bg-amber-500 transition-colors cursor-pointer"
                                    title="관리자 로그아웃"
                                >
                                    <ShieldCheck className="w-3 h-3 fill-current" />
                                    <span className="text-[10px] font-black tracking-tighter uppercase">Admin</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main ref={mainRef} className="flex-1 pb-20">
                    {children}
                </main>

                {/* Bottom Tab Bar */}
                <nav className="h-16 bg-white border-t border-border fixed bottom-0 w-full max-w-[480px] flex items-center justify-around px-2 z-50">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive = location === href;
                        return (
                            <Link key={href} href={href}>
                                <a className={cn(
                                    "flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all",
                                    isActive ? "text-accent" : "text-muted-foreground hover:text-primary"
                                )}>
                                    <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                                    <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{label}</span>
                                    {isActive && <div className="absolute top-0 w-8 h-[2px] bg-accent rounded-full" />}
                                </a>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
