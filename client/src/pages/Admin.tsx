import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Vote, Suggestion, Board, PromiseItem, Comment } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    BarChart3, MessageSquare, ClipboardList, BookOpen,
    Plus, Trash2, ExternalLink, Loader2, LogOut, RefreshCcw,
    Users, ShieldCheck, Send, X, ImageIcon, Pencil, ThumbsUp, Settings
} from "lucide-react";
import { Link } from "wouter";
import AdminLogin, { ADMIN_TOKEN_KEY } from "@/components/admin/AdminLogin";

// ─── 인증 헬퍼 ──────────────────────────────────────────────────
function getToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

async function adminFetch(method: string, url: string, data?: unknown) {
    const headers: Record<string, string> = { "x-admin-token": getToken() };
    if (data) headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json();
}

async function publicFetch(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

// ─── 투표 생성 폼 ─────────────────────────────────────────────
function VoteCreateForm({ onClose }: { onClose: () => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // 기본 날짜를 오늘 자정으로 설정
    const today = new Date();
    today.setHours(23, 59, 0, 0);
    const defaultDateStr = today.toISOString().slice(0, 16);

    const [form, setForm] = useState({
        title: "", description: "", category: "정책",
        endDate: defaultDateStr, isHero: false, durationDays: "1",
        options: ["", ""], // 최소 2개 항목
        allowMultiple: false
    });

    const createVote = useMutation({
        mutationFn: (data: unknown) => adminFetch("POST", "/api/admin/votes", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
            toast({ title: "✅ 투표 생성 완료", description: "새로운 투표가 등록되었습니다." });
            onClose();
        },
        onError: () => toast({ title: "❌ 오류", description: "투표 생성에 실패했습니다.", variant: "destructive" })
    });

    // 기간 선택 시 날짜 자동 계산
    useEffect(() => {
        const days = parseInt(form.durationDays);
        if (!isNaN(days)) {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + days);
            newDate.setHours(23, 59, 0, 0);
            setForm(f => ({ ...f, endDate: newDate.toISOString().slice(0, 16) }));
        }
    }, [form.durationDays]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredOptions = form.options.filter(opt => opt.trim() !== "");

        if (!form.title || !form.endDate) return toast({ title: "입력 오류", description: "제목과 마감일을 입력해주세요.", variant: "destructive" });
        if (filteredOptions.length < 2) return toast({ title: "입력 오류", description: "투표 항목을 최소 2개 이상 입력해주세요.", variant: "destructive" });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { durationDays, ...submitData } = form;
        createVote.mutate({
            ...submitData,
            options: filteredOptions,
            endDate: new Date(form.endDate).toISOString()
        });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm(f => ({ ...f, options: newOptions }));
    };

    const addOption = () => {
        setForm(f => ({ ...f, options: [...f.options, ""] }));
    };

    const removeOption = (index: number) => {
        if (form.options.length <= 2) return;
        const newOptions = form.options.filter((_, i) => i !== index);
        setForm(f => ({ ...f, options: newOptions }));
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-blue-800 flex items-center gap-2"><Plus className="w-4 h-4" /> 신규 투표 생성</h3>
                <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="투표 제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="col-span-full" />
                <Textarea placeholder="투표 설명" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="col-span-full min-h-[80px]" />

                <div className="col-span-full space-y-2">
                    <label className="text-xs font-medium text-slate-500 ml-1">투표 항목</label>
                    {form.options.map((option, idx) => (
                        <div key={idx} className="flex gap-2">
                            <Input
                                placeholder={`항목 ${idx + 1}`}
                                value={option}
                                onChange={e => updateOption(idx, e.target.value)}
                            />
                            {form.options.length > 2 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(idx)}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full border-dashed border-blue-300 text-blue-600 bg-white">
                        + 항목 추가
                    </Button>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">카테고리</label>
                    <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
                        {["정책", "교통", "복지", "환경", "교육", "안전", "기타"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">투표 기간 (일)</label>
                    <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))}>
                        {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}일 동안 진행</option>)}
                    </select>
                </div>
                <div className="col-span-full flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">마감 일시</label>
                    <Input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="text-sm" />
                </div>
                <div className="col-span-full flex gap-4 mt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.isHero} onChange={e => setForm(f => ({ ...f, isHero: e.target.checked }))} className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
                        <span className="font-medium text-slate-700">히어로 투표로 지정</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.allowMultiple} onChange={e => setForm(f => ({ ...f, allowMultiple: e.target.checked }))} className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
                        <span className="font-medium text-slate-700">복수 선택 허용</span>
                    </label>
                </div>
                <div className="col-span-full flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>취소</Button>
                    <Button type="submit" disabled={createVote.isPending} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
                        {createVote.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "투표 등록"}
                    </Button>
                </div>
            </form>
        </div>
    );
}


// ─── 투표 수정 폼 ─────────────────────────────────────────────
function VoteEditForm({ vote, onClose }: { vote: Vote; onClose: () => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        title: vote.title,
        description: vote.description,
        category: vote.category,
        endDate: new Date(vote.endDate).toISOString().slice(0, 16),
        isHero: vote.isHero,
        allowMultiple: vote.allowMultiple,
        options: vote.options.length > 0 ? [...vote.options] : ["", ""],
        results: vote.results.length > 0 ? [...vote.results] : [],
    });

    const updateVote = useMutation({
        mutationFn: (data: unknown) => adminFetch("PUT", `/api/admin/votes/${vote.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] });
            toast({ title: "✅ 투표 수정 완료", description: "투표 내용이 업데이트되었습니다." });
            onClose();
        },
        onError: () => toast({ title: "❌ 오류", description: "투표 수정에 실패했습니다.", variant: "destructive" })
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredOptions = form.options.filter(opt => opt.trim() !== "");
        if (!form.title || !form.endDate) return toast({ title: "입력 오류", description: "제목과 마감일을 입력해주세요.", variant: "destructive" });
        if (filteredOptions.length < 2) return toast({ title: "입력 오류", description: "투표 항목을 최소 2개 이상 입력해주세요.", variant: "destructive" });

        const optionsChanged = JSON.stringify(filteredOptions) !== JSON.stringify(vote.options);
        const submitData: Record<string, unknown> = {
            ...form,
            options: filteredOptions,
            endDate: new Date(form.endDate).toISOString(),
            results: optionsChanged
                ? new Array(filteredOptions.length).fill(0)
                : form.results.slice(0, filteredOptions.length),
        };
        updateVote.mutate(submitData);
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm(f => ({ ...f, options: newOptions }));
    };

    const addOption = () => setForm(f => ({ ...f, options: [...f.options, ""] }));

    const removeOption = (index: number) => {
        if (form.options.length <= 2) return;
        setForm(f => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
    };

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-orange-800 flex items-center gap-2"><Pencil className="w-4 h-4" /> 투표 수정</h3>
                <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="투표 제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="col-span-full" />
                <Textarea placeholder="투표 설명" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="col-span-full min-h-[80px]" />

                <div className="col-span-full space-y-2">
                    <label className="text-xs font-medium text-slate-500 ml-1">
                        투표 항목 <span className="text-orange-500">(항목 변경 시 기존 투표 결과가 초기화됩니다)</span>
                    </label>
                    {form.options.map((option, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <Input
                                placeholder={`항목 ${idx + 1}`}
                                value={option}
                                onChange={e => updateOption(idx, e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-xs text-slate-400 whitespace-nowrap">투표수</span>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.results[idx] ?? 0}
                                    onChange={e => {
                                        const newResults = [...form.results];
                                        newResults[idx] = Number(e.target.value);
                                        setForm(f => ({ ...f, results: newResults }));
                                    }}
                                    className="w-20 text-center text-sm"
                                />
                            </div>
                            {form.options.length > 2 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(idx)}>
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="w-full border-dashed border-orange-300 text-orange-600 bg-white">
                        + 항목 추가
                    </Button>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">카테고리</label>
                    <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {["정책", "교통", "복지", "환경", "교육", "안전", "기타"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 ml-1">마감 일시</label>
                    <Input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="text-sm" />
                </div>

                <div className="col-span-full flex gap-4 mt-1">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.isHero} onChange={e => setForm(f => ({ ...f, isHero: e.target.checked }))} className="w-4 h-4 rounded" />
                        <span className="font-medium text-slate-700">히어로 투표로 지정</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.allowMultiple} onChange={e => setForm(f => ({ ...f, allowMultiple: e.target.checked }))} className="w-4 h-4 rounded" />
                        <span className="font-medium text-slate-700">복수 선택 허용</span>
                    </label>
                </div>
                <div className="col-span-full flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>취소</Button>
                    <Button type="submit" disabled={updateVote.isPending} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[100px]">
                        {updateVote.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "수정 완료"}
                    </Button>
                </div>
            </form>
        </div>
    );
}


// ─── 게시판 글 생성 폼 ────────────────────────────────────────
function BoardCreateForm({ onClose }: { onClose: () => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ type: "notice", title: "", content: "", imageUrl: "", isPinned: false });

    const createBoard = useMutation({
        mutationFn: (data: unknown) => adminFetch("POST", "/api/admin/board", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/board"] });
            toast({ title: "✅ 게시글 등록 완료" });
            onClose();
        },
        onError: () => toast({ title: "❌ 오류", description: "게시글 등록 실패", variant: "destructive" })
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.content) return toast({ title: "입력 오류", description: "제목과 내용을 입력해주세요.", variant: "destructive" });
        createBoard.mutate(form);
    };

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-amber-800 flex items-center gap-2"><Plus className="w-4 h-4" /> 게시글 작성</h3>
                <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <select className="border rounded-lg px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="notice">공지사항</option>
                        <option value="activity-shinday">신대지구발전</option>
                        <option value="activity-welfare">장애인 교육지원</option>
                        <option value="activity-edu">교육발전협력</option>
                        <option value="activity-community">지역소통</option>
                        <option value="free">자유게시판</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} />
                        상단 고정
                    </label>
                </div>
                <Input placeholder="제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <Textarea placeholder="내용" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="min-h-[120px]" />
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <Input placeholder="이미지 URL (선택사항)" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="미리보기" className="h-32 object-cover rounded-lg" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>취소</Button>
                    <Button type="submit" disabled={createBoard.isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
                        {createBoard.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "게시글 등록"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ─── 공약 생성 폼 ─────────────────────────────────────────────
function PromiseCreateForm({ onClose }: { onClose: () => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        category: "교통", title: "", description: "",
        status: "계획중", progress: 0, imageUrl: "", keyPoints: [""]
    });

    const createPromise = useMutation({
        mutationFn: (data: unknown) => adminFetch("POST", "/api/admin/promises", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/promises"] });
            toast({ title: "✅ 공약 등록 완료" });
            onClose();
        },
        onError: () => toast({ title: "❌ 오류", description: "공약 등록 실패", variant: "destructive" })
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) return toast({ title: "입력 오류", variant: "destructive" });
        createPromise.mutate({ ...form, keyPoints: form.keyPoints.filter(k => k.trim()) });
    };

    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-emerald-800 flex items-center gap-2"><Plus className="w-4 h-4" /> 공약 등록</h3>
                <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <select className="border rounded-lg px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {["교통", "복지", "환경", "교육", "안전", "경제", "문화", "기타"].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select className="border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="계획중">계획중</option>
                        <option value="진행중">진행중</option>
                        <option value="이행완료">이행완료</option>
                    </select>
                </div>
                <Input placeholder="공약 제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <Textarea placeholder="공약 설명" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="min-h-[100px]" />
                <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 whitespace-nowrap">진행률 {form.progress}%</label>
                    <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} className="flex-1" />
                </div>
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <Input placeholder="이미지 URL (선택사항)" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                </div>
                {form.imageUrl && <img src={form.imageUrl} alt="미리보기" className="h-32 object-cover rounded-lg" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                <div>
                    <p className="text-sm font-medium text-slate-600 mb-2">핵심 포인트</p>
                    {form.keyPoints.map((kp, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <Input
                                placeholder={`포인트 ${i + 1}`}
                                value={kp}
                                onChange={e => setForm(f => {
                                    const kps = [...f.keyPoints];
                                    kps[i] = e.target.value;
                                    return { ...f, keyPoints: kps };
                                })}
                            />
                            {form.keyPoints.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => setForm(f => ({ ...f, keyPoints: f.keyPoints.filter((_, j) => j !== i) }))}>
                                    <X className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, keyPoints: [...f.keyPoints, ""] }))}>
                        + 포인트 추가
                    </Button>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>취소</Button>
                    <Button type="submit" disabled={createPromise.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {createPromise.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "공약 등록"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ─── 의견 행 (답글 포함) ──────────────────────────────────────
function SuggestionRow({ suggestion, onDelete }: { suggestion: Suggestion, onDelete: (id: string) => void }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const { data: commentsData } = useQuery({
        queryKey: [`comments-suggestion-${suggestion.id}`],
        queryFn: () => publicFetch(`/api/comments/suggestion/${suggestion.id}`).then((r: any) => r.data || []),
    });
    const comments: Comment[] = commentsData || [];

    const addReply = useMutation({
        mutationFn: () => adminFetch("POST", `/api/admin/suggestions/${suggestion.id}/reply`, { content: replyText }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`comments-suggestion-${suggestion.id}`] });
            toast({ title: "✅ 답글 등록 완료" });
            setReplyText("");
            setShowReply(false);
        },
        onError: () => toast({ title: "❌ 오류", variant: "destructive" })
    });

    return (
        <div className="border border-slate-100 rounded-xl p-4 hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{suggestion.category}</span>
                        <span className="text-xs text-slate-400">{new Date(suggestion.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                    <p className="font-semibold text-slate-800">{suggestion.title}</p>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{suggestion.content}</p>
                    {comments.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {comments.map(c => (
                                <div key={c.id} className="bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800 flex items-start gap-2">
                                    <span className="font-bold text-blue-600 text-xs mt-0.5 whitespace-nowrap">관리자↩</span>
                                    <span>{c.content}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="text-indigo-500 hover:bg-indigo-50" onClick={() => setShowReply(!showReply)}>
                        <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-50" onClick={() => onDelete(suggestion.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            {showReply && (
                <div className="mt-3 flex gap-2">
                    <Textarea
                        placeholder="답글을 입력하세요..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        className="min-h-[60px] text-sm"
                    />
                    <div className="flex flex-col gap-1">
                        <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            onClick={() => addReply.mutate()}
                            disabled={!replyText.trim() || addReply.isPending}
                        >
                            {addReply.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowReply(false)}><X className="w-3 h-3" /></Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── 메인 Admin 컴포넌트 ──────────────────────────────────────
export default function Admin() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [showVoteForm, setShowVoteForm] = useState(false);
    const [editingVoteId, setEditingVoteId] = useState<string | null>(null);
    const [showBoardForm, setShowBoardForm] = useState(false);
    const [showPromiseForm, setShowPromiseForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        setIsAdmin(!!token);
    }, []);

    const logoutMutation = useMutation({
        mutationFn: () => fetch("/api/admin/logout", { method: "POST" }),
        onSuccess: () => {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
            setIsAdmin(false);
            queryClient.invalidateQueries({ queryKey: ["/api/admin/check"] });
            toast({ title: "로그아웃", description: "관리자 세션이 종료되었습니다." });
        }
    });

    const { data: votesData, isLoading: votesLoading } = useQuery({
        queryKey: ["/api/admin/votes"],
        queryFn: () => adminFetch("GET", "/api/admin/votes").then((r: any) => r.data || r),
        enabled: !!isAdmin
    });
    const votes: Vote[] = votesData || [];

    const { data: suggestionsData, isLoading: suggestionsLoading } = useQuery({
        queryKey: ["/api/suggestions"],
        queryFn: () => publicFetch("/api/suggestions").then((r: any) => r.data || r),
        enabled: !!isAdmin
    });
    const suggestions: Suggestion[] = suggestionsData || [];

    const { data: boardsData, isLoading: boardsLoading } = useQuery({
        queryKey: ["/api/board"],
        queryFn: () => publicFetch("/api/board").then((r: any) => r.data || r),
        enabled: !!isAdmin
    });
    const boards: Board[] = boardsData || [];

    const { data: promisesData, isLoading: promisesLoading } = useQuery({
        queryKey: ["/api/promises"],
        queryFn: () => publicFetch("/api/promises").then((r: any) => r.data || r),
        enabled: !!isAdmin
    });
    const promises: PromiseItem[] = promisesData || [];

    const deleteVote = useMutation({
        mutationFn: (id: string) => adminFetch("DELETE", `/api/admin/votes/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/votes"] }); toast({ title: "✅ 투표 삭제 완료" }); },
        onError: () => toast({ title: "❌ 삭제 실패", variant: "destructive" })
    });
    const deleteSuggestion = useMutation({
        mutationFn: (id: string) => adminFetch("DELETE", `/api/admin/suggestions/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] }); toast({ title: "✅ 의견 삭제 완료" }); },
        onError: () => toast({ title: "❌ 삭제 실패", variant: "destructive" })
    });
    const deleteBoard = useMutation({
        mutationFn: (id: string) => adminFetch("DELETE", `/api/admin/board/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/board"] }); toast({ title: "✅ 게시글 삭제 완료" }); },
        onError: () => toast({ title: "❌ 삭제 실패", variant: "destructive" })
    });
    const deletePromise = useMutation({
        mutationFn: (id: string) => adminFetch("DELETE", `/api/admin/promises/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/promises"] }); toast({ title: "✅ 공약 삭제 완료" }); },
        onError: () => toast({ title: "❌ 삭제 실패", variant: "destructive" })
    });

    // ── 고급 관리 state ──
    const [editingLike, setEditingLike] = useState<{ id: string; type: string; value: number } | null>(null);

    const { data: allCommentsData, isLoading: commentsLoading } = useQuery({
        queryKey: ["/api/admin/comments/all"],
        queryFn: () => adminFetch("GET", "/api/admin/comments/all").then((r: any) => r.data || []),
        enabled: !!isAdmin
    });
    const allComments: Comment[] = allCommentsData || [];

    const deleteCommentAdmin = useMutation({
        mutationFn: (id: string) => adminFetch("DELETE", `/api/admin/comments/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/comments/all"] }); toast({ title: "✅ 댓글 삭제 완료" }); },
        onError: () => toast({ title: "❌ 삭제 실패", variant: "destructive" })
    });

    const saveLike = useMutation({
        mutationFn: ({ id, type, count }: { id: string; type: string; count: number }) => {
            const url = type === "board"
                ? `/api/admin/board/${id}/likes`
                : type === "suggestion"
                    ? `/api/admin/suggestions/${id}/likes`
                    : `/api/admin/comments/${id}/likes`;
            return adminFetch("PUT", url, { count });
        },
        onSuccess: (_, vars) => {
            if (vars.type === "board") queryClient.invalidateQueries({ queryKey: ["/api/board"] });
            if (vars.type === "suggestion") queryClient.invalidateQueries({ queryKey: ["/api/suggestions"] });
            queryClient.invalidateQueries({ queryKey: ["/api/admin/comments/all"] });
            setEditingLike(null);
            toast({ title: "✅ 좋아요 수 수정 완료" });
        },
        onError: () => toast({ title: "❌ 수정 실패", variant: "destructive" })
    });

    if (isAdmin === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }
    if (!isAdmin) {
        return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
    }

    const statCards = [
        { title: "누적 투표", value: votes.length, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", trend: `${votes.length}건` },
        { title: "신대지구 제안", value: suggestions.length, icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", trend: "검토필요" },
        { title: "총 게시물", value: boards.length, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", trend: "운영중" },
        { title: "진행 공약", value: promises.filter(p => p.status === "진행중").length, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", trend: "진행중" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-[1200px]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 hidden sm:block">Admin Console</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
                                <ExternalLink className="w-4 h-4" />사이트 보기
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-slate-200" />
                        <Button
                            variant="ghost" size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                            onClick={() => logoutMutation.mutate()}
                        >
                            <LogOut className="w-4 h-4" />로그아웃
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-[1200px]">
                {/* Hero */}
                <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">시스템 요약</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">대시보드 홈</h2>
                        <p className="text-slate-500 mt-1">플랫폼의 주요 지표와 데이터를 관리하세요.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => queryClient.refetchQueries()}>
                        <RefreshCcw className="w-4 h-4 mr-2" />새로고침
                    </Button>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map(stat => (
                        <div key={stat.title} className={`bg-white rounded-2xl border ${stat.border} p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex items-center justify-between gap-2">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${stat.bg} ${stat.color}`}>{stat.trend}</span>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-slate-900 leading-none mb-1">{stat.value.toLocaleString()}</p>
                                <p className="text-sm text-slate-500 font-medium whitespace-nowrap">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="votes" className="space-y-6">
                    <div className="overflow-x-auto">
                        <TabsList className="bg-white border p-1 h-12 shadow-sm rounded-xl">
                            <TabsTrigger value="votes" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">📊 투표 관리</TabsTrigger>
                            <TabsTrigger value="suggestions" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">💬 의견 관리</TabsTrigger>
                            <TabsTrigger value="board" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">📋 게시판 관리</TabsTrigger>
                            <TabsTrigger value="promises" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">📌 공약 관리</TabsTrigger>
                            <TabsTrigger value="advanced" className="px-5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">⚙️ 고급 관리</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ── 투표 관리 ── */}
                    <TabsContent value="votes">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">투표 관리</h3>
                                    <p className="text-sm text-slate-500">투표를 생성하고 현황을 관리합니다.</p>
                                </div>
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => setShowVoteForm(!showVoteForm)}>
                                    <Plus className="w-4 h-4" />신규 투표 생성
                                </Button>
                            </div>
                            {showVoteForm && <VoteCreateForm onClose={() => setShowVoteForm(false)} />}
                            {votesLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : votes.length === 0 ? (
                                <p className="text-center py-12 text-slate-400">등록된 투표가 없습니다.</p>
                            ) : (
                                <div className="space-y-3">
                                    {votes.map(vote => (
                                        <div key={vote.id}>
                                            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors group">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{vote.category}</span>
                                                        {vote.isHero && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">🔥 히어로</span>}
                                                        <span className="text-xs text-slate-400">{new Date(vote.endDate).toLocaleDateString("ko-KR")} 마감</span>
                                                    </div>
                                                    <p className="font-semibold text-slate-800 mt-1">{vote.title}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />
                                                            {(vote.results || []).reduce((a: number, b: number) => a + b, 0)}명 참여
                                                        </span>
                                                        <div className="flex gap-2 text-xs">
                                                            {(vote.options || []).map((opt, idx) => (
                                                                <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                                    {opt}: {(vote.results || [])[idx] || 0}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        className="text-orange-400 hover:bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => setEditingVoteId(editingVoteId === vote.id ? null : vote.id)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="sm"
                                                        className="text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => deleteVote.mutate(vote.id)}
                                                        disabled={deleteVote.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {editingVoteId === vote.id && (
                                                <VoteEditForm vote={vote} onClose={() => setEditingVoteId(null)} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── 의견 관리 ── */}
                    <TabsContent value="suggestions">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-slate-900">의견 관리</h3>
                                <p className="text-sm text-slate-500">신대지구 제안에 답글을 달거나 삭제할 수 있습니다. <Send className="w-3 h-3 inline" /> 버튼을 눌러 답글을 작성하세요.</p>
                            </div>
                            {suggestionsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : suggestions.length === 0 ? (
                                <p className="text-center py-12 text-slate-400">등록된 의견이 없습니다.</p>
                            ) : (
                                <div className="space-y-3">
                                    {suggestions.map(s => (
                                        <SuggestionRow key={s.id} suggestion={s} onDelete={id => deleteSuggestion.mutate(id)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── 게시판 관리 ── */}
                    <TabsContent value="board">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">게시판 관리</h3>
                                    <p className="text-sm text-slate-500">공지 및 게시글과 이미지를 관리합니다.</p>
                                </div>
                                <Button className="gap-2 bg-amber-600 hover:bg-amber-700" onClick={() => setShowBoardForm(!showBoardForm)}>
                                    <Plus className="w-4 h-4" />게시글 작성
                                </Button>
                            </div>
                            {showBoardForm && <BoardCreateForm onClose={() => setShowBoardForm(false)} />}
                            {boardsLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : boards.length === 0 ? (
                                <p className="text-center py-12 text-slate-400">등록된 게시글이 없습니다.</p>
                            ) : (
                                <div className="space-y-3">
                                    {boards.map(board => (
                                        <div key={board.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:border-amber-200 transition-colors group">
                                            {(board as any).imageUrl && (
                                                <img
                                                    src={(board as any).imageUrl}
                                                    alt="썸네일"
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                                        {board.type === "notice" ? "공지" : "자유"}
                                                    </span>
                                                    {board.isPinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">📌 고정</span>}
                                                    <span className="text-xs text-slate-400">{new Date(board.createdAt).toLocaleDateString("ko-KR")}</span>
                                                </div>
                                                <p className="font-semibold text-slate-800 mt-1">{board.title}</p>
                                                <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{board.content}</p>
                                            </div>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                onClick={() => deleteBoard.mutate(board.id)}
                                                disabled={deleteBoard.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── 공약 관리 ── */}
                    <TabsContent value="promises">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">공약 관리</h3>
                                    <p className="text-sm text-slate-500">공약과 이행 상태를 등록하고 관리합니다.</p>
                                </div>
                                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowPromiseForm(!showPromiseForm)}>
                                    <Plus className="w-4 h-4" />공약 등록
                                </Button>
                            </div>
                            {showPromiseForm && <PromiseCreateForm onClose={() => setShowPromiseForm(false)} />}
                            {promisesLoading ? (
                                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                            ) : promises.length === 0 ? (
                                <p className="text-center py-12 text-slate-400">등록된 공약이 없습니다.</p>
                            ) : (
                                <div className="space-y-3">
                                    {promises.map(promise => (
                                        <div key={promise.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:border-emerald-200 transition-colors group">
                                            {promise.imageUrl && (
                                                <img
                                                    src={promise.imageUrl}
                                                    alt="공약 이미지"
                                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{promise.category}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${promise.status === "이행완료" ? "bg-blue-100 text-blue-700" :
                                                        promise.status === "진행중" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                                        }`}>{promise.status}</span>
                                                </div>
                                                <p className="font-semibold text-slate-800 mt-1">{promise.title}</p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                                                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${promise.progress}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-500 whitespace-nowrap">{promise.progress}%</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost" size="sm"
                                                className="text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                onClick={() => deletePromise.mutate(promise.id)}
                                                disabled={deletePromise.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* ── 고급 관리 ── */}
                    <TabsContent value="advanced">
                        <div className="space-y-6">

                            {/* 댓글 관리 */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="mb-5">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> 댓글 관리</h3>
                                    <p className="text-sm text-slate-500 mt-1">모든 댓글을 확인하고 삭제할 수 있습니다. (관리자 전용)</p>
                                </div>
                                {commentsLoading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                ) : allComments.length === 0 ? (
                                    <p className="text-center py-8 text-slate-400">등록된 댓글이 없습니다.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {allComments.map(comment => (
                                            <div key={comment.id} className="flex items-start justify-between p-3 border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors group">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comment.targetType === 'vote' ? 'bg-blue-50 text-blue-600' : comment.targetType === 'board' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                            {comment.targetType === 'vote' ? '투표' : comment.targetType === 'board' ? '게시판' : '의견'}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString("ko-KR")}</span>
                                                        <span className="flex items-center gap-1 text-xs text-slate-400"><ThumbsUp className="w-3 h-3" />{comment.likeCount}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 line-clamp-2">{comment.content}</p>
                                                </div>
                                                <Button
                                                    variant="ghost" size="sm"
                                                    className="text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                                                    onClick={() => deleteCommentAdmin.mutate(comment.id)}
                                                    disabled={deleteCommentAdmin.isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 좋아요 수 관리 */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="mb-5">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-pink-500" /> 좋아요 수 관리</h3>
                                    <p className="text-sm text-slate-500 mt-1">게시글·의견·댓글의 좋아요 수를 직접 수정할 수 있습니다. (관리자 전용)</p>
                                </div>

                                {/* 게시판 좋아요 */}
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">게시판</p>
                                <div className="space-y-2 mb-5">
                                    {boards.map(board => (
                                        <div key={board.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                                            <p className="text-sm text-slate-700 flex-1 truncate mr-3">{board.title}</p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {editingLike?.id === board.id ? (
                                                    <>
                                                        <Input
                                                            type="number" min={0}
                                                            value={editingLike.value}
                                                            onChange={e => setEditingLike(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                                                            className="w-20 h-8 text-center text-sm"
                                                        />
                                                        <Button size="sm" className="h-8 bg-pink-500 hover:bg-pink-600 text-white"
                                                            onClick={() => saveLike.mutate({ id: board.id, type: "board", count: editingLike.value })}
                                                            disabled={saveLike.isPending}>저장</Button>
                                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditingLike(null)}>취소</Button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setEditingLike({ id: board.id, type: "board", value: board.likeCount })}
                                                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-pink-500 transition-colors">
                                                        <ThumbsUp className="w-3.5 h-3.5" />{board.likeCount}
                                                        <Pencil className="w-3 h-3 opacity-50" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 의견 좋아요 */}
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">의견</p>
                                <div className="space-y-2 mb-5">
                                    {suggestions.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                                            <p className="text-sm text-slate-700 flex-1 truncate mr-3">{s.title}</p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {editingLike?.id === s.id ? (
                                                    <>
                                                        <Input
                                                            type="number" min={0}
                                                            value={editingLike.value}
                                                            onChange={e => setEditingLike(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                                                            className="w-20 h-8 text-center text-sm"
                                                        />
                                                        <Button size="sm" className="h-8 bg-pink-500 hover:bg-pink-600 text-white"
                                                            onClick={() => saveLike.mutate({ id: s.id, type: "suggestion", count: editingLike.value })}
                                                            disabled={saveLike.isPending}>저장</Button>
                                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditingLike(null)}>취소</Button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setEditingLike({ id: s.id, type: "suggestion", value: s.likeCount })}
                                                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-pink-500 transition-colors">
                                                        <ThumbsUp className="w-3.5 h-3.5" />{s.likeCount}
                                                        <Pencil className="w-3 h-3 opacity-50" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 댓글 좋아요 */}
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">댓글</p>
                                <div className="space-y-2">
                                    {allComments.map(comment => (
                                        <div key={comment.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                                            <p className="text-sm text-slate-700 flex-1 truncate mr-3">{comment.content}</p>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {editingLike?.id === comment.id ? (
                                                    <>
                                                        <Input
                                                            type="number" min={0}
                                                            value={editingLike.value}
                                                            onChange={e => setEditingLike(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                                                            className="w-20 h-8 text-center text-sm"
                                                        />
                                                        <Button size="sm" className="h-8 bg-pink-500 hover:bg-pink-600 text-white"
                                                            onClick={() => saveLike.mutate({ id: comment.id, type: "comment", count: editingLike.value })}
                                                            disabled={saveLike.isPending}>저장</Button>
                                                        <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditingLike(null)}>취소</Button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => setEditingLike({ id: comment.id, type: "comment", value: comment.likeCount })}
                                                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-pink-500 transition-colors">
                                                        <ThumbsUp className="w-3.5 h-3.5" />{comment.likeCount}
                                                        <Pencil className="w-3 h-3 opacity-50" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
