import { useQuery } from "@tanstack/react-query";
import { Vote, Suggestion, Board } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Clock, PlayCircle, MessageSquare, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: heroVote, isLoading: heroLoading } = useQuery<{ success: boolean; data: Vote }>({
    queryKey: ["/api/votes/hero"],
  });

  const { data: suggestions, isLoading: suggestionsLoading } = useQuery<{ success: boolean; data: Suggestion[] }>({
    queryKey: ["/api/suggestions"],
  });

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Hero Section - Hot Vote */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">🔥</span> 지금 뜨거운 투표
          </h2>
          <Link href="/votes">
            <a className="text-xs text-muted-foreground flex items-center">전체보기 <ChevronRight className="w-3 h-3" /></a>
          </Link>
        </div>

        {heroLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : heroVote?.data ? (
          <Card className="bg-gradient-to-br from-[#1A6FD4] to-[#0D4C9A] border-none text-white overflow-hidden rounded-2xl shadow-blue-200 shadow-lg">
            <CardContent className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30">
                  {heroVote.data.category}
                </Badge>
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <Clock className="w-3 h-3" /> D-14
                </div>
              </div>

              <h3 className="text-xl font-bold leading-tight">
                "{heroVote.data.title}"
              </h3>

              <div className="flex items-center gap-3 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {heroVote.data.agreeCount + heroVote.data.disagreeCount}명 참여중
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12">
                  O 찬성
                </Button>
                <Button className="bg-slate-200 text-slate-600 hover:bg-slate-300 border-none font-bold rounded-xl h-12">
                  X 반대
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50 border-dashed rounded-2xl h-48 flex items-center justify-center">
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
          <Link href="/suggestions">
            <a className="text-xs text-muted-foreground flex items-center">더 보기 <ChevronRight className="w-3 h-3" /></a>
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {suggestionsLoading ? (
            [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
          ) : suggestions?.data?.slice(0, 3).map((item) => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white">
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
                <Link href={`/suggestions/${item.id}`}>
                  <a className="absolute inset-0" />
                </Link>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" className="w-full rounded-xl border-dashed py-6 text-muted-foreground hover:text-primary hover:bg-primary/5 group" asChild>
            <Link href="/suggestions">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> 새로운 의견 남기기
              </div>
            </Link>
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
      <Button className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 p-0 flex items-center justify-center border-none z-40 transition-transform active:scale-95">
        <Link href="/suggestions">
          <div className="flex items-center justify-center w-full h-full">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </Link>
      </Button>
    </div>
  );
}