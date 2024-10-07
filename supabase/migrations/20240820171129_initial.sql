create table "public"."group_member" (
    "id" uuid not null default uuid_generate_v4(),
    "group_id" uuid not null,
    "user_id" uuid not null,
    "joined_at" timestamp with time zone not null default now(),
    "nickname" text
);


alter table "public"."group_member" enable row level security;

create table "public"."message" (
    "id" uuid not null default uuid_generate_v4(),
    "group_id" uuid not null,
    "sender_id" uuid not null default auth.uid(),
    "content" text not null,
    "sent_at" timestamp with time zone not null default now()
);


alter table "public"."message" enable row level security;

begin;
  -- remove the realtime publication
  drop publication if exists supabase_realtime;

  -- re-create the publication but don't enable it for any tables
  create publication supabase_realtime for table "public"."message";
commit;

create table "public"."message_group" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "created_at" timestamp with time zone not null default now(),
    "creator_id" uuid not null default auth.uid()
);


alter table "public"."message_group" enable row level security;

CREATE UNIQUE INDEX group_member_pkey ON public.group_member USING btree (id);

CREATE UNIQUE INDEX message_group_pkey ON public.message_group USING btree (id);

CREATE UNIQUE INDEX message_pkey ON public.message USING btree (id);

CREATE UNIQUE INDEX unique_nickname_group_id ON public.group_member USING btree (nickname, group_id);

alter table "public"."group_member" add constraint "group_member_pkey" PRIMARY KEY using index "group_member_pkey";

alter table "public"."message" add constraint "message_pkey" PRIMARY KEY using index "message_pkey";

alter table "public"."message_group" add constraint "message_group_pkey" PRIMARY KEY using index "message_group_pkey";

alter table "public"."group_member" add constraint "group_member_group_id_fkey" FOREIGN KEY (group_id) REFERENCES message_group(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."group_member" validate constraint "group_member_group_id_fkey";

alter table "public"."group_member" add constraint "group_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."group_member" validate constraint "group_member_user_id_fkey";

alter table "public"."group_member" add constraint "unique_nickname_group_id" UNIQUE using index "unique_nickname_group_id";

alter table "public"."message" add constraint "message_group_id_fkey" FOREIGN KEY (group_id) REFERENCES message_group(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message" validate constraint "message_group_id_fkey";

alter table "public"."message" add constraint "message_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message" validate constraint "message_sender_id_fkey";

alter table "public"."message_group" add constraint "message_group_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."message_group" validate constraint "message_group_creator_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_creator_as_member()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO group_member (group_id, user_id, joined_at)
    VALUES (NEW.id, NEW.creator_id, NOW());
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_group_creator(_group_id uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
SELECT EXISTS (
    SELECT 1
    FROM group_member
    WHERE user_id = auth.uid() AND group_id = _group_id
);
$function$
;

CREATE OR REPLACE FUNCTION public.is_group_member(_group_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM group_member
        WHERE group_member.user_id = auth.uid() AND group_member.group_id = _group_id
    );
END;
$function$
;

grant delete on table "public"."group_member" to "anon";

grant insert on table "public"."group_member" to "anon";

grant references on table "public"."group_member" to "anon";

grant select on table "public"."group_member" to "anon";

grant trigger on table "public"."group_member" to "anon";

grant truncate on table "public"."group_member" to "anon";

grant update on table "public"."group_member" to "anon";

grant delete on table "public"."group_member" to "authenticated";

grant insert on table "public"."group_member" to "authenticated";

grant references on table "public"."group_member" to "authenticated";

grant select on table "public"."group_member" to "authenticated";

grant trigger on table "public"."group_member" to "authenticated";

grant truncate on table "public"."group_member" to "authenticated";

grant update on table "public"."group_member" to "authenticated";

grant delete on table "public"."group_member" to "service_role";

grant insert on table "public"."group_member" to "service_role";

grant references on table "public"."group_member" to "service_role";

grant select on table "public"."group_member" to "service_role";

grant trigger on table "public"."group_member" to "service_role";

grant truncate on table "public"."group_member" to "service_role";

grant update on table "public"."group_member" to "service_role";

grant delete on table "public"."message" to "anon";

grant insert on table "public"."message" to "anon";

grant references on table "public"."message" to "anon";

grant select on table "public"."message" to "anon";

grant trigger on table "public"."message" to "anon";

grant truncate on table "public"."message" to "anon";

grant update on table "public"."message" to "anon";

grant delete on table "public"."message" to "authenticated";

grant insert on table "public"."message" to "authenticated";

grant references on table "public"."message" to "authenticated";

grant select on table "public"."message" to "authenticated";

grant trigger on table "public"."message" to "authenticated";

grant truncate on table "public"."message" to "authenticated";

grant update on table "public"."message" to "authenticated";

grant delete on table "public"."message" to "service_role";

grant insert on table "public"."message" to "service_role";

grant references on table "public"."message" to "service_role";

grant select on table "public"."message" to "service_role";

grant trigger on table "public"."message" to "service_role";

grant truncate on table "public"."message" to "service_role";

grant update on table "public"."message" to "service_role";

grant delete on table "public"."message_group" to "anon";

grant insert on table "public"."message_group" to "anon";

grant references on table "public"."message_group" to "anon";

grant select on table "public"."message_group" to "anon";

grant trigger on table "public"."message_group" to "anon";

grant truncate on table "public"."message_group" to "anon";

grant update on table "public"."message_group" to "anon";

grant delete on table "public"."message_group" to "authenticated";

grant insert on table "public"."message_group" to "authenticated";

grant references on table "public"."message_group" to "authenticated";

grant select on table "public"."message_group" to "authenticated";

grant trigger on table "public"."message_group" to "authenticated";

grant truncate on table "public"."message_group" to "authenticated";

grant update on table "public"."message_group" to "authenticated";

grant delete on table "public"."message_group" to "service_role";

grant insert on table "public"."message_group" to "service_role";

grant references on table "public"."message_group" to "service_role";

grant select on table "public"."message_group" to "service_role";

grant trigger on table "public"."message_group" to "service_role";

grant truncate on table "public"."message_group" to "service_role";

grant update on table "public"."message_group" to "service_role";

create policy "Group creator can add members"
on "public"."group_member"
as permissive
for insert
to authenticated
with check ((user_id = ( SELECT auth.uid() AS uid)));


create policy "select_group_members_in_own_groups"
on "public"."group_member"
as permissive
for select
to authenticated
using (is_group_member(group_id));


create policy "select_messages_in_own_groups"
on "public"."message"
as permissive
for select
to authenticated
using (is_group_member(group_id));


create policy "send_message_policy"
on "public"."message"
as permissive
for insert
to authenticated
with check (((sender_id = auth.uid()) AND is_group_member(group_id)));


create policy "create_group_policy"
on "public"."message_group"
as permissive
for insert
to authenticated
with check ((creator_id = auth.uid()));


create policy "select_own_groups"
on "public"."message_group"
as permissive
for select
to authenticated
using (((creator_id = auth.uid()) OR is_group_member(id)));


CREATE TRIGGER add_creator_to_group_members AFTER INSERT ON public.message_group FOR EACH ROW EXECUTE FUNCTION add_creator_as_member();


