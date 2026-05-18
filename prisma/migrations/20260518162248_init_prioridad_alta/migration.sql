/*
  Warnings:

  - You are about to drop the column `clerk_user_id` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Buyer` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `cantidad` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `precio_unitario` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `cantidad` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price_snapshot` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Buyer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price_snapshot` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_buyer_id_fkey";

-- DropIndex
DROP INDEX "Buyer_clerk_user_id_key";

-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "clerk_user_id",
DROP COLUMN "direccion",
ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "estado",
DROP COLUMN "seller_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "cantidad",
DROP COLUMN "precio_unitario",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment_id",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "cantidad",
DROP COLUMN "unit_price_snapshot",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_price_snapshot" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Favorite";

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "Buyer"("email");
