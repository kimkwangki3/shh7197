import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

declare global {
    interface Window {
        Kakao: any;
    }
}

export function useAuth() {
    const { toast } = useToast();
    const [user, setUser] = useState<any>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const loginMutation = useMutation({
        mutationFn: async (userData: any) => {
            const res = await apiRequest("POST", "/api/auth/kakao", userData);
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.data));
                setUser(data.data);
                toast({
                    title: "반갑습니다!",
                    description: `${data.data.nickname}님, 환영합니다.`,
                });
            }
        },
        onError: () => {
            toast({
                title: "오류",
                description: "로그인 처리 중 문제가 발생했습니다.",
                variant: "destructive",
            });
        },
    });

    const login = useCallback(() => {
        if (!window.Kakao) {
            toast({
                title: "오류",
                description: "카카오 SDK를 로드할 수 없습니다. 잠시 후 다시 시도해주세요.",
                variant: "destructive",
            });
            return;
        }

        if (!window.Kakao.isInitialized()) {
            try {
                window.Kakao.init('9c016096164155750e7d5adc6e17d4da');
            } catch (e) {
                console.error("Kakao init error:", e);
            }
        }

        window.Kakao.Auth.login({
            success: function () {
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res: any) {
                        loginMutation.mutate({
                            id: res.id.toString(),
                            nickname: res.kakao_account.profile.nickname,
                            avatarUrl: res.kakao_account.profile.thumbnail_image_url
                        });
                    },
                    fail: function (error: any) {
                        console.error(error);
                    },
                });
            },
            fail: function (err: any) {
                console.error(err);
            },
        });
    }, [loginMutation, toast]);

    const logout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
        window.location.reload();
    }, []);

    const checkAuthOrLogin = useCallback((callback: () => void) => {
        if (user) {
            callback();
        } else {
            login();
        }
    }, [user, login]);

    return {
        user,
        login,
        logout,
        checkAuthOrLogin,
        isLoading: loginMutation.isPending
    };
}
