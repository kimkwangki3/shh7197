import { db } from "./server/db";
import { likes } from "./shared/schema";
import { desc, eq } from "drizzle-orm";

async function main() {
    const recentLikes = await db.select().from(likes).where(eq(likes.targetType, 'vote')).orderBy(desc(likes.createdAt)).limit(20);
    console.log("Recent vote likes:");
    console.dir(recentLikes, { depth: null });
    process.exit(0);
}

main().catch(console.error);
