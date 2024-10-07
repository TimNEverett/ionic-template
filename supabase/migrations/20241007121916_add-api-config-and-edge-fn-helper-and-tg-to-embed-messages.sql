set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.message_embed_tg_fn()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if this is an INSERT or if the content has changed on UPDATE
    IF (TG_OP = 'INSERT') OR (OLD.content IS DISTINCT FROM NEW.content) THEN
        -- Call the edge function to generate and store the embedding
        PERFORM edge_functions.invoke_edge_function(
            'embed',
            jsonb_build_object(
                'input', NEW.content,
                'table_name', 'message',
                'table_id_column_name', 'id',
                'table_id', NEW.id,
                'embedding_column_name', 'embedding'
            ),
            true  -- Use service role for authentication
        );
    END IF;
    RETURN NEW;
END;
$function$
;


CREATE TRIGGER message_embed_tg AFTER INSERT OR UPDATE ON public.message FOR EACH ROW EXECUTE FUNCTION message_embed_tg_fn();


create schema if not exists "edge_functions";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION edge_functions.invoke_edge_function(function_name text, payload jsonb, is_service_role boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    anon_token TEXT;
    service_role_token TEXT;
    api_url TEXT;
    url TEXT;
    auth_header TEXT;
    request_id BIGINT;
BEGIN
    -- Get the API configuration
    SELECT anon, service_role, supabase_url 
    INTO anon_token, service_role_token, api_url 
    FROM vault.api_config() AS config;

    -- Construct the URL for the edge function
    url := api_url || '/functions/v1/' || function_name;

    -- Determine which auth token to use
    IF is_service_role THEN
        auth_header := 'Bearer ' || service_role_token;
    ELSE
        auth_header := 'Bearer ' || anon_token;
    END IF;

    -- Make the HTTP request using net.http_post
    SELECT net.http_post(
        url := url,
        body := payload,
        headers := jsonb_build_object(
            'Authorization', auth_header,
            'Content-Type', 'application/json'
        ),
        timeout_milliseconds := 10000  -- 10 seconds timeout
    ) INTO request_id;

    -- You can add error handling here if needed
    -- For example, checking the request_id or implementing a way to check the response

END;
$function$
;


