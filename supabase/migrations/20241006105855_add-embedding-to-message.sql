create extension vector
with
  schema extensions;
  
alter table "public"."message" add column "embedding" vector(384);

create policy "Group members can edit nicknames of other group members"
on "public"."group_member"
as permissive
for update
to authenticated
using (is_group_member(group_id))
with check (is_group_member(group_id));



