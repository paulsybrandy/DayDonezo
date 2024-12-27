/*
  Warnings:

  - Changed the type of `content` on the `Entries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Entries" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA NOT NULL;

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Feedback_uid_idx" ON "Feedback"("uid");

-- CreateIndex
CREATE INDEX "Feedback_id_idx" ON "Feedback"("id");

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
