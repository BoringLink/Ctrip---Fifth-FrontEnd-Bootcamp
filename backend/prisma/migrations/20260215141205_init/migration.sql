-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('merchant', 'admin');

-- CreateEnum
CREATE TYPE "HotelStatus" AS ENUM ('pending', 'approved', 'rejected', 'offline');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed', 'package');

-- CreateEnum
CREATE TYPE "AttractionType" AS ENUM ('attraction', 'transportation', 'shopping');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('confirmed', 'check_in', 'check_out', 'cancelled');

-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('id_card', 'passport', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name_zh" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "star_rating" INTEGER NOT NULL,
    "opening_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "status" "HotelStatus" NOT NULL,
    "rejection_reason" TEXT,
    "merchant_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_rooms" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_facilities" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_images" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_promotions" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_nearby_attractions" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AttractionType" NOT NULL,
    "distance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_nearby_attractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_tag_relations" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_tag_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "guest_name" TEXT NOT NULL,
    "guest_phone" TEXT NOT NULL,
    "guest_email" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "id_type" "IdType" NOT NULL,
    "id_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_guests" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_rooms" ADD CONSTRAINT "hotel_rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_facilities" ADD CONSTRAINT "hotel_facilities_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_images" ADD CONSTRAINT "hotel_images_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_promotions" ADD CONSTRAINT "hotel_promotions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_nearby_attractions" ADD CONSTRAINT "hotel_nearby_attractions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_tag_relations" ADD CONSTRAINT "hotel_tag_relations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_tag_relations" ADD CONSTRAINT "hotel_tag_relations_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "hotel_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "hotel_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_guests" ADD CONSTRAINT "reservation_guests_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_guests" ADD CONSTRAINT "reservation_guests_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
