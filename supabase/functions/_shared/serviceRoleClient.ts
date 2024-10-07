import { createClient } from "jsr:@supabase/supabase-js@2";
import { Database } from "./database.types.ts";
export const serviceRoleClient = createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
