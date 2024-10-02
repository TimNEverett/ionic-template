CREATE OR REPLACE FUNCTION public.generate_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
begin
    return substring(md5(random()::text), 1, 6);
end;
$function$
;

create table "public"."group_invite" (
    "id" uuid not null default gen_random_uuid(),
    "invite_code" text not null default generate_code(),
    "group_id" uuid not null,
    "created_by" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "email" text,
    "expires_at" timestamp with time zone
);


alter table "public"."group_invite" enable row level security;

CREATE UNIQUE INDEX group_invite_pkey ON public.group_invite USING btree (id);

CREATE UNIQUE INDEX unique_invite_code ON public.group_invite USING btree (invite_code);

alter table "public"."group_invite" add constraint "group_invite_pkey" PRIMARY KEY using index "group_invite_pkey";

alter table "public"."group_invite" add constraint "check_expires_at" CHECK ((expires_at > now())) not valid;

alter table "public"."group_invite" validate constraint "check_expires_at";

alter table "public"."group_invite" add constraint "group_invite_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."group_invite" validate constraint "group_invite_created_by_fkey";

alter table "public"."group_invite" add constraint "group_invite_group_id_fkey" FOREIGN KEY (group_id) REFERENCES message_group(id) not valid;

alter table "public"."group_invite" validate constraint "group_invite_group_id_fkey";

alter table "public"."group_invite" add constraint "unique_invite_code" UNIQUE using index "unique_invite_code";

alter table "public"."group_invite" add constraint "valid_email" CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'::text)) not valid;

alter table "public"."group_invite" validate constraint "valid_email";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.claim_invite(_auth_code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$ 
DECLARE 
    _group_id uuid; 
    _user_id uuid;
BEGIN 
    IF auth.role() = 'authenticated' THEN 
    select * from auth.uid() into _user_id;
    BEGIN 
        SELECT group_id INTO _group_id 
        FROM group_invite 
        WHERE invite_code = _auth_code; 

        IF _group_id is null  THEN 
            RAISE EXCEPTION 'Invite code not found'; 
        ELSE 
            INSERT INTO group_member (group_id, user_id) 
            VALUES (_group_id, _user_id); 
        END IF; 
    END; 
    ELSE 
        RAISE EXCEPTION 'Current user is not authorized to claim invite'; 
    END IF; 
END; 
$function$
;


grant delete on table "public"."group_invite" to "anon";

grant insert on table "public"."group_invite" to "anon";

grant references on table "public"."group_invite" to "anon";

grant select on table "public"."group_invite" to "anon";

grant trigger on table "public"."group_invite" to "anon";

grant truncate on table "public"."group_invite" to "anon";

grant update on table "public"."group_invite" to "anon";

grant delete on table "public"."group_invite" to "authenticated";

grant insert on table "public"."group_invite" to "authenticated";

grant references on table "public"."group_invite" to "authenticated";

grant select on table "public"."group_invite" to "authenticated";

grant trigger on table "public"."group_invite" to "authenticated";

grant truncate on table "public"."group_invite" to "authenticated";

grant update on table "public"."group_invite" to "authenticated";

grant delete on table "public"."group_invite" to "service_role";

grant insert on table "public"."group_invite" to "service_role";

grant references on table "public"."group_invite" to "service_role";

grant select on table "public"."group_invite" to "service_role";

grant trigger on table "public"."group_invite" to "service_role";

grant truncate on table "public"."group_invite" to "service_role";

grant update on table "public"."group_invite" to "service_role";

create policy "Group members can create invites"
on "public"."group_invite"
as permissive
for insert
to public
with check ((is_group_member(group_id) AND (created_by = ( SELECT uid.uid
   FROM auth.uid() uid(uid)))));


create policy "group members can select invites"
on "public"."group_invite"
as permissive
for select
to authenticated
using (is_group_member(group_id));



