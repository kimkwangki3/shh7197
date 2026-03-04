import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Vote, Suggestion, Board, PromiseItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    BarChart3,
    MessageSquare,
    ClipboardList,
    BookOpen,
    Plus,
    Trash2,
    Edit,
    ExternalLink,
    Loader2
} from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("votes");

    // Queries
    const { data: votes, isLoading: votesLoading } = useQuery<Vote[]>({ queryKey: ["/api/admin/votes"] });
    const { data: suggestions, isLoading: suggestionsLoading } = useQuery<Suggestion[]>({ queryKey: ["/api/suggestions"] });
    const { data: boards, isLoading: boardsLoading } = useQuery<Board[]>({ queryKey: ["/api/board"] });
    const { data: promises, isLoading: promisesLoading } = useQuery<PromiseItem[]>({ queryKey: ["/api/promises"] });

    // Mutations
    const deleteVote = useMutation({
        mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/votes/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
            toast({ title: "삭제 완료", description: "투표가 성공적으로 삭제되었습니다." });
        }
    });

    const deleteSuggestion = useMutation({
        mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/suggestions/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
            toast({ title: "삭제 완료", description: "의견이 성공적으로 삭제되었습니다." });
        }
    });

    if (votesLoading || suggestionsLoading || boardsLoading || promisesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">관리자 대시보드</h1>
                    <p className="text-slate-500 mt-1">플랫폼의 모든 콘텐츠를 관리합니다.</p>
                </div>
                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        사이트 바로가기
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="총 투표" value={votes?.length || 0} icon={BarChart3} color="text-blue-600" />
                <StatCard title="총 의견" value={suggestions?.length || 0} icon={MessageSquare} color="text-indigo-600" />
                <StatCard title="총 게시물" value={boards?.length || 0} icon={ClipboardList} color="text-slate-600" />
                <StatCard title="진행중 공약" value={promises?.filter(p => p.status === "진행중").length || 0} icon={BookOpen} color="text-emerald-600" />
            </div>

            <Tabs defaultValue="votes" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                    <TabsTrigger value="votes">투표 관리</TabsTrigger>
                    <TabsTrigger value="suggestions">의견 관리</TabsTrigger>
                    <TabsTrigger value="board">게시판 관리</TabsTrigger>
                    <TabsTrigger value="promises">공약 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="votes">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>투표 목록</CardTitle>
                                <CardDescription>진행 중이거나 종료된 투표를 관리합니다.</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> 투표 생성
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-slate-50/50">
                                            <th className="h-10 px-4 text-left font-medium text-slate-500">제목</th>
                                            <th className="h-10 px-4 text-left font-medium text-slate-500">카테고리</th>
                                            <th className="h-10 px-4 text-center font-medium text-slate-500">참여수</th>
                                            <th className="h-10 px-4 text-center font-medium text-slate-500">상태</th>
                                            <th className="h-10 px-4 text-right font-medium text-slate-500">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {votes?.map((vote) => (
                                            <tr key={vote.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                <td className="p-4 align-middle font-medium">{vote.title}</td>
                                                <td className="p-4 align-middle text-slate-600">{vote.category}</td>
                                                <td className="p-4 align-middle text-center">{vote.agreeCount + vote.disagreeCount}</td>
                                                <td className="p-4 align-middle text-center">
                                                    <Badge variant={vote.isHero ? "default" : "secondary"}>
                                                        {vote.isHero ? "메인" : "일반"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteVote.mutate(vote.id)}><Trash2 className="w-4 h-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="suggestions">
                    <Card>
                        <CardHeader>
                            <CardTitle>시민 의견 목록</CardTitle>
                            <CardDescription>시민들이 남긴 의견과 제안을 검토하고 관리합니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {suggestions?.map((s) => (
                                    <div key={s.id} className="flex items-start justify-between p-4 border rounded-lg hover:border-slate-300 transition-colors">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline">{s.category}</Badge>
                                                <span className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="font-semibold text-slate-900">{s.title}</h4>
                                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{s.content}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteSuggestion.mutate(s.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="board">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>게시물 관리</CardTitle>
                                <CardDescription>공지사항 및 자유 게시판을 관리합니다.</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> 게시물 작성
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-slate-50/50">
                                            <th className="h-10 px-4 text-left font-medium text-slate-500">제목</th>
                                            <th className="h-10 px-4 text-left font-medium text-slate-500">구분</th>
                                            <th className="h-10 px-4 text-center font-medium text-slate-500">조회수</th>
                                            <th className="h-10 px-4 text-right font-medium text-slate-500">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boards?.map((item) => (
                                            <tr key={item.id} className="border-b transition-colors hover:bg-slate-50/50">
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        {item.isPinned && <Badge className="bg-amber-500">공지</Badge>}
                                                        {item.title}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-slate-600">{item.type}</td>
                                                <td className="p-4 align-middle text-center">{item.viewCount}</td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="promises">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>공약 관리</CardTitle>
                                <CardDescription>분야별 공약과 진행 상태를 관리합니다.</CardDescription>
                            </div>
                            <Button size="sm" className="gap-2">
                                <Plus className="w-4 h-4" /> 공약 추가
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {promises?.map((promise) => (
                                    <div key={promise.id} className="p-4 border rounded-lg flex justify-between items-center">
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1">{promise.category}</div>
                                            <div className="font-semibold">{promise.title}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{ width: `${promise.progress}%` }} />
                                                </div>
                                                <span className="text-xs font-medium">{promise.progress}%</span>
                                                <Badge variant="outline" className="text-[10px] h-4">{promise.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon"><Edit className="w-4 h-4 text-slate-400" /></Button>
                                            <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
