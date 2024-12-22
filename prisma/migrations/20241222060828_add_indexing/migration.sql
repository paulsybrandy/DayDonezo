-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "current_streak" INTEGER NOT NULL,
    "max_streak" INTEGER NOT NULL,
    "last_entry_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Entries" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entries_uid_idx" ON "Entries"("uid");

-- CreateIndex
CREATE INDEX "Tags_entry_id_idx" ON "Tags"("entry_id");

-- AddForeignKey
ALTER TABLE "Entries" ADD CONSTRAINT "Entries_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "Entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
