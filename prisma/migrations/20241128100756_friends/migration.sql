-- CreateTable
CREATE TABLE "friends" (
    "relation_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "target_id" INTEGER,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("relation_id")
);

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
