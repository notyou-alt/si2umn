/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "CourseTypeName" AS ENUM ('compulsory', 'specialization', 'elective');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('single', 'list', 'content');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('success', 'failed', 'partial');

-- CreateEnum
CREATE TYPE "FaqStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "TestimonyStatus" AS ENUM ('draft', 'published', 'archived');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "ACCOUNT" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "ACCOUNT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SESSION" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SESSION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USERS" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "identifier_id" TEXT,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ROLES" (
    "id" TEXT NOT NULL,
    "role_name" "RoleName" NOT NULL,

    CONSTRAINT "ROLES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AUTH_LOGS" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AUTH_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ACTIVITY_LOGS" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ACTIVITY_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NEWS" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_by" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,

    CONSTRAINT "NEWS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VERIFICATION_TOKEN" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VERIFICATION_TOKEN_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "LECTURER" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_photo" TEXT,
    "description" TEXT,
    "handbook_file" TEXT,
    "specialization" TEXT,
    "phone_number" TEXT,

    CONSTRAINT "LECTURER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOURCE_TYPE" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SOURCE_TYPE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LECTURER_SOURCES" (
    "id" TEXT NOT NULL,
    "source_type_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LECTURER_SOURCES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SYNC_LOGS" (
    "id" TEXT NOT NULL,
    "lecturer_source_id" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "record_fetched" INTEGER,
    "record_inserted" INTEGER,
    "error_message" TEXT,

    CONSTRAINT "SYNC_LOGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PUBLICATIONS" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "normalized_title" TEXT NOT NULL,
    "year" INTEGER,
    "doi_raw" TEXT,
    "doi_normalized" TEXT,
    "abstract" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PUBLICATIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PUBLICATIONS_SOURCES" (
    "id" TEXT NOT NULL,
    "publication_id" TEXT NOT NULL,
    "source_type_id" TEXT NOT NULL,
    "external_id" TEXT,

    CONSTRAINT "PUBLICATIONS_SOURCES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PUBLICATIONS_AUTHORS" (
    "id" TEXT NOT NULL,
    "lecturer_id" TEXT,
    "publication_id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "author_order" INTEGER NOT NULL,

    CONSTRAINT "PUBLICATIONS_AUTHORS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DOCUMENT_CATEGORIES" (
    "id" TEXT NOT NULL,
    "categories_name" TEXT NOT NULL,
    "categories_desc" TEXT,

    CONSTRAINT "DOCUMENT_CATEGORIES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DOCUMENTS" (
    "id" TEXT NOT NULL,
    "document_categories_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DOCUMENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SECTIONS" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SECTIONS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CONTENTS" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "image" TEXT,
    "order_no" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CONTENTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CURRICULUM_TYPE" (
    "id" TEXT NOT NULL,
    "course_type_name" "CourseTypeName" NOT NULL,

    CONSTRAINT "CURRICULUM_TYPE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CURRICULUM" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_type_id" TEXT NOT NULL,
    "lecture_credit" INTEGER NOT NULL,
    "lab_credit" INTEGER NOT NULL,
    "ects" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "CURRICULUM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "status" "FaqStatus" NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TESTIMONIES" (
    "id" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_position" TEXT NOT NULL,
    "photo" TEXT,
    "full_testimony" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "TestimonyStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TESTIMONIES_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ACCOUNT_userId_idx" ON "ACCOUNT"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ACCOUNT_provider_providerAccountId_key" ON "ACCOUNT"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "SESSION_sessionToken_key" ON "SESSION"("sessionToken");

-- CreateIndex
CREATE INDEX "SESSION_userId_idx" ON "SESSION"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "USERS_email_key" ON "USERS"("email");

-- CreateIndex
CREATE INDEX "AUTH_LOGS_user_id_idx" ON "AUTH_LOGS"("user_id");

-- CreateIndex
CREATE INDEX "AUTH_LOGS_created_at_idx" ON "AUTH_LOGS"("created_at");

-- CreateIndex
CREATE INDEX "ACTIVITY_LOGS_user_id_idx" ON "ACTIVITY_LOGS"("user_id");

-- CreateIndex
CREATE INDEX "ACTIVITY_LOGS_created_at_idx" ON "ACTIVITY_LOGS"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "NEWS_slug_key" ON "NEWS"("slug");

-- CreateIndex
CREATE INDEX "NEWS_created_at_idx" ON "NEWS"("created_at");

-- CreateIndex
CREATE INDEX "NEWS_slug_idx" ON "NEWS"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VERIFICATION_TOKEN_token_key" ON "VERIFICATION_TOKEN"("token");

-- CreateIndex
CREATE UNIQUE INDEX "LECTURER_user_id_key" ON "LECTURER"("user_id");

-- CreateIndex
CREATE INDEX "LECTURER_SOURCES_lecturer_id_idx" ON "LECTURER_SOURCES"("lecturer_id");

-- CreateIndex
CREATE INDEX "LECTURER_SOURCES_source_type_id_idx" ON "LECTURER_SOURCES"("source_type_id");

-- CreateIndex
CREATE INDEX "SYNC_LOGS_lecturer_source_id_idx" ON "SYNC_LOGS"("lecturer_source_id");

-- CreateIndex
CREATE INDEX "SYNC_LOGS_started_at_idx" ON "SYNC_LOGS"("started_at");

-- CreateIndex
CREATE UNIQUE INDEX "PUBLICATIONS_normalized_title_key" ON "PUBLICATIONS"("normalized_title");

-- CreateIndex
CREATE UNIQUE INDEX "PUBLICATIONS_doi_normalized_key" ON "PUBLICATIONS"("doi_normalized");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_created_at_idx" ON "PUBLICATIONS"("created_at");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_year_idx" ON "PUBLICATIONS"("year");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_SOURCES_publication_id_idx" ON "PUBLICATIONS_SOURCES"("publication_id");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_SOURCES_source_type_id_idx" ON "PUBLICATIONS_SOURCES"("source_type_id");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_AUTHORS_publication_id_idx" ON "PUBLICATIONS_AUTHORS"("publication_id");

-- CreateIndex
CREATE INDEX "PUBLICATIONS_AUTHORS_lecturer_id_idx" ON "PUBLICATIONS_AUTHORS"("lecturer_id");

-- CreateIndex
CREATE UNIQUE INDEX "PUBLICATIONS_AUTHORS_publication_id_author_order_key" ON "PUBLICATIONS_AUTHORS"("publication_id", "author_order");

-- CreateIndex
CREATE INDEX "DOCUMENTS_document_categories_id_idx" ON "DOCUMENTS"("document_categories_id");

-- CreateIndex
CREATE INDEX "DOCUMENTS_created_at_idx" ON "DOCUMENTS"("created_at");

-- CreateIndex
CREATE INDEX "CONTENTS_section_id_idx" ON "CONTENTS"("section_id");

-- CreateIndex
CREATE UNIQUE INDEX "CONTENTS_section_id_order_no_key" ON "CONTENTS"("section_id", "order_no");

-- CreateIndex
CREATE INDEX "CURRICULUM_course_type_id_idx" ON "CURRICULUM"("course_type_id");

-- CreateIndex
CREATE INDEX "FAQ_status_idx" ON "FAQ"("status");

-- CreateIndex
CREATE INDEX "TESTIMONIES_created_at_idx" ON "TESTIMONIES"("created_at");

-- CreateIndex
CREATE INDEX "TESTIMONIES_status_idx" ON "TESTIMONIES"("status");

-- AddForeignKey
ALTER TABLE "ACCOUNT" ADD CONSTRAINT "ACCOUNT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SESSION" ADD CONSTRAINT "SESSION_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USERS" ADD CONSTRAINT "USERS_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "ROLES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AUTH_LOGS" ADD CONSTRAINT "AUTH_LOGS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACTIVITY_LOGS" ADD CONSTRAINT "ACTIVITY_LOGS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NEWS" ADD CONSTRAINT "NEWS_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "USERS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LECTURER" ADD CONSTRAINT "LECTURER_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LECTURER_SOURCES" ADD CONSTRAINT "LECTURER_SOURCES_source_type_id_fkey" FOREIGN KEY ("source_type_id") REFERENCES "SOURCE_TYPE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LECTURER_SOURCES" ADD CONSTRAINT "LECTURER_SOURCES_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "LECTURER"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SYNC_LOGS" ADD CONSTRAINT "SYNC_LOGS_lecturer_source_id_fkey" FOREIGN KEY ("lecturer_source_id") REFERENCES "LECTURER_SOURCES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PUBLICATIONS_SOURCES" ADD CONSTRAINT "PUBLICATIONS_SOURCES_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "PUBLICATIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PUBLICATIONS_SOURCES" ADD CONSTRAINT "PUBLICATIONS_SOURCES_source_type_id_fkey" FOREIGN KEY ("source_type_id") REFERENCES "SOURCE_TYPE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PUBLICATIONS_AUTHORS" ADD CONSTRAINT "PUBLICATIONS_AUTHORS_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "LECTURER"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PUBLICATIONS_AUTHORS" ADD CONSTRAINT "PUBLICATIONS_AUTHORS_publication_id_fkey" FOREIGN KEY ("publication_id") REFERENCES "PUBLICATIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DOCUMENTS" ADD CONSTRAINT "DOCUMENTS_document_categories_id_fkey" FOREIGN KEY ("document_categories_id") REFERENCES "DOCUMENT_CATEGORIES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CONTENTS" ADD CONSTRAINT "CONTENTS_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "SECTIONS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CURRICULUM" ADD CONSTRAINT "CURRICULUM_course_type_id_fkey" FOREIGN KEY ("course_type_id") REFERENCES "CURRICULUM_TYPE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
