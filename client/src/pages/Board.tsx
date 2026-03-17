import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Board } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Pin,
    Calendar,
    Eye,
    Edit3,
    ChevronRight,
    Plus,
    X,
    FileText,
    MessageSquare,
    ChevronLeft,
    ThumbsUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/hooks/use-auth";
import CommentSection from "@/components/CommentSection";
import { ADMIN_TOKEN_KEY } from "@/components/admin/AdminLogin";

export default function BoardPage() {
    const { toast } = useToast();
    const { checkAuthOrLogin } = useAuth();
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "", type: "free" });
    const [selectedPost, setSelectedPost] = useState<(Board & { isLiked?: boolean }) | null>(null);

    // Verify admin status from server
    const { data: adminCheck } = useQuery<{ isAdmin: boolean }>({
        queryKey: ["/api/admin/check"],
        queryFn: async () => {
            const token = localStorage.getItem(ADMIN_TOKEN_KEY);
            if (!token) return { isAdmin: false };
            const res = await apiRequest("GET", "/api/admin/check", undefined, {
                headers: { "x-admin-token": token }
            });
            return res.json();
        }
    });

    const isAdmin = !!adminCheck?.isAdmin;

    const { data: posts, isLoading } = useQuery<{ success: boolean; data: (Board & { isLiked?: boolean })[] }>({
        queryKey: [filter === "all" ? "/api/board" : `/api/board?type=${filter}`],
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiRequest("POST", "/api/admin/board", data, {
                headers: {
                    "x-admin-token": localStorage.getItem(ADMIN_TOKEN_KEY) || ""
                }
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/board"] });
            setShowWriteForm(false);
            setFormData({ title: "", content: "", type: "free" });
            toast({ title: "게시글이 등록되었습니다.", description: "관리자 권한으로 게시글이 작성되었습니다." });
        },
    });

    const likeMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("POST", `/api/board/${id}/like`);
            return res.json();
        },
        onSuccess: (data, variables) => {
            localStorage.setItem(`liked_board_${variables}`, 'true');
            queryClient.invalidateQueries({ queryKey: ["/api/board"] });
            if (selectedPost && data.success) {
                setSelectedPost(data.data);
            }

            // 중복 체크 피드백
            const item = posts?.data?.find(p => p.id === variables);
            if (item?.isLiked) {
                toast({ title: "이미 공감하신 게시글입니다." });
            } else {
                toast({ title: "공감이 반영되었습니다." });
            }
        },
    });

    const handleLike = (id: string) => {
        if (likeMutation.isPending) return;

        const isLikedLocal = localStorage.getItem(`liked_board_${id}`);
        const post = posts?.data?.find(p => p.id === id);

        if (post?.isLiked || isLikedLocal) {
            toast({ title: "이미 공감하신 게시글입니다." });
            return;
        }

        likeMutation.mutate(id);
    };

    const categories = [
        { id: "all", label: "전체" },
        { id: "activity", label: "활동사진" },
    ];

    const filteredPosts = posts?.data?.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading && !posts) {
        return (
            <div className="p-4 space-y-4">
                <Skeleton className="h-10 w-48 rounded-lg" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header Area */}
            <div className="bg-white px-5 pt-8 pb-6 border-b border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-[26px] font-black text-primary leading-tight mb-1 tracking-tight">게시판</h2>
                        <p className="text-sm text-slate-400 font-medium">소통과 소식이 한자리에</p>
                    </div>
                    {isAdmin && !showWriteForm && (
                        <Button
                            onClick={() => setShowWriteForm(true)}
                            className="bg-primary text-white rounded-2xl h-11 px-6 font-bold shadow-lg shadow-blue-100 flex items-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" /> 글쓰기
                        </Button>
                    )}
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="제목, 내용을 검색하세요"
                        className="w-full pl-11 pr-4 h-12 bg-slate-50 border-none rounded-2xl text-[15px] focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {showWriteForm && isAdmin ? (
                    <Card className="border-none shadow-xl shadow-blue-900/5 rounded-3xl bg-white overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" /> 새 게시글 작성
                                </h3>
                                <button onClick={() => setShowWriteForm(false)} className="text-slate-400 p-2">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    {categories.filter(c => c.id !== 'all').map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFormData({ ...formData, type: cat.id })}
                                            className={cn(
                                                "py-2 px-4 rounded-xl text-xs font-bold transition-all border",
                                                formData.type === cat.id
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                <Input
                                    placeholder="제목을 입력하세요"
                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold text-[15px] focus:bg-white focus:ring-primary/20"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <Textarea
                                    placeholder="신대지구 주민들과 나누고 싶은 이야기를 적어주세요."
                                    className="min-h-[180px] rounded-xl bg-slate-50 border-none p-4 text-[14px] leading-relaxed resize-none focus:bg-white focus:ring-primary/20"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <Button
                                className="w-full h-13 rounded-2xl bg-primary text-white font-black text-base shadow-lg shadow-blue-100"
                                onClick={() => mutation.mutate(formData)}
                                disabled={mutation.isPending || !formData.title || !formData.content}
                            >
                                게시글 올리기
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <>
                        {/* Category Selector */}
                        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-2xl whitespace-nowrap text-[13px] font-black transition-all border-none",
                                        filter === cat.id
                                            ? "bg-primary text-white shadow-md shadow-blue-100"
                                            : "bg-white text-slate-400 shadow-sm hover:bg-slate-50"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Post List */}
                        <div className="flex flex-col gap-4">
                            {filteredPosts?.length === 0 ? (
                                <div className="py-24 text-center">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <FileText className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-[14px] font-bold text-slate-400">등록된 게시글이 없습니다.</p>
                                </div>
                            ) : (
                                filteredPosts?.map((post) => (
                                    <Card
                                        key={post.id}
                                        onClick={() => checkAuthOrLogin(() => setSelectedPost(post))}
                                        className={cn(
                                            "border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-[24px] overflow-hidden transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] cursor-pointer bg-white",
                                            post.isPinned ? 'ring-2 ring-primary/10' : ''
                                        )}
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        {post.isPinned && (
                                                            <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center">
                                                                <Pin className="w-3.5 h-3.5 text-primary fill-primary" />
                                                            </div>
                                                        )}
                                                        <span className={cn(
                                                            "text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide",
                                                            post.type === 'notice' ? 'bg-red-50 text-red-600' :
                                                                post.type === 'policy' ? 'bg-blue-50 text-blue-600' :
                                                                    post.type === 'activity' ? 'bg-emerald-50 text-emerald-600' :
                                                                        'bg-slate-100 text-slate-500'
                                                        )}>
                                                            {post.type === 'notice' ? '공지사항' :
                                                                post.type === 'activity' ? '활동사진' : '자유게시판'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                                                        <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                        {format(new Date(post.createdAt), "yyyy.MM.dd", { locale: ko })}
                                                    </div>
                                                </div>

                                                <h4 className="font-extrabold text-[17px] text-slate-800 leading-snug line-clamp-2">
                                                    {post.title}
                                                </h4>

                                                {post.imageUrl && (
                                                    <div className="w-full h-40 rounded-2xl overflow-hidden mt-1 mb-2">
                                                        <img
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <p className="text-[14px] text-slate-500 font-medium line-clamp-2 opacity-70">
                                                    {post.content}
                                                </p>

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <Eye className="w-4 h-4 opacity-70" />
                                                            <span className="text-[12px] font-black">{post.viewCount}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <MessageSquare className="w-4 h-4 opacity-70" />
                                                            <span className="text-[12px] font-black">0</span>
                                                        </div>
                                                        <div
                                                            className={cn(
                                                                "flex items-center gap-1.5 transition-colors pr-2",
                                                                post.isLiked || localStorage.getItem(`liked_board_${post.id}`) ? "text-primary" : "text-slate-400 hover:text-primary"
                                                            )}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLike(post.id);
                                                            }}
                                                        >
                                                            <ThumbsUp className={cn("w-4 h-4 opacity-70", (post.isLiked || localStorage.getItem(`liked_board_${post.id}`)) && "fill-current opacity-100")} />
                                                            <span className="text-[12px] font-black">{post.likeCount}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-[11px] font-black text-primary flex items-center gap-0.5">
                                                        자세히 <ChevronRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* Post Detail Modal/View */}
                {selectedPost && (
                    <Card className="border-none shadow-2xl rounded-[32px] bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-200 fixed inset-x-4 top-[10%] bottom-[10%] z-[60] flex flex-col mx-auto max-w-[440px]">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <Badge className="bg-primary/5 text-primary border-none font-bold">
                                    {selectedPost.type === 'notice' ? '공지사항' : selectedPost.type === 'activity' ? '활동사진' : '자유게시판'}
                                </Badge>
                                <button onClick={() => setSelectedPost(null)} className="p-2 text-slate-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                                <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedPost.title}</h3>
                                <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {format(new Date(selectedPost.createdAt), "yyyy.MM.dd", { locale: ko })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {selectedPost.viewCount}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        {selectedPost.likeCount}
                                    </div>
                                </div>
                                <div className="h-[1px] bg-slate-100" />

                                {selectedPost.type === 'activity' ? (
                                    // 활동사진 게시글: 갤러리 뷰로 표시
                                    <div className="space-y-3">
                                        {/* 텍스트 내용 (이미지 마크다운 제외) */}
                                        <p className="text-[15px] text-slate-600 leading-[1.7] whitespace-pre-wrap font-medium">
                                            {selectedPost.content.replace(/!\[.*?\]\(.*?\)/g, '').trim()}
                                        </p>
                                        {/* 이미지 갤러리 */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedPost.imageUrl && (
                                                <div className="rounded-xl overflow-hidden aspect-[4/3]">
                                                    <img src={selectedPost.imageUrl} alt="활동사진" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            {Array.from(selectedPost.content.matchAll(/!\[.*?\]\((\/activity-photos\/[^)]+)\)/g)).map((m, i) => (
                                                <div key={i} className="rounded-xl overflow-hidden aspect-[4/3]">
                                                    <img src={m[1]} alt={`활동사진 ${i + 2}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {selectedPost.imageUrl && (
                                            <div className="w-full rounded-2xl overflow-hidden shadow-sm">
                                                <img
                                                    src={selectedPost.imageUrl}
                                                    alt={selectedPost.title}
                                                    className="w-full h-auto object-cover"
                                                />
                                            </div>
                                        )}
                                        <p className="text-[15px] text-slate-600 leading-[1.7] whitespace-pre-wrap font-medium">
                                            {selectedPost.content}
                                        </p>
                                    </>
                                )}

                                <div className="flex justify-center py-4">
                                    <Button
                                        variant={selectedPost.isLiked ? "default" : "outline"}
                                        className={cn(
                                            "rounded-full gap-2 transition-all px-8 h-12",
                                            selectedPost.isLiked
                                                ? "bg-primary/10 text-primary border-none hover:bg-primary/20"
                                                : "border-primary/20 hover:bg-primary/5 hover:text-primary"
                                        )}
                                        onClick={() => likeMutation.mutate(selectedPost.id)}
                                        disabled={likeMutation.isPending}
                                    >
                                        <ThumbsUp className={cn("w-5 h-5", selectedPost.isLiked && "fill-current", likeMutation.isPending && "animate-bounce")} />
                                        <span className="font-bold">
                                            {selectedPost.isLiked ? "좋아요 완료" : "좋아요"} {selectedPost.likeCount}
                                        </span>
                                    </Button>
                                </div>

                                <div className="h-[1px] bg-slate-100 my-4" />

                                <CommentSection targetType="board" targetId={selectedPost.id} />
                            </div>
                        </div>
                    </Card>
                )}
                {selectedPost && (
                    <div className="fixed inset-0 bg-black/20 z-[55] backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
                )}
            </div>
        </div>
    );
}
