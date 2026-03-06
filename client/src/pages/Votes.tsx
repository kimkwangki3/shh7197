import { useQuery, useMutation } from "@tanstack/react-query";
import { Vote } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Users } from "lucide-react";

export default function Votes() {
    const { toast } = useToast();
    const { data: votes, isLoading } = useQuery<{ success: boolean; data: Vote[] }>({
        queryKey: ["/api/votes"],
    });

    const voteMutation = useMutation({
        mutationFn: async ({ id, optionIndex }: { id: number; optionIndex: number }) => {
            const res = await apiRequest("POST", `/api/votes/${id}/vote`, { optionIndices: [optionIndex] });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/votes"] });
            toast({ title: "투표가 완료되었습니다.", description: "참여해주셔서 감사합니다!" });
        },
    });

    if (isLoading) {
        return (
            <div className="p-4 flex flex-col gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-6 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
            <header className="mb-2 px-2">
                <h2 className="text-2xl font-black text-slate-800 mb-1">신대지구 주민 투표</h2>
                <p className="text-sm text-slate-500 font-medium font-['Pretendard']">우리 동네의 중한 결정을 직접 내랴주세요.</p>
            </header>

            {votes?.data?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <p>현재 진행 중인 투표가 없습니다.</p>
                </div>
            )}

            {votes?.data?.map((vote) => {
                const results = vote.results || [];
                const options = vote.options || [];
                const total = results.reduce((acc, curr) => acc + curr, 0);
                const isEnded = new Date(vote.endDate) < new Date();

                return (
                    <div key={vote.id} className="relative bg-white rounded-[20px] shadow-sm border border-slate-100 overflow-hidden mx-1">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <Badge variant="secondary" className="bg-[#fee500]/20 text-[#3c1e1e] hover:bg-[#fee500]/30 border-none px-2 py-0.5 text-[10px] font-bold rounded-md">
                                    {vote.category}
                                </Badge>
                                {isEnded ? (
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">종료됨</span>
                                ) : (
                                    <span className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-1">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" /> 진행 중
                                    </span>
                                )}
                            </div>

                            <h3 className="text-[17px] font-bold text-[#1a1a1a] mb-5 leading-snug">
                                {vote.title}
                            </h3>

                            <div className="space-y-3 mb-6">
                                {options.map((option, idx) => {
                                    const count = results[idx] || 0;
                                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                                    return (
                                        <div key={idx} className="relative group cursor-pointer" onClick={() => !isEnded && voteMutation.mutate({ id: vote.id, optionIndex: idx })}>
                                            <div className="flex justify-between items-center mb-1.5 px-1">
                                                <span className="text-[13px] font-bold text-slate-700">
                                                    {idx === 0 ? "👍 " : idx === 1 ? "👎 " : "• "} {option}
                                                </span>
                                                <span className="text-[13px] font-black text-slate-900">{count}명</span>
                                            </div>
                                            <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000 ease-out",
                                                        idx === 0 ? "bg-[#fee500]" : "bg-slate-200"
                                                    )}
                                                    style={{ width: `${pct}%` }}
                                                />
                                                <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                                                    <span className="text-[11px] font-bold text-slate-500">{pct}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium border-t pt-4">
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>총 {total}명 참여</span>
                                </div>
                                <span>{new Date(vote.endDate).toLocaleDateString()} 까지</span>
                            </div>
                        </div>

                        {isEnded && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                                <Badge className="bg-slate-800 text-white border-none py-1.5 px-4 rounded-full text-xs">투표 종료</Badge>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
