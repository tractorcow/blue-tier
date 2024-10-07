/*
  Warnings:

  - Changed the type of `raid_id` on the `rankings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `student_id` on the `rankings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "rankings" DROP COLUMN "raid_id",
ADD COLUMN     "raid_id" INTEGER NOT NULL,
DROP COLUMN "student_id",
ADD COLUMN     "student_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rankings_raid_id_armor_type_difficulty_student_id_user_id_key" ON "rankings"("raid_id", "armor_type", "difficulty", "student_id", "user_id");
