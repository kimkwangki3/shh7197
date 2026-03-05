import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, CheckSquare, Lightbulb, ClipboardList, BookOpen, User, Bell, Menu, LogOut, ShieldCheck } from "lucide-react";
import KakaoLogin from "@/components/KakaoLogin";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [location] = useLocation();

    const navItems = [
        { href: "/", label: "홈", icon: Home },
        { href: "/votes", label: "투표소", icon: CheckSquare },
        { href: "/suggestions", label: "의견", icon: Lightbulb },
        { href: "/board", label: "게시판", icon: ClipboardList },
        { href: "/promises", label: "공약", icon: BookOpen },
        { href: "/profile", label: "홍성훈", icon: User },
    ];

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-secondary flex flex-col items-center">
            {/* Mobile Container (max-width 480px) */}
            <div className="w-full max-w-[480px] min-h-screen bg-white shadow-xl flex flex-col relative">

                {/* Header */}
                <header className="h-14 bg-primary px-4 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                            <img src="/images/candidate.png" alt="Candidate" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-white font-bold text-lg">홍성훈</h1>
                        <span className="text-white/80 text-xs hidden sm:inline">신대지구 주민 참여 플랫폼</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {user && (
                            <div className="flex items-center gap-3">
                                {user.avatarUrl && (
                                    <img src={user.avatarUrl} alt={user.nickname} className="w-8 h-8 rounded-full border-2 border-white/20" />
                                )}
                                {user.isAdmin && (
                                    <Link href="/admin">
                                        <button className="text-white p-2 hover:bg-white/10 rounded-full transition-colors" title="관리자 페이지">
                                            <ShieldCheck className="w-5 h-5" />
                                        </button>
                                    </Link>
                                )}
                                <button onClick={handleLogout} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                        <button className="text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 pb-20">
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
