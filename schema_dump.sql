--
-- PostgreSQL database dump
--

\restrict haIaMC1fFQFFGdFS9zLVtQrB602g1aj5cSqg8O1dZOQQgvCYgcwhdHBAv7aok31

-- Dumped from database version 17.8 (9c8634e)
-- Dumped by pg_dump version 17.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: flickchat_dev
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO flickchat_dev;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: flickchat_dev
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AuthProvider; Type: TYPE; Schema: public; Owner: flickchat_dev
--

CREATE TYPE public."AuthProvider" AS ENUM (
    'PHONE',
    'GOOGLE',
    'FACEBOOK',
    'APPLE'
);


ALTER TYPE public."AuthProvider" OWNER TO flickchat_dev;

--
-- Name: ChatRole; Type: TYPE; Schema: public; Owner: flickchat_dev
--

CREATE TYPE public."ChatRole" AS ENUM (
    'ADMIN',
    'MEMBER'
);


ALTER TYPE public."ChatRole" OWNER TO flickchat_dev;

--
-- Name: ChatType; Type: TYPE; Schema: public; Owner: flickchat_dev
--

CREATE TYPE public."ChatType" AS ENUM (
    'DIRECT',
    'GROUP'
);


ALTER TYPE public."ChatType" OWNER TO flickchat_dev;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: flickchat_dev
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO flickchat_dev;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: flickchat_dev
--

CREATE TYPE public."MessageType" AS ENUM (
    'TEXT',
    'IMAGE',
    'VIDEO',
    'AUDIO',
    'FILE',
    'STICKER',
    'SYSTEM'
);


ALTER TYPE public."MessageType" OWNER TO flickchat_dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: flickchat_dev
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


ALTER TABLE public._prisma_migrations OWNER TO flickchat_dev;

--
-- Name: chat_participants; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.chat_participants (
    id uuid NOT NULL,
    "chatId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    role public."ChatRole" DEFAULT 'MEMBER'::public."ChatRole" NOT NULL,
    "joinedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "leftAt" timestamp(3) without time zone,
    "lastReadAt" timestamp(3) without time zone,
    "isMuted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chat_participants OWNER TO flickchat_dev;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.chats (
    id uuid NOT NULL,
    type public."ChatType" DEFAULT 'DIRECT'::public."ChatType" NOT NULL,
    name text,
    "imageUrl" text,
    "directKey" text,
    "createdById" uuid,
    "lastMessageAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.chats OWNER TO flickchat_dev;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    "chatId" uuid NOT NULL,
    "senderId" uuid NOT NULL,
    type public."MessageType" DEFAULT 'TEXT'::public."MessageType" NOT NULL,
    content text,
    "mediaUrl" text,
    "mimeType" text,
    "fileName" text,
    "fileSize" integer,
    "replyToId" uuid,
    "isEdited" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO flickchat_dev;

--
-- Name: user_auth_providers; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.user_auth_providers (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    provider public."AuthProvider" NOT NULL,
    "providerId" text,
    "isVerified" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_auth_providers OWNER TO flickchat_dev;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.user_sessions (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "refreshToken" text NOT NULL,
    "deviceId" text,
    "deviceName" text,
    "deviceType" text,
    platform text,
    "appVersion" text,
    "osVersion" text,
    "fcmToken" text,
    "ipAddress" text,
    "userAgent" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.user_sessions OWNER TO flickchat_dev;

--
-- Name: users; Type: TABLE; Schema: public; Owner: flickchat_dev
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    "fullName" text NOT NULL,
    username text NOT NULL,
    "profilePicture" text,
    bio text,
    gender public."Gender",
    "dateOfBirth" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "isBlocked" boolean DEFAULT false NOT NULL,
    "isOnline" boolean DEFAULT false NOT NULL,
    "lastSeenAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    email text,
    "phoneNumber" text NOT NULL
);


ALTER TABLE public.users OWNER TO flickchat_dev;

--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: chat_participants chat_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT chat_participants_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: user_auth_providers user_auth_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.user_auth_providers
    ADD CONSTRAINT user_auth_providers_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: chat_participants_chatId_userId_key; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE UNIQUE INDEX "chat_participants_chatId_userId_key" ON public.chat_participants USING btree ("chatId", "userId");


--
-- Name: chat_participants_userId_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "chat_participants_userId_idx" ON public.chat_participants USING btree ("userId");


--
-- Name: chats_directKey_key; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE UNIQUE INDEX "chats_directKey_key" ON public.chats USING btree ("directKey");


--
-- Name: chats_lastMessageAt_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "chats_lastMessageAt_idx" ON public.chats USING btree ("lastMessageAt");


--
-- Name: chats_type_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX chats_type_idx ON public.chats USING btree (type);


--
-- Name: messages_chatId_createdAt_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "messages_chatId_createdAt_idx" ON public.messages USING btree ("chatId", "createdAt");


--
-- Name: messages_senderId_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "messages_senderId_idx" ON public.messages USING btree ("senderId");


--
-- Name: user_auth_providers_provider_providerId_key; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE UNIQUE INDEX "user_auth_providers_provider_providerId_key" ON public.user_auth_providers USING btree (provider, "providerId");


--
-- Name: user_sessions_refreshToken_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "user_sessions_refreshToken_idx" ON public.user_sessions USING btree ("refreshToken");


--
-- Name: user_sessions_refreshToken_key; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON public.user_sessions USING btree ("refreshToken");


--
-- Name: user_sessions_userId_idx; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE INDEX "user_sessions_userId_idx" ON public.user_sessions USING btree ("userId");


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: flickchat_dev
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: chat_participants chat_participants_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "chat_participants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public.chats(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_participants chat_participants_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.chat_participants
    ADD CONSTRAINT "chat_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chats chats_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "chats_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public.chats(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_replyToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES public.messages(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_auth_providers user_auth_providers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.user_auth_providers
    ADD CONSTRAINT "user_auth_providers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flickchat_dev
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict haIaMC1fFQFFGdFS9zLVtQrB602g1aj5cSqg8O1dZOQQgvCYgcwhdHBAv7aok31

