/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ArticleTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ArticleTag_name_key" ON "ArticleTag"("name");
