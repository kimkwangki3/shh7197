import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Suggestion } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MessageSquare,
    ThumbsUp,
    Plus,
    Search,
    ArrowRight,
    HelpCircle,
    User,
    Calendar,
    CheckCircle2,
    X,
    TrendingUp,
    ChevronRight,
    Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function Suggestions() {
    const { toast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({ title: "", content: "", category: "정책제안" });

    const { data: suggestions, isLoading } = useQuery<{ success: boolean; data: Suggestion[] }>({
        queryKey: ["/api/suggestions"],
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/suggestions", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
            setShowForm(false);
            setFormData({ title: "", content: "", category: "정책제안" });
            toast({ title: "의견이 등록되었습니다.", description: "소중한 의견 감사합니다!" });
        },
    });

    const categories = ["정책제안", "민원/건의", "궁금해요", "기타"];

    const filteredSuggestions = suggestions?.data?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && !suggestions) {
        return (
            <div className="p-4 space-y-6">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-48 w-full rounded-2xl" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Upper Hero Area */}
            <div className="bg-white px-6 pt-10 pb-8 border-b border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <Lightbulb className="w-32 h-32 rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-black mb-3">CITIZEN VOICE</span>
                            <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight">시민 의견함</h2>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">더 살기 좋은 동탄을 위한 제안</p>
                        </div>
                        {!showForm && (
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-primary text-white w-12 h-12 rounded-2xl p-0 shadow-lg shadow-blue-100 flex items-center justify-center transition-transform active:scale-95"
                            >
                                <Plus className="w-6 h-6" />
                            </Button>
                        )}
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="찾으시는 의견의 키워드를 입력하세요"
                            className="w-full pl-11 pr-4 h-13 bg-slate-50 border-none rounded-2xl text-[15px] focus:ring-2 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="p-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {showForm ? (
                    <Card className="border-none shadow-2xl shadow-blue-900/5 rounded-[32px] bg-white overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-7 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[18px] font-black text-slate-800 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-primary" />
                                    </div>
                                    의견 제안하기
                                </h3>
                                <button onClick={() => setShowForm(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[13px] font-bold text-slate-400 px-1">의견 카테고리</p>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={cn(
                                                "py-3.5 px-4 rounded-2xl text-[13px] font-black transition-all border-2",
                                                formData.category === cat
                                                    ? "bg-primary border-primary text-white shadow-lg shadow-blue-100"
                                                    : "bg-white border-slate-50 text-slate-400 hover:bg-slate-50"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4 mt-6">
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] font-bold text-slate-400 px-1">제목</p>
                                        <Input
                                            placeholder="간략하고 명확한 제목을 입력하세요"
                                            className="h-13 rounded-2xl bg-slate-50 border-none font-bold text-[15px] focus:bg-white focus:ring-primary/20 transition-all"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="text-[13px] font-bold text-slate-400 px-1">제안 내용</p>
                                        <Textarea
                                            placeholder="제안 배경과 구체적인 내용을 적어주세요. 시민들의 공감이 큰 변화를 만듭니다."
                                            className="min-h-[200px] rounded-2xl bg-slate-50 border-none p-5 text-[14px] font-medium leading-[1.6] resize-none focus:bg-white focus:ring-primary/20 transition-all"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-[16px] shadow-xl shadow-blue-100 mt-2 flex items-center justify-center gap-2"
                                onClick={() => mutation.mutate(formData)}
                                disabled={mutation.isPending || !formData.title || !formData.content}
                            >
                                <CheckCircle2 className="w-5 h-5" /> 소중한 의견 등록하기
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Topic Header */}
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[18px] font-black text-slate-800 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" /> 실시간 참여 현황
                                <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
                                    {filteredSuggestions?.length || 0}건
                                </span>
                            </h3>
                        </div>

                        {/* Suggestions Cards (Q&A Style) */}
                        <div className="flex flex-col gap-5">
                            {filteredSuggestions?.length === 0 ? (
                                <div className="py-24 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                                        <MessageSquare className="w-9 h-9 text-slate-300" />
                                    </div>
                                    <p className="text-[15px] font-black text-slate-400">아직 등록된 의견이 없어요.<br />첫 번째 목소리의 주인공이 되어보세요!</p>
                                </div>
                            ) : (
                                filteredSuggestions?.map((item) => (
                                    <div key={item.id} className="group relative">
                                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[28px] bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                                            <CardContent className="p-0">
                                                {/* Question Section */}
                                                <div className="p-6 pb-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <span className={cn(
                                                            "text-[10px] font-black px-3 py-1 rounded-full tracking-wider border",
                                                            item.category === '정책제안' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                                item.category === '민원/건의' ? "bg-red-50 text-red-600 border-red-100" :
                                                                    "bg-slate-100 text-slate-500 border-slate-200"
                                                        )}>
                                                            {item.category.toUpperCase()}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-bold">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {format(new Date(item.createdAt), "yyyy.MM.dd")}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[18px] text-slate-400">Q</div>
                                                        <div className="flex-1 space-y-2">
                                                            <h4 className="font-black text-[17px] text-slate-800 leading-snug group-hover:text-primary transition-colors">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                                                                {item.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Bar */}
                                                <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100/50">
                                                    <div className="flex items-center gap-5">
                                                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                                                            <ThumbsUp className="w-4 h-4" />
                                                            <span className="text-[12px] font-black">{item.likeCount}</span>
                                                        </button>
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></div>
                                                            <span className="text-[12px] font-bold">검토 중</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[11px] font-black text-primary group-hover:gap-1.5 transition-all">
                                                        자세히 <ChevronRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Decorative Shadow Blur for Premium Feel */}
                                        <div className="absolute -z-10 bg-primary/10 blur-3xl rounded-full w-24 h-24 opacity-0 group-hover:opacity-40 transition-opacity top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
