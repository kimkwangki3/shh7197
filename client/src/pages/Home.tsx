import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Vote, Suggestion, Board } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Users, Clock, PlayCircle, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { checkAuthOrLogin } = useAuth();
  const { toast } = useToast();
  const { data: votesData, isLoading: votesLoading } = useQuery<{ success: boolean; data: Vote[] }>({
    queryKey: ["/api/votes"],
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<{ success: boolean; data: Suggestion[] }>({
    queryKey: ["/api/suggestions"],
  });

  const ongoingVotes = React.useMemo(() => {
    if (!votesData?.data) return [];
    const now = new Date();
    return votesData.data.filter(v => new Date(v.endDate) > now).slice(0, 3);
  }, [votesData?.data]);

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Ongoing Votes Section */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">🔥</span> 지금 진행중인 투표
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/votes")}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            전체보기 <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        {votesLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-[24px]" />)}
          </div>
        ) : ongoingVotes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {ongoingVotes.map((vote) => {
              const total = (vote.results || []).reduce((acc: number, curr: number) => acc + curr, 0);
              return (
                <div
                  key={vote.id}
                  onClick={() => setLocation(`/votes?id=${vote.id}`)}
                  className="group bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Plus className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black px-1.5 py-0.5">진행중</Badge>
                        <span className="text-[10px] text-slate-400 font-bold">D-{Math.max(0, Math.ceil((new Date(vote.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}</span>
                      </div>
                      <h3 className="text-[15px] font-black text-slate-800 truncate leading-tight group-hover:text-primary transition-colors">
                        {vote.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-bold">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{total.toLocaleString()}명 참여</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/50 border-dashed rounded-2xl h-32 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">진행 중인 투표가 없습니다.</p>
          </Card>
        )}
      </section>

      {/* Latest Suggestions */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">✏️</span> 오늘의 시민 목소리
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/suggestions")}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            더 보기 <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {suggestionsLoading ? (
            [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
          ) : suggestions?.data?.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              onClick={() => checkAuthOrLogin(() => setLocation(`/suggestions?id=${item.id}`))}
              className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white cursor-pointer relative"
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-semibold text-sm mb-1 truncate">"{item.title}"</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.content}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">👍 {item.likeCount}</span>
                      <span>방금 전</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="w-full rounded-xl border-dashed py-6 text-muted-foreground hover:text-primary hover:bg-primary/5 group"
            onClick={() => checkAuthOrLogin(() => setLocation("/suggestions"))}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> 새로운 의견 남기기
            </div>
          </Button>
        </div>
      </section>

      {/* Hong Seong-hoon TV */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">📺</span> 홍성훈 TV
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map(i => (
            <Card key={i} className="border-none shadow-sm overflow-hidden rounded-2xl group cursor-pointer">
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <PlayCircle className="w-8 h-8 text-white relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                {/* 썸네일 이미지 자리 */}
                <div className="w-full h-full bg-slate-200" />
              </div>
              <CardContent className="p-2.5">
                <h4 className="text-[11px] font-bold line-clamp-2 leading-snug">
                  [현장속으로] 시민들의 목소리를 직접 들으러 갔습니다 #{i}
                </h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <Button
        onClick={() => checkAuthOrLogin(() => setLocation("/suggestions"))}
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0 flex items-center justify-center border-none z-40 transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}