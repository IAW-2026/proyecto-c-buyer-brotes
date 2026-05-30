-- CreateTable
CREATE TABLE "ForumReplyLike" (
    "id" SERIAL NOT NULL,
    "reply_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumReplyLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForumReplyLike_reply_id_buyer_id_key" ON "ForumReplyLike"("reply_id", "buyer_id");

-- AddForeignKey
ALTER TABLE "ForumReplyLike" ADD CONSTRAINT "ForumReplyLike_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "ForumReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReplyLike" ADD CONSTRAINT "ForumReplyLike_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
