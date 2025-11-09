-- AlterTable
ALTER TABLE "items" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "items_hidden_idx" ON "items"("hidden");
