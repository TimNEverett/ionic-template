set check_function_bodies = off;

CREATE OR REPLACE FUNCTION vault.api_config()
 RETURNS TABLE(anon text, supabase_url text, service_role text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    missing_configs TEXT[];
BEGIN
    SELECT 
        (SELECT * from vault.get_anon()),
        (SELECT * from vault.get_supabase_url()),
        (SELECT * from vault.get_service_role())
    INTO anon, supabase_url, service_role;

    missing_configs := ARRAY[]::TEXT[];
    
    IF anon IS NULL THEN
        missing_configs := array_append(missing_configs, 'anon');
    END IF;
    
    IF supabase_url IS NULL THEN
        missing_configs := array_append(missing_configs, 'supabase_url');
    END IF;
    
    IF service_role IS NULL THEN
        missing_configs := array_append(missing_configs, 'service_role');
    END IF;

    IF array_length(missing_configs, 1) > 0 THEN
        RAISE EXCEPTION 'API configurations for % are not defined', array_to_string(missing_configs, ', ');
    END IF;

    RETURN NEXT;
END;
$function$
;

CREATE OR REPLACE FUNCTION vault.get_anon(bearer boolean DEFAULT false)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF bearer THEN
        RETURN 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon');
    ELSE
        RETURN (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon');
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION vault.get_service_role(bearer boolean DEFAULT false)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF bearer THEN
        RETURN 'Bearer ' || (SELECT decrypted_secret
                             FROM vault.decrypted_secrets
                             WHERE name = 'service_role');    
    ELSE
        RETURN (SELECT decrypted_secret
                FROM vault.decrypted_secrets
                WHERE name = 'service_role');
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION vault.get_supabase_url()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (SELECT decrypted_secret 
            FROM vault.decrypted_secrets
            WHERE name = 'supabase_url');
END;
$function$
;


