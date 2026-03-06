import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const ADMIN_TOKEN_KEY = "admin_token";

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "로그인 실패");
            return data;
        },
        onSuccess: (data) => {
            if (data.token) {
                localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            }
            toast({
                title: "환영합니다!",
                description: "관리자 도구에 성공적으로 접속했습니다.",
            });
            onLoginSuccess();
            queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
        },
        onError: (error: Error) => {
            toast({
                title: "로그인 실패",
                description: error.message || "아이디 또는 비밀번호를 다시 확인해 주세요.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast({
                title: "알림",
                description: "아이디와 비밀번호를 모두 입력해 주세요.",
            });
            return;
        }
        loginMutation.mutate();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg shadow-primary/20">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
                    <p className="text-slate-500 mt-2">안전한 접속을 위해 관리자 계정으로 로그인하세요.</p>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 backdrop-blur-sm bg-white/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">인증</CardTitle>
                        <CardDescription>허가된 사용자만 접근할 수 있습니다.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username">아이디</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="관리자 아이디"
                                        className="pl-10 h-11 focus-visible:ring-primary/20 border-slate-200"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={loginMutation.isPending}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 focus-visible:ring-primary/20 border-slate-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loginMutation.isPending}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/25"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        로그인 중...
                                    </>
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                &copy; {new Date().getFullYear()} 홍성훈 신대지구 공동체 제안 플랫폼. All rights reserved.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
