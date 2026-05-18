/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `product_price_snapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `OrderItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerk_user_id]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_user_id` to the `Buyer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidad` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_unitario` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cantidad` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_price_snapshot` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "clerk_user_id" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT;

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "seller_id" INTEGER;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "quantity",
ADD COLUMN     "cantidad" INTEGER NOT NULL,
ADD COLUMN     "precio_unitario" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updated_at",
ADD COLUMN     "payment_id" INTEGER,
ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "product_price_snapshot",
DROP COLUMN "quantity",
ADD COLUMN     "cantidad" INTEGER NOT NULL,
ADD COLUMN     "unit_price_snapshot" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_buyer_id_product_id_key" ON "Favorite"("buyer_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_clerk_user_id_key" ON "Buyer"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
