--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2023-01-27 03:05:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 17040)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16855)
-- Name: dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dish (
    id integer NOT NULL,
    name text,
    description text,
    image text,
    price numeric,
    restaurant integer,
    vegetarian boolean DEFAULT false,
    vegan boolean DEFAULT false,
    gluten_free boolean DEFAULT false
);


ALTER TABLE public.dish OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16854)
-- Name: dish_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dish_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dish_id_seq OWNER TO postgres;

--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 218
-- Name: dish_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dish_id_seq OWNED BY public.dish.id;


--
-- TOC entry 223 (class 1259 OID 16897)
-- Name: hearted_dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hearted_dish (
    user_id integer NOT NULL,
    dish_id integer NOT NULL,
    update_date date
);


ALTER TABLE public.hearted_dish OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16912)
-- Name: hearted_restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hearted_restaurant (
    user_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    update_date date
);


ALTER TABLE public.hearted_restaurant OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16869)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id integer NOT NULL,
    address_line_one text,
    address_line_two text,
    address_city text,
    address_state text,
    address_zip text,
    token text,
    image text,
    charge_id text,
    charge_amount numeric,
    "user" integer
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16882)
-- Name: order_dish; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_dish (
    order_id integer NOT NULL,
    dish_id integer NOT NULL,
    update_date date
);


ALTER TABLE public.order_dish OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16868)
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_id_seq OWNER TO postgres;

--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 220
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;


--
-- TOC entry 215 (class 1259 OID 16714)
-- Name: restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    style text,
    rating numeric DEFAULT 0,
    image text,
    home_page text
);


ALTER TABLE public.restaurant OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16713)
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.restaurant_id_seq OWNER TO postgres;

--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 214
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurant_id_seq OWNED BY public.restaurant.id;


--
-- TOC entry 217 (class 1259 OID 16778)
-- Name: user_account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_account (
    id integer NOT NULL,
    email text,
    admin boolean DEFAULT false,
    avatar text,
    active boolean DEFAULT true,
    stripe_customer_id text,
    global_user_id text,
    created timestamp with time zone DEFAULT now() NOT NULL,
    last_modified timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_account OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16777)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public.user_account.id;


--
-- TOC entry 3211 (class 2604 OID 16858)
-- Name: dish id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish ALTER COLUMN id SET DEFAULT nextval('public.dish_id_seq'::regclass);


--
-- TOC entry 3215 (class 2604 OID 16872)
-- Name: order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);


--
-- TOC entry 3204 (class 2604 OID 16717)
-- Name: restaurant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant ALTER COLUMN id SET DEFAULT nextval('public.restaurant_id_seq'::regclass);


--
-- TOC entry 3206 (class 2604 OID 16781)
-- Name: user_account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3395 (class 0 OID 17040)
-- Dependencies: 225
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4e915357-9286-4550-8539-41a28f48e63c	a841265f5e3bf40bee2f46508148a5bc8f5d413f3b80eb01f753322562ee74c9	2023-01-17 03:42:55.033194+00	0_init		\N	2023-01-17 03:42:55.033194+00	0
dd73e7ba-cdc0-4839-ab73-8ac4db756d33	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2023-01-19 07:22:45.791291+00	20230119072004_rename_migration	\N	\N	2023-01-19 07:22:45.783047+00	1
\.


--
-- TOC entry 3389 (class 0 OID 16855)
-- Dependencies: 219
-- Data for Name: dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dish (id, name, description, image, price, restaurant, vegetarian, vegan, gluten_free) FROM stdin;
83	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	1	t	f	f
84	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	1	f	f	f
85	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	1	t	f	f
86	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	1	f	f	f
87	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	1	f	f	f
88	Mint Cake	A mint cake	/images/dishes/tds1.png	800	1	t	f	f
89	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	1	t	t	t
91	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	2	t	f	f
92	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	2	f	f	f
93	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	2	t	f	f
94	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	2	f	f	f
95	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	2	f	f	f
96	Mint Cake	A mint cake	/images/dishes/tds1.png	800	2	t	f	f
97	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	2	t	t	t
99	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	3	t	f	f
100	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	3	f	f	f
101	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	3	t	f	f
102	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	3	f	f	f
103	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	3	f	f	f
104	Mint Cake	A mint cake	/images/dishes/tds1.png	800	3	t	f	f
105	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	3	t	t	t
107	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	4	t	f	f
108	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	4	f	f	f
109	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	4	t	f	f
110	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	4	f	f	f
111	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	4	f	f	f
112	Mint Cake	A mint cake	/images/dishes/tds1.png	800	4	t	f	f
113	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	4	t	t	t
115	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	5	t	f	f
116	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	5	f	f	f
117	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	5	t	f	f
118	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	5	f	f	f
119	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	5	f	f	f
120	Mint Cake	A mint cake	/images/dishes/tds1.png	800	5	t	f	f
121	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	5	t	t	t
123	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	6	t	f	f
124	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	6	f	f	f
125	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	6	t	f	f
126	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	6	f	f	f
127	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	6	f	f	f
128	Mint Cake	A mint cake	/images/dishes/tds1.png	800	6	t	f	f
129	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	6	t	t	t
131	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	7	t	f	f
132	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	7	f	f	f
133	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	7	t	f	f
134	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	7	f	f	f
135	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	7	f	f	f
136	Mint Cake	A mint cake	/images/dishes/tds1.png	800	7	t	f	f
137	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	7	t	t	t
82	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	1	t	t	t
90	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	2	t	t	t
98	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	3	t	t	t
106	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	4	t	t	t
114	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	5	t	t	t
122	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	6	t	t	t
139	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	8	t	f	f
140	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	8	f	f	f
141	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	8	t	f	f
142	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	8	f	f	f
143	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	8	f	f	f
144	Mint Cake	A mint cake	/images/dishes/tds1.png	800	8	t	f	f
145	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	8	t	t	t
147	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	9	t	f	f
148	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	9	f	f	f
149	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	9	t	f	f
150	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	9	f	f	f
151	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	9	f	f	f
152	Mint Cake	A mint cake	/images/dishes/tds1.png	800	9	t	f	f
153	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	9	t	t	t
155	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	10	t	f	f
156	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	10	f	f	f
157	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	10	t	f	f
158	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	10	f	f	f
159	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	10	f	f	f
160	Mint Cake	A mint cake	/images/dishes/tds1.png	800	10	t	f	f
161	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	10	t	t	t
163	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	11	t	f	f
164	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	11	f	f	f
165	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	11	t	f	f
166	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	11	f	f	f
167	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	11	f	f	f
168	Mint Cake	A mint cake	/images/dishes/tds1.png	800	11	t	f	f
169	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	11	t	t	t
171	Mac and Cheese	A large bowl of macaroni and cheese	/images/dishes/td2.jpg	1250	12	t	f	f
172	Chicken Parmesan	A large plate of spaghetti with baked chicken breast	/images/dishes/td3.jpg	1250	12	f	f	f
173	Tiny Mac	A half portion of our famous mac and cheese	/images/dishes/td4.jpg	650	12	t	f	f
174	Grilled Chicken Salad	A large salad with roasted chicken	/images/dishes/td5.jpg	1250	12	f	f	f
175	Mediterranean Burger	A mediterranean burger with fries and salad	/images/dishes/td6.jpg	1250	12	f	f	f
176	Mint Cake	A mint cake	/images/dishes/tds1.png	800	12	t	f	f
177	Chocolate Chip Cookie	Our world famous chocolate chip cookie!	/images/dishes/tds2.jpg	400	12	t	t	t
130	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	7	t	t	t
138	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	8	t	t	t
146	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	9	t	t	t
154	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	10	t	t	t
162	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	11	t	t	t
170	Portobello and Greens	A large plate of mushrooms and sauteed greens	/images/dishes/td1.jpg	750	12	t	t	t
\.


--
-- TOC entry 3393 (class 0 OID 16897)
-- Dependencies: 223
-- Data for Name: hearted_dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hearted_dish (user_id, dish_id, update_date) FROM stdin;
\.


--
-- TOC entry 3394 (class 0 OID 16912)
-- Dependencies: 224
-- Data for Name: hearted_restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hearted_restaurant (user_id, restaurant_id, update_date) FROM stdin;
\.


--
-- TOC entry 3391 (class 0 OID 16869)
-- Dependencies: 221
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, address_line_one, address_line_two, address_city, address_state, address_zip, token, image, charge_id, charge_amount, "user") FROM stdin;
\.


--
-- TOC entry 3392 (class 0 OID 16882)
-- Dependencies: 222
-- Data for Name: order_dish; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_dish (order_id, dish_id, update_date) FROM stdin;
\.


--
-- TOC entry 3385 (class 0 OID 16714)
-- Dependencies: 215
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurant (id, name, description, style, rating, image, home_page) FROM stdin;
1	Beacon	Soutwestern style cuisine for the whole family	Southwest	1.5	/images/mexican-restaurant.jpg	https://beacon70.com/
2	The Pink Door	Italian meals with a side of burlesque	Italian	4.5	/images/AutographBrasserie.jpg	https://www.thepinkdoor.net/
4	Shaker + Spear	Upscale hotel venue for Pacific NW fare	Fusion	2	/images/Toms_Restaurant.jpg	https://www.shakerandspear.com/
5	Canlis	Celebrated cuisine with Lake Union views	Pacific Northwest	1	/images/AutographBrasserie.jpg	https://canlis.com/
6	Spinasse	Upscale Italian fare in a rustic setting	Italian	2.5	/images/Toms_Restaurant.jpg	https://spinasse.com/
8	Shuckers	Oyster bar with a sophisticated ambiance	Oyster Bar	3	/images/mexican-restaurant.jpg	https://www.fairmont.com/seattle/dining/shuckers/
9	Cafe Campagne	Casual French bistro in a homey space	French	4	/images/BingBingDimSum_interior.jpg	http://cafecampagne.com/'
10	Andaluca	Mediterranean tapas & paella	Fine Dining	4	/images/Restaurant-Decor-Blog.jpg	https://www.andaluca.com/
11	Stateside	French-inspired Vietnamese cuisine	Asian Fusion	3	/images/mexican-restaurant.jpg	https://www.statesideseattle.com/
13	Oak	Chill watering hole known for burgers	American	4.5	/images/oak-restaurant.jpg	https://oak-seattle.com/
12	Eden Hill Restaurant	Creative, inventive New American fare	New American	2	/images/BingBingDimSum_interior.jpg	http://www.edenhillrestaurant.com/
3	Nue	Eclectic, global street food	Eclectic	3.25	/images/mexican-restaurant.jpg	https://www.nueseattle.com/
7	The Capital Grille	Upscale chophouse chain with clubby look	Fine Dining	5	/images/Toms_Restaurant.jpg	https://www.thecapitalgrille.com/home
\.


--
-- TOC entry 3387 (class 0 OID 16778)
-- Dependencies: 217
-- Data for Name: user_account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_account (id, email, admin, avatar, active, stripe_customer_id, global_user_id, created, last_modified) FROM stdin;
108	test@gmail.com	f	\N	t	cus_NADEg624xzPWsa	63c1aef9b783bce6fcb2d896	2023-01-13 19:20:27.026824+00	2023-01-13 19:20:27.026824+00
\.


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 218
-- Name: dish_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dish_id_seq', 177, true);


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 220
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_id_seq', 1, false);


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 214
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_id_seq', 22, true);


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 160, true);


--
-- TOC entry 3233 (class 2606 OID 17048)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3223 (class 2606 OID 16862)
-- Name: dish dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 16901)
-- Name: hearted_dish hearted_dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_dish
    ADD CONSTRAINT hearted_dish_pkey PRIMARY KEY (user_id, dish_id);


--
-- TOC entry 3231 (class 2606 OID 16916)
-- Name: hearted_restaurant hearted_restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_restaurant
    ADD CONSTRAINT hearted_restaurant_pkey PRIMARY KEY (user_id, restaurant_id);


--
-- TOC entry 3227 (class 2606 OID 16886)
-- Name: order_dish order_dish_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_pkey PRIMARY KEY (order_id, dish_id);


--
-- TOC entry 3225 (class 2606 OID 16876)
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- TOC entry 3219 (class 2606 OID 16721)
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- TOC entry 3221 (class 2606 OID 16785)
-- Name: user_account user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_account
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 16863)
-- Name: dish dish_restaurant_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_restaurant_fkey FOREIGN KEY (restaurant) REFERENCES public.restaurant(id);


--
-- TOC entry 3238 (class 2606 OID 16907)
-- Name: hearted_dish hearted_dish_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_dish
    ADD CONSTRAINT hearted_dish_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id);


--
-- TOC entry 3239 (class 2606 OID 16902)
-- Name: hearted_dish hearted_dish_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_dish
    ADD CONSTRAINT hearted_dish_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(id);


--
-- TOC entry 3240 (class 2606 OID 16922)
-- Name: hearted_restaurant hearted_restaurant_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_restaurant
    ADD CONSTRAINT hearted_restaurant_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3241 (class 2606 OID 16917)
-- Name: hearted_restaurant hearted_restaurant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hearted_restaurant
    ADD CONSTRAINT hearted_restaurant_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_account(id);


--
-- TOC entry 3236 (class 2606 OID 16892)
-- Name: order_dish order_dish_dish_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_dish_id_fkey FOREIGN KEY (dish_id) REFERENCES public.dish(id);


--
-- TOC entry 3237 (class 2606 OID 16887)
-- Name: order_dish order_dish_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_dish
    ADD CONSTRAINT order_dish_order_id_fkey FOREIGN KEY (order_id) REFERENCES public."order"(id);


--
-- TOC entry 3235 (class 2606 OID 16877)
-- Name: order order_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_fkey FOREIGN KEY ("user") REFERENCES public.user_account(id);


-- Completed on 2023-01-27 03:05:22

--
-- PostgreSQL database dump complete
--

