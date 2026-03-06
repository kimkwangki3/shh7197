import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Comment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2, User, Calendar, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CommentSectionProps {
    targetType: "suggestion" | "board" | "promise" | "vote";
    targetId: string;
}

export default function CommentSection({ targetType, targetId }: CommentSectionProps) {
    const { toast } = useToast();
    const [content, setContent] = useState("");

    const { data: comments, isLoading } = useQuery<{ success: boolean; data: (Comment & { maskedIp?: string; isOwner?: boolean; isLiked?: boolean })[] }>({
        queryKey: [`/api/comments/${targetType}/${targetId}`],
    });

    const mutation = useMutation({
        mutationFn: async (newComment: { content: string; targetType: string; targetId: string }) => {
            const res = await apiRequest("POST", "/api/comments", newComment);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/comments/${targetType}/${targetId}`] });
            setContent("");
            toast({ title: "댓글이 등록되었습니다." });
        },
        onError: (error: any) => {
            toast({
                title: "등록 실패",
                description: error.message || "오류가 발생했습니다.",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("DELETE", `/api/comments/${id}`);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/comments/${targetType}/${targetId}`] });
            toast({ title: "댓글이 삭제되었습니다." });
        },
        onError: (error: any) => {
            toast({
                title: "삭제 실패",
                description: error.message || "삭제 권한이 없거나 오류가 발생했습니다.",
                variant: "destructive",
            });
        },
    });

    const likeMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await apiRequest("POST", `/api/comments/${id}/like`);
            return res.json();
        },
        onSuccess: (data, variables) => {
            localStorage.setItem(`liked_comment_${variables}`, 'true');
            queryClient.invalidateQueries({ queryKey: [`/api/comments/${targetType}/${targetId}`] });

            // 중복 체크 피드백
            const item = comments?.data?.find(c => c.id === variables);
            if (item?.isLiked) {
                toast({ title: "이미 공감하신 댓글입니다." });
            } else {
                toast({ title: "공감이 반영되었습니다." });
            }
        },
    });

    const handleLike = (id: string) => {
        if (likeMutation.isPending) return;

        const isLikedLocal = localStorage.getItem(`liked_comment_${id}`);
        const comment = comments?.data?.find(c => c.id === id);

        if (comment?.isLiked || isLikedLocal) {
            toast({ title: "이미 공감하신 댓글입니다." });
            return;
        }

        likeMutation.mutate(id);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        mutation.mutate({ content, targetType, targetId });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
                <h4 className="text-[15px] font-black text-slate-800 flex items-center gap-2">
                    댓글 <span className="text-primary/50 text-xs font-bold">{comments?.data?.length || 0}</span>
                </h4>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative group">
                    <Textarea
                        placeholder="따뜻한 댓글로 응원해주세요."
                        className="min-h-[100px] rounded-2xl bg-slate-50 border-none p-4 text-[14px] font-medium leading-relaxed resize-none focus:bg-white focus:ring-primary/20 transition-all"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3">
                        <Button
                            type="submit"
                            size="sm"
                            disabled={mutation.isPending || !content.trim()}
                            className="bg-primary text-white hover:bg-primary/90 rounded-xl px-4 py-2 font-black text-[12px] shadow-md shadow-blue-100 flex items-center gap-1.5 h-9"
                        >
                            {mutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            등록
                        </Button>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 px-1">* IP 주소를 기반으로 익명 등록됩니다.</p>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {comments?.data?.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-[13px] font-bold text-slate-300">첫 번째 댓글을 남겨보세요!</p>
                    </div>
                ) : (
                    comments?.data?.map((comment) => (
                        <div key={comment.id} className="group flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-black text-slate-700">
                                            {comment.maskedIp}
                                        </span>
                                        {comment.isOwner && (
                                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded font-black">내 댓글</span>
                                        )}
                                        <span className="text-[10px] text-slate-300 font-medium">
                                            {format(new Date(comment.createdAt), "MM.dd HH:mm", { locale: ko })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleLike(comment.id)}
                                            disabled={likeMutation.isPending}
                                            className={cn(
                                                "flex items-center gap-1 text-[11px] font-bold transition-colors",
                                                (comment.isLiked || localStorage.getItem(`liked_comment_${comment.id}`)) ? "text-primary" : "text-slate-400 hover:text-primary"
                                            )}
                                        >
                                            <ThumbsUp className={cn("w-3 h-3", (comment.isLiked || localStorage.getItem(`liked_comment_${comment.id}`)) && "fill-current")} />
                                            {comment.likeCount || 0}
                                        </button>
                                        {comment.isOwner && (
                                            <button
                                                onClick={() => {
                                                    if (confirm("댓글을 삭제하시겠습니까?")) {
                                                        deleteMutation.mutate(comment.id);
                                                    }
                                                }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-400"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-[13px] text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
