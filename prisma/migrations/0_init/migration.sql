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
CREATE TABLE "hearted_dish" (
    "user_id" INTEGER NOT NULL,
    "dish_id" INTEGER NOT NULL,
    "update_date" DATE,

    CONSTRAINT "hearted_dish_pkey" PRIMARY KEY ("user_id","dish_id")
);

-- CreateTable
CREATE TABLE "hearted_restaurant" (
    "user_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "update_date" DATE,

    CONSTRAINT "hearted_restaurant_pkey" PRIMARY KEY ("user_id","restaurant_id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "address_line_one" TEXT,
    "address_line_two" TEXT,
    "address_city" TEXT,
    "address_state" TEXT,
    "address_zip" TEXT,
    "token" TEXT,
    "image" TEXT,
    "charge_id" TEXT,
    "charge_amount" DECIMAL,
    "user" INTEGER,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_dish" (
    "order_id" INTEGER NOT NULL,
    "dish_id" INTEGER NOT NULL,
    "update_date" DATE,

    CONSTRAINT "order_dish_pkey" PRIMARY KEY ("order_id","dish_id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "refresh_token_hash" TEXT,
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "test_hearted_dish" (
    "user_id" INTEGER NOT NULL,
    "dish_id" INTEGER NOT NULL,
    "created_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "modified_on" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_hearted_dish_pkey" PRIMARY KEY ("user_id","dish_id")
);

-- CreateTable
CREATE TABLE "testtable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DECIMAL,
    "has_vegetarian" BOOLEAN,
    "date" DATE,
    "date_two" TIMETZ(6),

    CONSTRAINT "testtable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "email" TEXT,
    "pass_hash" TEXT,
    "pass_reset_token" TEXT,
    "admin" BOOLEAN DEFAULT false,
    "last_name" TEXT,
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

-- AddForeignKey
ALTER TABLE "hearted_dish" ADD CONSTRAINT "hearted_dish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hearted_dish" ADD CONSTRAINT "hearted_dish_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hearted_restaurant" ADD CONSTRAINT "hearted_restaurant_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hearted_restaurant" ADD CONSTRAINT "hearted_restaurant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_fkey" FOREIGN KEY ("user") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_dish" ADD CONSTRAINT "order_dish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_dish" ADD CONSTRAINT "order_dish_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_hearted_dish" ADD CONSTRAINT "test_hearted_dish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dish"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "test_hearted_dish" ADD CONSTRAINT "test_hearted_dish_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

