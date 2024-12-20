

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


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."create_shared_state"("state" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO public.shared_state (state) VALUES (state) RETURNING id INTO new_id;
    RETURN new_id;
END;
$$;


ALTER FUNCTION "public"."create_shared_state"("state" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_shared_state"("shared_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    result jsonb;
BEGIN
    -- Increment the visited column
    UPDATE public.shared_state
    SET visited = visited + 1
    WHERE id = shared_id;

    -- Retrieve the state
    SELECT state INTO result FROM public.shared_state WHERE id = shared_id;
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_shared_state"("shared_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_room_create"("offer" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO public.sync_room (offer) VALUES (offer) RETURNING id INTO new_id;
    RETURN new_id;
END;
$$;


ALTER FUNCTION "public"."sync_room_create"("offer" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_room_get"("uuid" "uuid") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    result RECORD;
BEGIN
    SELECT * INTO result FROM public.sync_room WHERE id = uuid;
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."sync_room_get"("uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_room_join"("uuid" "uuid", "new_reply" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Check if the reply already exists
    IF EXISTS (SELECT 1 FROM public.sync_room WHERE id = uuid AND reply <> '') THEN
        RAISE EXCEPTION 'Reply already exists for the given uuid';
    END IF;

    -- Update the reply if it does not exist
    UPDATE public.sync_room
    SET reply = new_reply
    WHERE id = uuid;
END;
$$;


ALTER FUNCTION "public"."sync_room_join"("uuid" "uuid", "new_reply" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."shared_state" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "state" "jsonb" NOT NULL,
    "visited" bigint DEFAULT '0'::bigint NOT NULL
);


ALTER TABLE "public"."shared_state" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_room" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "offer" "text" DEFAULT ''::"text" NOT NULL,
    "reply" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."sync_room" OWNER TO "postgres";


ALTER TABLE ONLY "public"."shared_state"
    ADD CONSTRAINT "shared_state_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_room"
    ADD CONSTRAINT "sync_room_pkey" PRIMARY KEY ("id");



ALTER TABLE "public"."shared_state" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_room" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";









































































































































































































GRANT ALL ON FUNCTION "public"."create_shared_state"("state" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_shared_state"("state" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_shared_state"("state" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_shared_state"("shared_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_shared_state"("shared_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_shared_state"("shared_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_room_create"("offer" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_room_create"("offer" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_room_create"("offer" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_room_get"("uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_room_get"("uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_room_get"("uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_room_join"("uuid" "uuid", "new_reply" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."sync_room_join"("uuid" "uuid", "new_reply" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_room_join"("uuid" "uuid", "new_reply" "text") TO "service_role";
























GRANT ALL ON TABLE "public"."shared_state" TO "anon";
GRANT ALL ON TABLE "public"."shared_state" TO "authenticated";
GRANT ALL ON TABLE "public"."shared_state" TO "service_role";



GRANT ALL ON TABLE "public"."sync_room" TO "anon";
GRANT ALL ON TABLE "public"."sync_room" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_room" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
