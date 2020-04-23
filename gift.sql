--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

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

--
-- Name: rating(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rating(id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$declare
	rating NUMERIC(5, 1);
BEGIN
	SELECT INTO rating AVG("ratingScore") FROM review_item WHERE "itemId" = id;
   	IF rating IS NULL THEN
	   rating = 0;
	END IF;
   RETURN rating;
END;
$$;


--
-- Name: score_review(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.score_review(id integer, OUT review numeric, OUT rating numeric) RETURNS record
    LANGUAGE plpgsql
    AS $$BEGIN
   SELECT INTO review COUNT("itemId") FROM review_item WHERE "itemId" = id;

   SELECT INTO rating COUNT("ratingScore") FROM review_item WHERE "itemId" = id;
   
END; $$;


--
-- Name: totalreview(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.totalreview(id integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
declare
	totalReview NUMERIC;
BEGIN
   SELECT INTO totalReview COUNT("itemId") FROM review_item WHERE "itemId" = id;
	
   RETURN totalReview;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.items (
    "itemId" integer NOT NULL,
    name character varying NOT NULL,
    point numeric NOT NULL,
    qty integer NOT NULL,
    info text NOT NULL,
    image character varying NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.item_id_seq OWNED BY public.items."itemId";


--
-- Name: redeems; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redeems (
    "redeemId" integer NOT NULL,
    point numeric NOT NULL,
    "time" timestamp with time zone NOT NULL
);


--
-- Name: redeem_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.redeem_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: redeem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.redeem_id_seq OWNED BY public.redeems."redeemId";


--
-- Name: redeem_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.redeem_item (
    "itemId" integer NOT NULL,
    "redeemId" integer NOT NULL,
    point numeric NOT NULL,
    qty integer NOT NULL
);


--
-- Name: review_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_item (
    "itemId" integer NOT NULL,
    "redeemId" integer NOT NULL,
    "ratingScore" integer NOT NULL,
    review text
);


--
-- Name: items itemId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items ALTER COLUMN "itemId" SET DEFAULT nextval('public.item_id_seq'::regclass);


--
-- Name: redeems redeemId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redeems ALTER COLUMN "redeemId" SET DEFAULT nextval('public.redeem_id_seq'::regclass);


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.items ("itemId", name, point, qty, info, image, status, "createdAt", "updatedAt") FROM stdin;
21	Samsung Galaxy S9 Midnight Black 64 Gb	20000	10	New galaxy meteor of samsung	01342fede6cec136b0f57289cd08ee3c	1	2020-04-22 22:16:27.322+07	2020-04-23 15:37:36.399+07
22	Suitcase American Tourist Purple 	5000	25	American standar suitcase	8e909b454779793f357c6e52a9842d90	1	2020-04-22 22:19:18.918+07	2020-04-23 15:38:12.294+07
23	Yoobao powerbank 10.000 mAh	5000	50	High Capacity 10000mAh Battery	14496467078cb4988b41c476ebebaf89	1	2020-04-22 22:21:51.909+07	2020-04-23 15:38:20.298+07
24	Chatime Voucher Rp 20.000	1000	150	Promo 2020	c1e1fa66a9e4d70de270f457f453d56f	1	2020-04-22 22:24:31.299+07	2020-04-23 15:38:30.058+07
26	Samsung Note 10 White 256 Gb	25000	15	Promo 2020	0886543f7cc6a026b8d9a896f60dda95	1	2020-04-22 22:36:45.84+07	2020-04-23 15:39:12.172+07
27	Macbook Pro 13 2019 [i5,8Gb,128Gb]	45000	9	Macbook Pro Core I5 - 9550 Ram 8 Gb ddr4 2440mhz SSD 128 Gb 	c6dba6ba52663b7b7f4fd218d78ec572	1	2020-04-22 22:42:30.502+07	2020-04-23 18:58:52.584+07
25	Samsung Note 10 Aura Glowing 256 Gb	25000	12	Promo 2020	53e9da875fe36b0cbcd75421e2875ac4	1	2020-04-22 22:36:33.696+07	2020-04-23 18:59:04.813+07
28	Macbook Pro 16 2019 [i9,16Gb,512Gb, RX 560]	45000	15	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	97a9fd6a054b43309ea7dbf921d9bba8	1	2020-04-22 22:43:34.351+07	\N
29	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	350bf0153423e4743b0622da5f2bd8b9	1	2020-04-22 23:30:25.525+07	\N
30	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	a55157f182286a2de3eccb3192bdf7fd	1	2020-04-23 10:40:53.744+07	\N
31	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	a81f7eab47c7dc09c75f0ba08b1573fb	1	2020-04-23 10:40:56.272+07	\N
32	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	272f40bd3f61f9e9d5aee105c721018a	1	2020-04-23 10:40:57.057+07	\N
33	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	14a03ec3bead2cb0d7a1164d06993407	1	2020-04-23 10:40:57.573+07	\N
34	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	3346b579230910a2e8d70fea3fd739a1	1	2020-04-23 10:40:58.062+07	\N
35	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	8863e190025b733ead060c359e5dbdf2	1	2020-04-23 10:40:58.542+07	\N
36	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	5f3f9280e1216027911cd4ef6e30e2c6	1	2020-04-23 10:40:59.012+07	\N
37	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	51d0f95f0fa4f2a181db5ba6451ee2d7	1	2020-04-23 10:40:59.484+07	\N
38	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	c8f06e5e8f211d3557887b6216c87d66	1	2020-04-23 10:40:59.924+07	\N
39	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	7cfa51bc71de060f8814e5a90b90951d	1	2020-04-23 10:41:00.389+07	\N
40	Macbook Pro 18 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	d4bb4aa5319bb7ca86fc96e978b34717	1	2020-04-23 10:41:01.025+07	\N
41	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	b27aee5d5cb3592baa544c39d97449bc	1	2020-04-23 10:41:13.217+07	\N
42	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	d16883bde5d188aca758b9dfa464ffee	1	2020-04-23 10:41:13.86+07	\N
43	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	03b92d69982cb010fdf0444c87697517	1	2020-04-23 10:41:14.35+07	\N
44	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	90d6b5e5d796ea90efd2f14f5559cb7a	1	2020-04-23 10:41:14.846+07	\N
45	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	d2a6be2e54e9a577853d7bd878a9d489	1	2020-04-23 10:41:15.302+07	\N
46	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	c2c982e32a555689ea752d0988bc1f20	1	2020-04-23 10:41:15.917+07	\N
47	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	150	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	19a04eeb029d9afe37340f7234ca94ca	1	2020-04-23 10:41:16.349+07	\N
48	Macbook Pro 17 2020 [i9,16Gb,512Gb, RX 560]	45000	15	Macbook Pro Core I9 - 9850K Ram 16 Gb ddr4 2440mhz SSD 512 Gb Radeon RX 560 	4b110cce321d2143181685496db7554f	1	2020-04-23 10:41:16.745+07	\N
\.


--
-- Data for Name: redeem_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.redeem_item ("itemId", "redeemId", point, qty) FROM stdin;
27	22	90000	2
48	23	9000000	200
48	24	900000	20
48	25	900000	20
48	26	90000000	2000
27	27	90000	2
27	28	90000	2
25	29	25000	1
25	30	25000	1
25	31	25000	1
\.


--
-- Data for Name: redeems; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.redeems ("redeemId", point, "time") FROM stdin;
22	90000	2020-04-23 00:07:53.042+07
23	9000000	2020-04-23 10:50:00.58+07
24	900000	2020-04-23 10:50:04.987+07
25	900000	2020-04-23 10:50:45.137+07
26	90000000	2020-04-23 10:51:48.602+07
27	90000	2020-04-23 18:58:50.17+07
28	90000	2020-04-23 18:58:52.575+07
29	25000	2020-04-23 18:59:02.406+07
30	25000	2020-04-23 18:59:03.056+07
31	25000	2020-04-23 18:59:04.806+07
\.


--
-- Data for Name: review_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_item ("itemId", "redeemId", "ratingScore", review) FROM stdin;
27	22	4	Lumayan dapet laptop
27	27	5	Barangnya bagus
27	28	4	\N
25	29	4	\N
25	30	3	\N
25	31	1	\N
\.


--
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.item_id_seq', 50, true);


--
-- Name: redeem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.redeem_id_seq', 31, true);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY ("itemId");


--
-- Name: redeem_item redeem_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redeem_item
    ADD CONSTRAINT redeem_item_pkey PRIMARY KEY ("itemId", "redeemId");


--
-- Name: redeems redeems_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redeems
    ADD CONSTRAINT redeems_pkey PRIMARY KEY ("redeemId");


--
-- Name: review_item review_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_item
    ADD CONSTRAINT review_item_pkey PRIMARY KEY ("itemId", "redeemId");


--
-- Name: redeem_item redeem_item_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redeem_item
    ADD CONSTRAINT redeem_item_item_id_fkey FOREIGN KEY ("itemId") REFERENCES public.items("itemId");


--
-- Name: redeem_item redeem_item_redeem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.redeem_item
    ADD CONSTRAINT redeem_item_redeem_id_fkey FOREIGN KEY ("redeemId") REFERENCES public.redeems("redeemId");


--
-- Name: review_item review_item_item_id_redeem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_item
    ADD CONSTRAINT review_item_item_id_redeem_id_fkey FOREIGN KEY ("itemId", "redeemId") REFERENCES public.redeem_item("itemId", "redeemId");


--
-- PostgreSQL database dump complete
--

