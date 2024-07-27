-- CreateEnum
CREATE TYPE "preeshHeaviness" AS ENUM ('LOWKEY', 'HEAVY', 'HEAVYFR', 'SUPERPREESH');

-- CreateTable
CREATE TABLE "Beast" (
    "id" SERIAL NOT NULL,
    "gamerTag" VARCHAR(20) NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "appleId" TEXT,

    CONSTRAINT "Beast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preesh" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "praysh" BOOLEAN NOT NULL DEFAULT false,
    "heaviness" "preeshHeaviness" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preesh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "preeshId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_prees" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Beast_gamerTag_key" ON "Beast"("gamerTag");

-- CreateIndex
CREATE UNIQUE INDEX "Beast_email_key" ON "Beast"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Beast_appleId_key" ON "Beast"("appleId");

-- CreateIndex
CREATE UNIQUE INDEX "_prees_AB_unique" ON "_prees"("A", "B");

-- CreateIndex
CREATE INDEX "_prees_B_index" ON "_prees"("B");

-- AddForeignKey
ALTER TABLE "Preesh" ADD CONSTRAINT "Preesh_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Beast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preesh" ADD CONSTRAINT "Preesh_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Beast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_preeshId_fkey" FOREIGN KEY ("preeshId") REFERENCES "Preesh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Beast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_prees" ADD CONSTRAINT "_prees_A_fkey" FOREIGN KEY ("A") REFERENCES "Beast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_prees" ADD CONSTRAINT "_prees_B_fkey" FOREIGN KEY ("B") REFERENCES "Preesh"("id") ON DELETE CASCADE ON UPDATE CASCADE;
