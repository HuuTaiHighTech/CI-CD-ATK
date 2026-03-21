-- CreateEnum
CREATE TYPE "Language" AS ENUM ('VI', 'EN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Group" AS ENUM ('ALWAYS_TAKE_CARE', 'TRUST_IN_MIND', 'KEEP_PROMISE', 'COMPANY', 'COMMUNITY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "images" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_i18n" (
    "id" TEXT NOT NULL,
    "benefitId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "items" JSONB,

    CONSTRAINT "benefit_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_i18n" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "details" JSONB,

    CONSTRAINT "project_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "star" INTEGER NOT NULL,
    "avatar" VARCHAR(255) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_i18n" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" VARCHAR(100) NOT NULL,
    "content" VARCHAR(255) NOT NULL,

    CONSTRAINT "feedback_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_i18n" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "images" JSONB NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_i18n" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "summary" VARCHAR(255),
    "description" TEXT,
    "features" JSONB,

    CONSTRAINT "product_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pin_products" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pin_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_products" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "top_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_i18n" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tag_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "authorId" TEXT,
    "categoryId" TEXT,
    "thumbnail" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "group" "Group" NOT NULL,
    "relate" "Group"[] DEFAULT ARRAY[]::"Group"[],
    "hot" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_i18n" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "summary" VARCHAR(255),
    "content" TEXT,

    CONSTRAINT "post_i18n_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_tags" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "post_tags_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "banners_key_key" ON "banners"("key");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "settings_key_idx" ON "settings"("key");

-- CreateIndex
CREATE INDEX "benefit_i18n_benefitId_idx" ON "benefit_i18n"("benefitId");

-- CreateIndex
CREATE INDEX "benefit_i18n_lang_idx" ON "benefit_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_i18n_benefitId_lang_key" ON "benefit_i18n"("benefitId", "lang");

-- CreateIndex
CREATE INDEX "project_i18n_projectId_idx" ON "project_i18n"("projectId");

-- CreateIndex
CREATE INDEX "project_i18n_lang_idx" ON "project_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "project_i18n_projectId_lang_key" ON "project_i18n"("projectId", "lang");

-- CreateIndex
CREATE INDEX "feedbacks_createdAt_idx" ON "feedbacks"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "feedbacks_visible_createdAt_idx" ON "feedbacks"("visible", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "feedback_i18n_lang_idx" ON "feedback_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_i18n_feedbackId_lang_key" ON "feedback_i18n"("feedbackId", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_createdAt_idx" ON "categories"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "categories_visible_createdAt_idx" ON "categories"("visible", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "category_i18n_categoryId_idx" ON "category_i18n"("categoryId");

-- CreateIndex
CREATE INDEX "category_i18n_lang_idx" ON "category_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "category_i18n_categoryId_lang_key" ON "category_i18n"("categoryId", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "products_visible_createdAt_idx" ON "products"("visible", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "product_i18n_productId_idx" ON "product_i18n"("productId");

-- CreateIndex
CREATE INDEX "product_i18n_lang_idx" ON "product_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "product_i18n_productId_lang_key" ON "product_i18n"("productId", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "pin_products_productId_key" ON "pin_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "top_products_productId_key" ON "top_products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_createdAt_idx" ON "tags"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "tag_i18n_tagId_idx" ON "tag_i18n"("tagId");

-- CreateIndex
CREATE INDEX "tag_i18n_lang_idx" ON "tag_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "tag_i18n_tagId_lang_key" ON "tag_i18n"("tagId", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_slug_idx" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "posts_published_createdAt_idx" ON "posts"("published", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "post_i18n_postId_idx" ON "post_i18n"("postId");

-- CreateIndex
CREATE INDEX "post_i18n_lang_idx" ON "post_i18n"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "post_i18n_postId_lang_key" ON "post_i18n"("postId", "lang");

-- CreateIndex
CREATE INDEX "post_tags_tagId_idx" ON "post_tags"("tagId");

-- CreateIndex
CREATE INDEX "product_tags_tagId_idx" ON "product_tags"("tagId");

-- AddForeignKey
ALTER TABLE "benefit_i18n" ADD CONSTRAINT "benefit_i18n_benefitId_fkey" FOREIGN KEY ("benefitId") REFERENCES "benefits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_i18n" ADD CONSTRAINT "project_i18n_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_i18n" ADD CONSTRAINT "feedback_i18n_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_i18n" ADD CONSTRAINT "category_i18n_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_i18n" ADD CONSTRAINT "product_i18n_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pin_products" ADD CONSTRAINT "pin_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "top_products" ADD CONSTRAINT "top_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_i18n" ADD CONSTRAINT "tag_i18n_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_i18n" ADD CONSTRAINT "post_i18n_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
