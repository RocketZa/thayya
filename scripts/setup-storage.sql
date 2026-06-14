-- Storage buckets for Thayya uploads. Run once (idempotent).
-- audio:   instructor/admin-uploaded track files (public-read)
-- avatars: instructor portfolio photos (public-read)
-- Uploads happen server-side with the service-role key (bypasses RLS);
-- public=true makes the returned getPublicUrl() links downloadable by anyone.

insert into storage.buckets (id, name, public)
values ('audio', 'audio', true),
       ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;
