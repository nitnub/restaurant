-- CreateTable
CREATE TABLE "dish" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "price" DECIMAL,
    "restaurant" INTEGER,
    "vegetarian" BOOLEAN DEFAULT false,
    "vegan" BOOLEAN DEFAULT false,
    "gluten_free" BOOLEAN DEFAULT false,

    CONSTRAINT "dish_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "style" TEXT,
    "rating" DECIMAL DEFAULT 0,
    "image" TEXT,
    "home_page" TEXT,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);



-- CreateTable
CREATE TABLE "user_account" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "admin" BOOLEAN DEFAULT false,
    "avatar" TEXT,
    "active" BOOLEAN DEFAULT true,
    "stripe_customer_id" TEXT,
    "global_user_id" TEXT,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dish" ADD CONSTRAINT "dish_restaurant_fkey" FOREIGN KEY ("restaurant") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
