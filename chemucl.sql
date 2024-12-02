--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-03-08 09:03:51 GMT

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
-- TOC entry 855 (class 1247 OID 17188)
-- Name: QrCodeType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QrCodeType" AS ENUM (
    'CHEMICAL',
    'LOCATION'
);


ALTER TYPE public."QrCodeType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 17222)
-- Name: QrCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QrCode" (
    "qrId" integer NOT NULL,
    type public."QrCodeType" NOT NULL,
    "locationID" integer,
    "chemicalID" integer
);


ALTER TABLE public."QrCode" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17221)
-- Name: QrCode_qrId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."QrCode_qrId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."QrCode_qrId_seq" OWNER TO postgres;

--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 222
-- Name: QrCode_qrId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."QrCode_qrId_seq" OWNED BY public."QrCode"."qrId";


--
-- TOC entry 221 (class 1259 OID 17213)
-- Name: ResearchGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ResearchGroup" (
    "groupId" integer NOT NULL,
    "groupName" text NOT NULL
);


ALTER TABLE public."ResearchGroup" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17212)
-- Name: ResearchGroup_groupId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ResearchGroup_groupId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ResearchGroup_groupId_seq" OWNER TO postgres;

--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 220
-- Name: ResearchGroup_groupId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ResearchGroup_groupId_seq" OWNED BY public."ResearchGroup"."groupId";


--
-- TOC entry 217 (class 1259 OID 17194)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "userId" integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "activeStatus" boolean NOT NULL,
    "researchGroupID" integer,
    permission text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 17193)
-- Name: User_userId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_userId_seq" OWNER TO postgres;

--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 216
-- Name: User_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_userId_seq" OWNED BY public."User"."userId";


--
-- TOC entry 215 (class 1259 OID 17176)
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
-- TOC entry 219 (class 1259 OID 17203)
-- Name: chemicals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chemicals (
    "chemicalID" integer NOT NULL,
    "casNumber" text NOT NULL,
    "restrictionStatus" boolean NOT NULL,
    "chemicalName" text NOT NULL,
    "locationID" integer NOT NULL,
    "activeStatus" boolean NOT NULL,
    "researchGroupID" integer NOT NULL,
    supplier text NOT NULL,
    description text NOT NULL,
    "auditStatus" boolean NOT NULL,
    "lastAudit" timestamp(3) without time zone NOT NULL,
    "quartzyNumber" text NOT NULL,
    "qrID" integer,
    quantity integer NOT NULL,
    "dateAdded" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateUpdated" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chemicals OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17202)
-- Name: chemicals_chemicalID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."chemicals_chemicalID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."chemicals_chemicalID_seq" OWNER TO postgres;

--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 218
-- Name: chemicals_chemicalID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."chemicals_chemicalID_seq" OWNED BY public.chemicals."chemicalID";


--
-- TOC entry 225 (class 1259 OID 17229)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    "locationID" integer NOT NULL,
    building text NOT NULL,
    room text NOT NULL,
    "subLocation1" text,
    "subLocation2" text,
    "subLocation3" text,
    "subLocation4" text,
    "qrID" integer
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17228)
-- Name: locations_locationID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."locations_locationID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."locations_locationID_seq" OWNER TO postgres;

--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 224
-- Name: locations_locationID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."locations_locationID_seq" OWNED BY public.locations."locationID";


--
-- TOC entry 227 (class 1259 OID 17238)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    "logID" integer NOT NULL,
    "userID" integer NOT NULL,
    "actionType" text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" integer NOT NULL,
    description text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17237)
-- Name: logs_logID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."logs_logID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."logs_logID_seq" OWNER TO postgres;

--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 226
-- Name: logs_logID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."logs_logID_seq" OWNED BY public.logs."logID";


--
-- TOC entry 3481 (class 2604 OID 17225)
-- Name: QrCode qrId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QrCode" ALTER COLUMN "qrId" SET DEFAULT nextval('public."QrCode_qrId_seq"'::regclass);


--
-- TOC entry 3480 (class 2604 OID 17216)
-- Name: ResearchGroup groupId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResearchGroup" ALTER COLUMN "groupId" SET DEFAULT nextval('public."ResearchGroup_groupId_seq"'::regclass);


--
-- TOC entry 3477 (class 2604 OID 17197)
-- Name: User userId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userId" SET DEFAULT nextval('public."User_userId_seq"'::regclass);


--
-- TOC entry 3478 (class 2604 OID 17206)
-- Name: chemicals chemicalID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals ALTER COLUMN "chemicalID" SET DEFAULT nextval('public."chemicals_chemicalID_seq"'::regclass);


--
-- TOC entry 3482 (class 2604 OID 17232)
-- Name: locations locationID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN "locationID" SET DEFAULT nextval('public."locations_locationID_seq"'::regclass);


--
-- TOC entry 3483 (class 2604 OID 17241)
-- Name: logs logID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN "logID" SET DEFAULT nextval('public."logs_logID_seq"'::regclass);


--
-- TOC entry 3662 (class 0 OID 17222)
-- Dependencies: 223
-- Data for Name: QrCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QrCode" ("qrId", type, "locationID", "chemicalID") FROM stdin;
1	LOCATION	1	\N
2	CHEMICAL	\N	1
\.


--
-- TOC entry 3660 (class 0 OID 17213)
-- Dependencies: 221
-- Data for Name: ResearchGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ResearchGroup" ("groupId", "groupName") FROM stdin;
1	Genetic Engineering Lab
\.


--
-- TOC entry 3656 (class 0 OID 17194)
-- Dependencies: 217
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("userId", email, name, "activeStatus", "researchGroupID", permission) FROM stdin;
1	researcher@lab.example	Dr. Alice	t	1	admin
\.


--
-- TOC entry 3654 (class 0 OID 17176)
-- Dependencies: 215
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d0dfb02f-577a-478e-9ee2-d86b0234d8e7	73f9635ab3a8d0554ddbd87ecc7d0cfc9735221ef222f2d07fa4d355c8876687	2024-03-08 04:47:19.020745+00	20240308044718_init	\N	\N	2024-03-08 04:47:18.897627+00	1
\.


--
-- TOC entry 3658 (class 0 OID 17203)
-- Dependencies: 219
-- Data for Name: chemicals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chemicals ("chemicalID", "casNumber", "restrictionStatus", "chemicalName", "locationID", "activeStatus", "researchGroupID", supplier, description, "auditStatus", "lastAudit", "quartzyNumber", "qrID", quantity, "dateAdded", "dateUpdated") FROM stdin;
1	7732-18-5	f	Water	1	t	1	ChemSupply Co.	purified	t	2024-03-08 04:48:14.83	WTR-001	1	100	2024-03-08 04:48:14.832	2024-03-08 04:48:14.832
\.


--
-- TOC entry 3664 (class 0 OID 17229)
-- Dependencies: 225
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations ("locationID", building, room, "subLocation1", "subLocation2", "subLocation3", "subLocation4", "qrID") FROM stdin;
1	Science Building	101	\N	\N	\N	\N	\N
\.


--
-- TOC entry 3666 (class 0 OID 17238)
-- Dependencies: 227
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs ("logID", "userID", "actionType", "entityType", "entityId", description, "timestamp") FROM stdin;
1	1	CREATE	Chemical	1	Chemical Water, purified added to inventory	2024-03-08 04:48:14.842
\.


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 222
-- Name: QrCode_qrId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."QrCode_qrId_seq"', 2, true);


--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 220
-- Name: ResearchGroup_groupId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ResearchGroup_groupId_seq"', 1, true);


--
-- TOC entry 3680 (class 0 OID 0)
-- Dependencies: 216
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_userId_seq"', 1, true);


--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 218
-- Name: chemicals_chemicalID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."chemicals_chemicalID_seq"', 1, true);


--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 224
-- Name: locations_locationID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."locations_locationID_seq"', 1, true);


--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 226
-- Name: logs_logID_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."logs_logID_seq"', 1, true);


--
-- TOC entry 3498 (class 2606 OID 17227)
-- Name: QrCode QrCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QrCode"
    ADD CONSTRAINT "QrCode_pkey" PRIMARY KEY ("qrId");


--
-- TOC entry 3494 (class 2606 OID 17220)
-- Name: ResearchGroup ResearchGroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ResearchGroup"
    ADD CONSTRAINT "ResearchGroup_pkey" PRIMARY KEY ("groupId");


--
-- TOC entry 3489 (class 2606 OID 17201)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");


--
-- TOC entry 3486 (class 2606 OID 17184)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3491 (class 2606 OID 17211)
-- Name: chemicals chemicals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT chemicals_pkey PRIMARY KEY ("chemicalID");


--
-- TOC entry 3502 (class 2606 OID 17236)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY ("locationID");


--
-- TOC entry 3504 (class 2606 OID 17246)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY ("logID");


--
-- TOC entry 3495 (class 1259 OID 17250)
-- Name: QrCode_chemicalID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QrCode_chemicalID_key" ON public."QrCode" USING btree ("chemicalID");


--
-- TOC entry 3496 (class 1259 OID 17249)
-- Name: QrCode_locationID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QrCode_locationID_key" ON public."QrCode" USING btree ("locationID");


--
-- TOC entry 3487 (class 1259 OID 17247)
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- TOC entry 3492 (class 1259 OID 17248)
-- Name: chemicals_qrID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "chemicals_qrID_key" ON public.chemicals USING btree ("qrID");


--
-- TOC entry 3499 (class 1259 OID 17251)
-- Name: locations_building_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX locations_building_key ON public.locations USING btree (building);


--
-- TOC entry 3500 (class 1259 OID 17252)
-- Name: locations_building_room_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX locations_building_room_key ON public.locations USING btree (building, room);


--
-- TOC entry 3508 (class 2606 OID 17273)
-- Name: QrCode QrCode_chemicalID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QrCode"
    ADD CONSTRAINT "QrCode_chemicalID_fkey" FOREIGN KEY ("chemicalID") REFERENCES public.chemicals("chemicalID") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3509 (class 2606 OID 17268)
-- Name: QrCode QrCode_locationID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QrCode"
    ADD CONSTRAINT "QrCode_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES public.locations("locationID") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3505 (class 2606 OID 17253)
-- Name: User User_researchGroupID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_researchGroupID_fkey" FOREIGN KEY ("researchGroupID") REFERENCES public."ResearchGroup"("groupId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3506 (class 2606 OID 17258)
-- Name: chemicals chemicals_locationID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT "chemicals_locationID_fkey" FOREIGN KEY ("locationID") REFERENCES public.locations("locationID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3507 (class 2606 OID 17263)
-- Name: chemicals chemicals_researchGroupID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT "chemicals_researchGroupID_fkey" FOREIGN KEY ("researchGroupID") REFERENCES public."ResearchGroup"("groupId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3510 (class 2606 OID 17278)
-- Name: logs logs_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT "logs_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2024-03-08 09:03:52 GMT

--
-- PostgreSQL database dump complete
--

