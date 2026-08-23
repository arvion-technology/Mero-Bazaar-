-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('TIFFIN', 'BAKERY', 'DAIRY', 'MEAT', 'ORGANIC', 'HOME_COOK', 'WHOLESALE');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('PER_MEAL', 'PER_KG', 'PER_LITRE', 'PER_PIECE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "ListingCategory" ADD VALUE 'FOODS';

-- CreateTable
CREATE TABLE "FoodsAndHomeDelivery" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "foodType" "FoodType" NOT NULL,
    "price" INTEGER NOT NULL,
    "priceUnit" "PriceUnit" NOT NULL,
    "deliveryRadiusKm" INTEGER NOT NULL,
    "hygieneRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subscriptionAvailable" BOOLEAN NOT NULL DEFAULT false,
    "deliveryDays" "WeekDay"[],
    "minOrderAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodsAndHomeDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "priceAtOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodsAndHomeDelivery_listingId_key" ON "FoodsAndHomeDelivery"("listingId");

-- CreateIndex
CREATE INDEX "FoodsAndHomeDelivery_foodType_idx" ON "FoodsAndHomeDelivery"("foodType");

-- CreateIndex
CREATE INDEX "FoodsAndHomeDelivery_deliveryRadiusKm_idx" ON "FoodsAndHomeDelivery"("deliveryRadiusKm");

-- CreateIndex
CREATE INDEX "Order_listingId_idx" ON "Order"("listingId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_deliveryDate_idx" ON "Order"("deliveryDate");

-- AddForeignKey
ALTER TABLE "FoodsAndHomeDelivery" ADD CONSTRAINT "FoodsAndHomeDelivery_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
