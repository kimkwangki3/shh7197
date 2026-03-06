import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
    BarChart3,
    Users,
    Calendar,
    MessageCircle,
    Share2,
    CheckCircle2,
    AlertCircle,
    Vote as VoteIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useSearch } from "wouter";
import CommentSection from "@/components/CommentSection";

interface VoteItem {
    id: string;
    title: string;
    description: string;
    category: string;
    endDate: string;
    options: string[];
    results: number[];
    allowMultiple: boolean;
    isHero: boolean;
    hasVoted: boolean;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

export default function Vote() {
    const { toast } = useToast();
    const search = useSearch();
    const [activeTab, setActiveTab] = useState<'ongoing' | 'ended'>('ongoing');
    const [openCommentId, setOpenCommentId] = useState<string | null>(null);

    const { data: votes, isLoading } = useQuery<{ success: boolean; data: VoteItem[] }>({
        queryKey: ["/api/votes"],
    });

    React.useEffect(() => {
        const params = new URLSearchParams(search);
        const id = params.get("id");
        if (id && votes?.data) {
            const targetVote = votes.data.find(v => v.id === id);
            if (targetVote) {
                const isEnded = new Date(targetVote.endDate) < new Date();
                setActiveTab(isEnded ? 'ended' : 'ongoing');
                setTimeout(() => {
                    const el = document.getElementById(`vote-${id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }, [search, votes?.data]);

    const mutation = useMutation({
        mutationFn: async ({ id, optionIndex }: { id: string; optionIndex: number }) => {
            const res = await apiRequest("POST", `/api/votes/${id}/vote`, { indices: [optionIndex] });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/votes"] });
            toast({
                title: "✅ 투표가 완료되었습니다.",
                description: "소중한 의견 감사합니다!",
            });
        },
        onError: (err: Error) => {
            toast({
                title: "투표 실패",
                description: err.message,
                variant: "destructive"
            });
        }
    });

    const handleVote = (id: string, optionIndex: number) => {
        const vote = votes?.data?.find(v => v.id === id);
        if (vote?.hasVoted) {
            toast({
                title: "이미 참여하셨습니다.",
                description: "이 주제에 이미 투표하셨습니다.",
                variant: "destructive"
            });
            return;
        }
        mutation.mutate({ id, optionIndex });
    };

    const handleShare = (item: VoteItem) => {
        const url = `${window.location.origin}${window.location.pathname}?id=${item.id}`;
        if (navigator.share) {
            navigator.share({
                title: item.title,
                text: item.description,
                url,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                toast({
                    title: "🔗 링크가 복사되었습니다!",
                    description: "공유 링크를 클립보드에 복사했습니다.",
                });
            });
        }
    };

    const filteredVotes = React.useMemo(() => {
        if (!votes?.data) return [];
        const now = new Date();
        return votes.data.filter((vote: VoteItem) => {
            const isEnded = new Date(vote.endDate) < now;
            return activeTab === 'ongoing' ? !isEnded : isEnded;
        });
    }, [votes?.data, activeTab]);

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
                        <Users className="w-3.5 h-3.5" /> 실시간 신대지구 투표소
                    </div>
                    <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight mb-2">당신의 의견을 들려주세요</h2>
                    <p className="text-[14px] text-slate-500 font-medium max-w-[280px] mx-auto">
                        신대지구의 정책, 우리 손으로 직접 결정합니다.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-5 mt-6 mb-2">
                <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
                    <button
                        onClick={() => setActiveTab('ongoing')}
                        className={cn(
                            "flex-1 py-3 text-[14px] font-black rounded-xl transition-all duration-300",
                            activeTab === 'ongoing'
                                ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        진행 중인 투표
                    </button>
                    <button
                        onClick={() => setActiveTab('ended')}
                        className={cn(
                            "flex-1 py-3 text-[14px] font-black rounded-xl transition-all duration-300",
                            activeTab === 'ended'
                                ? "bg-slate-800 text-white shadow-md shadow-slate-800/20 scale-[1.02]"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                        )}
                    >
                        종료된 투표
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {filteredVotes.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                            <BarChart3 className="w-9 h-9 text-slate-300" />
                        </div>
                        <p className="text-[15px] font-black text-slate-400">
                            {activeTab === 'ongoing'
                                ? "진행 중인 투표가 없습니다.\n곧 새로운 주제로 찾아뵙겠습니다."
                                : "종료된 투표가 없습니다."}
                        </p>
                    </div>
                ) : (
                    filteredVotes.map((item) => {
                        const results = item.results || [];
                        const options = item.options || [];
                        const total = results.reduce((acc, curr) => acc + curr, 0);
                        const isVoted = item.hasVoted;
                        const isEnded = new Date(item.endDate) < new Date();
                        const isCommentOpen = openCommentId === item.id;

                        return (
                            <Card key={item.id} id={`vote-${item.id}`} className={cn(
                                "border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] bg-white overflow-hidden transition-all duration-300",
                                isEnded && "opacity-80 grayscale-[0.3]"
                            )}>
                                <CardContent className="p-0">
                                    {/* Content Section */}
                                    <div className="p-8 pb-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className={cn(
                                                "text-[10px] font-black px-3 py-1.5 rounded-xl tracking-wider",
                                                isEnded ? "bg-slate-200 text-slate-500" : "bg-primary/20 text-primary"
                                            )}>
                                                {isEnded ? "투표 종료" : "진행 중"}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {isEnded ? "기한 만료" : `마감 ${format(new Date(item.endDate), "M/d", { locale: ko })}`}
                                            </div>
                                        </div>

                                        <h3 className="font-black text-[20px] text-slate-900 leading-[1.4] mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-8">
                                            {item.description}
                                        </p>

                                        {/* Visualization & Options */}
                                        <div className="space-y-4 mb-8">
                                            {options.map((option, idx) => {
                                                const count = results[idx] || 0;
                                                const rate = total === 0 ? 0 : Math.round((count / total) * 100);

                                                return (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex justify-between items-center px-1">
                                                            <span className="text-[13px] font-black text-slate-700">{option}</span>
                                                            <span className="text-[13px] font-black text-slate-400">{count.toLocaleString()}표 ({rate}%)</span>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "relative h-12 w-full bg-slate-50 rounded-2xl overflow-hidden group",
                                                                !isEnded && !isVoted && !mutation.isPending && "cursor-pointer active:scale-[0.98] transition-transform"
                                                            )}
                                                            onClick={() => !isEnded && !isVoted && !mutation.isPending && handleVote(item.id, idx)}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "h-full transition-all duration-1000",
                                                                    idx % 2 === 0 ? "bg-primary" : "bg-blue-400",
                                                                    isEnded && "bg-slate-400"
                                                                )}
                                                                style={{ width: `${rate}%` }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                                                <span className={cn(
                                                                    "text-[12px] font-black",
                                                                    rate > 15 ? "text-white" : "text-slate-400"
                                                                )}>
                                                                    {option}
                                                                </span>
                                                                {!isEnded && !isVoted && (
                                                                    <span className="text-[11px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        클릭하여 투표
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {(isVoted || isEnded) && (
                                            <p className="text-center text-[12px] font-bold text-slate-400 mt-4 flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                                {isEnded ? (
                                                    <><AlertCircle className="w-3.5 h-3.5" /> 종료된 투표입니다.</>
                                                ) : (
                                                    <><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> 참여가 완료된 투표입니다.</>
                                                )}
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
                                            <button
                                                onClick={() => setOpenCommentId(isCommentOpen ? null : item.id)}
                                                className={cn(
                                                    "flex items-center gap-1.5 transition-colors",
                                                    isCommentOpen ? "text-primary" : "text-slate-400 hover:text-primary"
                                                )}
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-[12px] font-black">
                                                    의견나눔 {item.commentCount > 0 && <span className="text-primary">({item.commentCount})</span>}
                                                </span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="text-slate-400 hover:text-primary transition-colors"
                                            title="공유하기"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Comment Section (expandable) */}
                                    {isCommentOpen && (
                                        <div className="px-8 py-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <CommentSection
                                                targetType="vote"
                                                targetId={item.id}
                                            />
                                        </div>
                                    )}
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
                            본 투표는 신대지구 주민의 의견을 수렴하기 위한 참고용이며, 중복 투표는 불가능합니다. 투명한 참여 문화를 만들어주세요.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
