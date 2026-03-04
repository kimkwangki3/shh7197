import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Vote as VoteType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ThumbsUp,
    ThumbsDown,
    BarChart3,
    Users,
    Calendar,
    ChevronRight,
    MessageCircle,
    Share2,
    CheckCircle2,
    AlertCircle,
    Vote as VoteIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";

export default function Vote() {
    const { checkAuthOrLogin } = useAuth();
    const { toast } = useToast();
    const [votedIds, setVotedIds] = useState<number[]>([]);

    const { data: votes, isLoading } = useQuery<{ success: boolean; data: VoteType[] }>({
        queryKey: ["/api/votes"],
    });

    const mutation = useMutation({
        mutationFn: async ({ id, type }: { id: number; type: "agree" | "disagree" }) => {
            const res = await apiRequest("POST", `/api/votes/${id}/vote`, { type });
            return res.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/votes"] });
            setVotedIds([...votedIds, variables.id]);
            toast({
                title: "투표가 완료되었습니다.",
                description: "소중한 의견 감사합니다!",
            });
        },
    });

    const handleVote = (id: number, type: "agree" | "disagree") => {
        if (votedIds.includes(id)) {
            toast({
                title: "이미 참여하셨습니다.",
                description: "이 주제에 이미 투표하셨습니다.",
                variant: "destructive"
            });
            return;
        }
        mutation.mutate({ id, type });
    };

    if (isLoading && !votes) {
        return (
            <div className="p-5 space-y-6">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-48 w-full rounded-3xl" />
                {[1, 2].map(i => <Skeleton key={i} className="h-64 w-full rounded-[32px]" />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header Area */}
            <div className="bg-white px-6 pt-10 pb-8 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <VoteIcon className="w-32 h-32 rotate-12" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-black mb-4">
                        <Users className="w-3.5 h-3.5" /> 실시간 시민 투표소
                    </div>
                    <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight mb-2">당신의 의견을 들려주세요</h2>
                    <p className="text-[14px] text-slate-500 font-medium max-w-[280px] mx-auto">
                        동탄의 정책, 시민의 손으로 직접 결정합니다.
                    </p>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {votes?.data?.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                            <BarChart3 className="w-9 h-9 text-slate-300" />
                        </div>
                        <p className="text-[15px] font-black text-slate-400">진행 중인 투표가 없습니다.<br />곧 새로운 주제로 찾아뵙겠습니다.</p>
                    </div>
                ) : (
                    votes?.data?.map((item) => {
                        const total = item.agreeCount + item.disagreeCount;
                        const agreeRate = total === 0 ? 0 : Math.round((item.agreeCount / total) * 100);
                        const disagreeRate = total === 0 ? 0 : 100 - agreeRate;
                        const isVoted = votedIds.includes(item.id);

                        return (
                            <Card key={item.id} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] bg-white overflow-hidden transition-all duration-300">
                                <CardContent className="p-0">
                                    {/* Content Section */}
                                    <div className="p-8 pb-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 tracking-wider">
                                                진행 중
                                            </span>
                                            <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                마감 D-12
                                            </div>
                                        </div>

                                        <h3 className="font-black text-[20px] text-slate-900 leading-[1.4] mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-8">
                                            {item.description}
                                        </p>

                                        {/* Visualization */}
                                        <div className="space-y-6 mb-8">
                                            <div className="relative h-14 w-full bg-slate-50 rounded-[20px] overflow-hidden flex">
                                                {/* Agree Progress */}
                                                <div
                                                    className="h-full bg-primary flex items-center px-4 transition-all duration-1000"
                                                    style={{ width: `${agreeRate}%` }}
                                                >
                                                    {agreeRate > 15 && (
                                                        <span className="text-white text-[13px] font-black">{agreeRate}%</span>
                                                    )}
                                                </div>
                                                {/* Disagree Progress */}
                                                <div
                                                    className="h-full bg-slate-200 flex items-center justify-end px-4 transition-all duration-1000"
                                                    style={{ width: `${disagreeRate}%` }}
                                                >
                                                    {disagreeRate > 15 && (
                                                        <span className="text-slate-500 text-[13px] font-black">{disagreeRate}%</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex justify-between px-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black text-primary mb-0.5">찬성</span>
                                                    <span className="text-[17px] font-black text-slate-800">{item.agreeCount.toLocaleString()}표</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-[11px] font-black text-slate-400 mb-0.5">반대</span>
                                                    <span className="text-[17px] font-black text-slate-500">{item.disagreeCount.toLocaleString()}표</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Voting Buttons */}
                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                            <Button
                                                onClick={() => checkAuthOrLogin(() => handleVote(item.id, 'agree'))}
                                                disabled={isVoted || mutation.isPending}
                                                className={cn(
                                                    "h-14 rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-2",
                                                    isVoted ? "bg-slate-100 text-slate-300" : "bg-primary text-white shadow-xl shadow-blue-100 active:scale-95"
                                                )}
                                            >
                                                <ThumbsUp className="w-4.5 h-4.5" /> 찬성
                                            </Button>
                                            <Button
                                                onClick={() => checkAuthOrLogin(() => handleVote(item.id, 'disagree'))}
                                                disabled={isVoted || mutation.isPending}
                                                className={cn(
                                                    "h-14 rounded-2xl font-black text-[15px] transition-all flex items-center justify-center gap-2 border-2",
                                                    isVoted ? "bg-slate-50 border-slate-50 text-slate-300" : "bg-white border-slate-100 text-slate-400 active:scale-95 hover:bg-slate-50"
                                                )}
                                            >
                                                <ThumbsDown className="w-4.5 h-4.5" /> 반대
                                            </Button>
                                        </div>

                                        {isVoted && (
                                            <p className="text-center text-[12px] font-bold text-primary mt-4 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> 참여가 완료된 투표입니다.
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="bg-slate-50/50 px-8 py-5 flex items-center justify-between border-t border-slate-100/50">
                                        <div className="flex items-center gap-5">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Users className="w-4 h-4" />
                                                <span className="text-[12px] font-black">{total.toLocaleString()}명 참여</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-[12px] font-black">42개 댓글</span>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}

                {/* Info Card */}
                <div className="bg-blue-50/50 rounded-[32px] p-6 flex gap-4 border border-blue-100/50 mt-2">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-[14px] font-black text-slate-800 mb-1">투표 안내사항</h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                            본 투표는 동탄 시민의 의견을 수렴하기 위한 참고용이며, 중복 투표는 불가능합니다. 투명한 참여 문화를 만들어주세요.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
