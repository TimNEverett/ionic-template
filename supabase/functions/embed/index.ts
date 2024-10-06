// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serviceRoleClient } from "../_shared/serviceRoleClient.ts";

const session = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  const authToken = authHeader?.split("Bearer ")[1];
  if (!authToken || authToken !== Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    return new Response(
      JSON.stringify({ success: false, error: "Not authorized" }),
      { headers: { "Content-Type": "application/json" }, status: 401 },
    );
  }
  try {
    const {
      input,
      table_name,
      table_id_column_name,
      table_id,
      embedding_column_name,
    } = await req.json();

    // Generate the embedding from the user input
    const embedding = await session.run(input, {
      mean_pool: true,
      normalize: true,
    });

    const { error } = await serviceRoleClient.from(table_name).update({
      [embedding_column_name]: embedding,
    }).eq(table_id_column_name, table_id);

    if (error) throw error;

    // Return the embedding
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" }, status: 201 },
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 400 },
    );
  }
});
