import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

declare global {
    interface Window {
        Kakao: any;
    }
}

export default function KakaoLogin() {
    const { toast } = useToast();

    const loginMutation = useMutation({
        mutationFn: async (userData: any) => {
            const res = await apiRequest("POST", "/api/auth/kakao", userData);
            return res.json();
        },
        onSuccess: (data) => {
            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.user));
                toast({
                    title: "로그인 성공",
                    description: `${data.user.nickname}님, 환영합니다!`,
                });
                window.location.reload();
            }
        },
        onError: () => {
            toast({
                title: "로그인 실패",
                description: "카카오 로그인 중 오류가 발생했습니다.",
                variant: "destructive",
            });
        },
    });

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            toast({
                title: "오류",
                description: "카카오 SDK를 로드할 수 없습니다. 잠시 후 다시 시도해주세요.",
                variant: "destructive",
            });
            return;
        }

        // Initialize if not already done
        if (!window.Kakao.isInitialized()) {
            try {
                window.Kakao.init('9c016096164155750e7d5adc6e17d4da');
            } catch (e) {
                console.error("Kakao init error:", e);
            }
        }

        const kakaoLoginAction = () => {
            if (!window.Kakao) return;

            if (!window.Kakao.isInitialized()) {
                window.Kakao.init('9c016096164155750e7d5adc6e17d4da');
            }

            window.Kakao.Auth.login({
                success: function () {
                    window.Kakao.API.request({
                        url: '/v2/user/me',
                        success: function (res: any) {
                            loginMutation.mutate({
                                id: res.id.toString(),
                                nickname: res.properties?.nickname || res.kakao_account?.profile?.nickname,
                                avatarUrl: res.properties?.thumbnail_image || res.kakao_account?.profile?.thumbnail_image_url,
                            });
                        },
                        fail: function (error: any) {
                            console.error("Kakao API request failed:", error);
                        },
                    });
                },
                fail: function (error: any) {
                    console.error("Kakao Login failed:", error);
                },
            });
        };

        if (window.Kakao && window.Kakao.Auth) {
            kakaoLoginAction();
        } else {
            console.warn("Kakao SDK not ready, retrying...");
            let retryCount = 0;
            const interval = setInterval(() => {
                retryCount++;
                if (window.Kakao && window.Kakao.Auth) {
                    clearInterval(interval);
                    kakaoLoginAction();
                } else if (retryCount > 10) {
                    clearInterval(interval);
                }
            }, 500);
        }
    };

    return (
        <Button
            onClick={handleKakaoLogin}
            className="bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-black h-10 px-4 rounded-xl gap-2 border-none transition-all active:scale-95"
        >
            <MessageCircle className="w-4 h-4 fill-[#191919]" />
            카카오 로그인
        </Button>
    );
}
