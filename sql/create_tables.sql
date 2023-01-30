
CREATE TABLE _prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
  
  CREATE TABLE IF NOT EXISTS user_account (
  	id SERIAL PRIMARY KEY, 
    email TEXT, 
    first_name TEXT,
    avatar TEXT, 
  	stripe_customer_id TEXT, 
    global_user_id TEXT,
    admin BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  
  
  CREATE TABLE IF NOT EXISTS restaurant (
  	id SERIAL PRIMARY KEY, 
  	name TEXT, 
  	description TEXT, 
  	style TEXT,
  	rating NUMERIC DEFAULT 0,
  	image TEXT,
  	home_page TEXT,
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  

  CREATE TABLE IF NOT EXISTS dish (
    id SERIAL PRIMARY KEY, 
    name TEXT, 
    description TEXT, 
    image TEXT,
    price NUMERIC,
    restaurant NUMERIC,
    vegetarian BOOLEAN DEFAULT false,
    vegan BOOLEAN DEFAULT false,
    gluten_free BOOLEAN DEFAULT false,
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  

  CREATE TABLE IF NOT EXISTS "order" (
    id SERIAL PRIMARY KEY, 
    address_line_one TEXT, 
    address_line_two TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    token TEXT, 
    image TEXT,
    charge_id TEXT,
    charge_amount NUMERIC,
    "user" integer REFERENCES "user_account" (id),
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()

  );
  
  
  CREATE TABLE IF NOT EXISTS order_dish (
    order_id integer REFERENCES "order" (id),
    dish_id integer REFERENCES dish (id),
    PRIMARY KEY (order_id, dish_id),
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  
  
  CREATE TABLE IF NOT EXISTS hearted_dish (
    user_id integer REFERENCES "user_account" (id),
    dish_id integer REFERENCES dish (id),
    PRIMARY KEY (user_id, dish_id),
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  

  CREATE TABLE IF NOT EXISTS hearted_restaurant (
    user_id integer REFERENCES "user_account" (id),
    restaurant_id integer REFERENCES restaurant (id),
    PRIMARY KEY (user_id, restaurant_id),
    created TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  