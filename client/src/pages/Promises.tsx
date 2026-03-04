import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PromiseItem } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    Target,
    CheckCircle2,
    Circle,
    TrendingUp,
    LayoutGrid,
    List,
    ChevronRight,
    MapPin,
    Calendar,
    Award
} from "lucide-react";

export default function Promises() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { data: promises, isLoading } = useQuery<{ success: boolean; data: PromiseItem[] }>({
        queryKey: ["/api/promises"],
    });

    // Mock total stats for the summary card
    const totalPromises = 28;
    const completedPromises = 12;
    const ongoingPromises = 10;
    const overallProgress = 68;

    if (isLoading && !promises) {
        return (
            <div className="p-5 space-y-6">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-40 w-full rounded-3xl" />
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/30 pb-20">
            {/* Header Area */}
            <div className="bg-white px-6 pt-10 pb-8 border-b border-slate-100 relative overflow-hidden text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-black mb-4">
                    <Award className="w-3.5 h-3.5" /> 10대 핵심 공약 실천 보고
                </div>
                <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight mb-2">약속과 이행</h2>
                <p className="text-[14px] text-slate-500 font-medium max-w-[280px] mx-auto">
                    동탄의 내일을 위한 약속,<br />
                    꼼꼼하게 챙기고 투명하게 보고합니다.
                </p>
            </div>

            <div className="p-5 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* Overall Progress Summary Card */}
                <Card className="border-none bg-primary rounded-[32px] overflow-hidden shadow-xl shadow-blue-200 relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <CheckCircle2 className="w-32 h-32 text-white" />
                    </div>

                    <CardContent className="p-8 relative z-10 text-white">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-white/70 text-[13px] font-bold mb-1">전체 공약 이행률</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[42px] font-black leading-none">{overallProgress}</span>
                                    <span className="text-[20px] font-bold opacity-70">%</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex px-3 py-1.5 rounded-xl bg-white/20 text-[12px] font-black">정상 추진 중</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative h-3 w-full bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000"
                                    style={{ width: `${overallProgress}%` }}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <p className="text-[10px] font-bold opacity-60 mb-1">총 공약</p>
                                    <p className="text-[16px] font-black">{totalPromises}</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <p className="text-[10px] font-bold opacity-60 mb-1">이행완료</p>
                                    <p className="text-[16px] font-black text-green-300">{completedPromises}</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-3 text-center">
                                    <p className="text-[10px] font-bold opacity-60 mb-1">정상추진</p>
                                    <p className="text-[16px] font-black text-blue-200">{ongoingPromises}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gallery List Area */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[18px] font-black text-slate-800">분야별 상세 공약</h3>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-400")}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className={cn(
                        "gap-5",
                        viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
                    )}>
                        {promises?.data?.map((item) => (
                            <Card key={item.id} className="border-none shadow-[0_8px_25px_rgba(0,0,0,0.03)] rounded-[28px] bg-white overflow-hidden group hover:shadow-[0_15px_40px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300">
                                {/* Thumbnail / Category Placeholder */}
                                <div className="h-44 bg-slate-100 relative overflow-hidden">
                                    <img
                                        src={item.imageUrl || `https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop`}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/90 backdrop-blur-md text-primary border-none font-black px-3 py-1 text-[10px] shadow-sm">
                                            {item.category}
                                        </Badge>
                                    </div>

                                    <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            item.status === 'completed' ? "bg-green-400 animate-pulse" : "bg-blue-400 animate-pulse"
                                        )} />
                                        <span className="text-[11px] font-black uppercase tracking-wider shadow-black text-shadow-sm">
                                            {item.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS'}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <h4 className="font-black text-[17px] text-slate-800 leading-snug mb-3">
                                        {item.title}
                                    </h4>
                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-5">
                                        {item.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[12px] font-black">
                                            <span className="text-primary flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5" /> 진행도
                                            </span>
                                            <span className="text-slate-800">{item.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-700",
                                                    item.status === 'completed' ? "bg-green-400" : "bg-primary"
                                                )}
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 py-3 rounded-2xl bg-slate-50 text-[12px] font-black text-slate-400 flex items-center justify-center gap-1 hover:bg-primary/5 hover:text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-100">
                                        상세 이행 보고 보기 <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-slate-900 rounded-[32px] p-8 text-center text-white space-y-4">
                    <p className="text-[13px] font-bold text-white/50">공약은 시민과의 약속입니다</p>
                    <h3 className="text-[20px] font-black leading-tight">투명한 공개, 확실한 책임으로<br />결과로 보답하겠습니다.</h3>
                    <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-6"></div>
                </div>

            </div>
        </div>
    );
}
