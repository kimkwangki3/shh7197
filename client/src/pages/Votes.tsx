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
        mutationFn: async ({ id, type }: { id: number; type: 'agree' | 'disagree' }) => {
            const res = await apiRequest("POST", `/api/votes/${id}/vote`, { type });
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
        <div className="p-4 flex flex-col gap-6 animate-in fade-in duration-500">
            <header className="mb-2">
                <h2 className="text-2xl font-black text-primary mb-1">시민 투표</h2>
                <p className="text-sm text-muted-foreground">여러분의 의견이 곧 정책이 됩니다.</p>
            </header>

            {votes?.data?.map((vote) => {
                const total = vote.agreeCount + vote.disagreeCount;
                const agreePct = total > 0 ? Math.round((vote.agreeCount / total) * 100) : 50;

                return (
                    <Card key={vote.id} className="border-none shadow-md rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-5">
                            <Badge className="mb-3 bg-primary/10 text-primary border-none">{vote.category}</Badge>
                            <h3 className="text-lg font-bold mb-4 leading-tight">{vote.title}</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-primary flex items-center gap-1">찬성 {agreePct}%</span>
                                    <span className="text-destructive flex items-center gap-1">반대 {100 - agreePct}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${agreePct}%` }} />
                                    <div className="bg-destructive h-full transition-all duration-1000" style={{ width: `${100 - agreePct}%` }} />
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Users className="w-3 h-3" /> {total}명이 투표에 참여했습니다
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-primary text-primary hover:bg-primary/5 h-12 gap-2"
                                    onClick={() => voteMutation.mutate({ id: vote.id, type: 'agree' })}
                                    disabled={voteMutation.isPending}
                                >
                                    <CheckCircle2 className="w-4 h-4" /> 찬성
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-destructive text-destructive hover:bg-destructive/5 h-12 gap-2"
                                    onClick={() => voteMutation.mutate({ id: vote.id, type: 'disagree' })}
                                    disabled={voteMutation.isPending}
                                >
                                    <XCircle className="w-4 h-4" /> 반대
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
