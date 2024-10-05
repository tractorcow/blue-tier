-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('SS', 'S', 'A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Normal', 'Hard', 'VeryHard', 'Hardcore', 'Extreme', 'Insane', 'Torment', 'Floor1_49', 'Floor50_125');

-- CreateEnum
CREATE TYPE "ArmorType" AS ENUM ('Normal', 'LightArmor', 'HeavyArmor', 'Unarmed', 'ElasticArmor');

-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "raid_id" TEXT NOT NULL,
    "armor_type" "ArmorType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "student_id" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rankings_raid_id_armor_type_difficulty_student_id_user_id_key" ON "rankings"("raid_id", "armor_type", "difficulty", "student_id", "user_id");

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
