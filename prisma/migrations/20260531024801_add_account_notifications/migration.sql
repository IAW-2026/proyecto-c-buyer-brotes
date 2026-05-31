-- CreateTable
CREATE TABLE "AccountNotification" (
    "id" SERIAL NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountNotification_buyer_id_idx" ON "AccountNotification"("buyer_id");

-- AddForeignKey
ALTER TABLE "AccountNotification" ADD CONSTRAINT "AccountNotification_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
