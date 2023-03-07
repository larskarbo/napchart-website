-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('email-verify', 'password-reset', 'payment-user-create');

-- CreateTable
CREATE TABLE "charts" (
    "chartid" VARCHAR(9) NOT NULL,
    "chart_data" JSONB DEFAULT '{}',
    "title" VARCHAR(100),
    "description" TEXT,
    "username" CITEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_snapshot" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "ip" TEXT,
    "last_visit" TIMESTAMP(6),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "charts_pkey" PRIMARY KEY ("chartid")
);

-- CreateTable
CREATE TABLE "user_tokens" (
    "id" SERIAL NOT NULL,
    "token" CHAR(48) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "token_type" "token_type",

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" CITEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "password_hash" CHAR(60),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "email_verified" BOOLEAN NOT NULL DEFAULT true,
    "ip" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'standard',
    "billing_schedule" TEXT,
    "stripe_customer_id" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- AddForeignKey
ALTER TABLE "charts" ADD CONSTRAINT "charts_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

