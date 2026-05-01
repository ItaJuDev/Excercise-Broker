-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('cfd', 'bond', 'stock', 'crypto');

-- CreateTable
CREATE TABLE "Broker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "broker_type" "BrokerType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Broker_slug_key" ON "Broker"("slug");

-- CreateIndex
CREATE INDEX "Broker_broker_type_idx" ON "Broker"("broker_type");

-- CreateIndex
CREATE INDEX "Broker_name_idx" ON "Broker"("name");
