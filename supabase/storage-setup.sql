-- Run this in the Supabase SQL editor after the main schema from CONTEXT.md
-- Creates the storage bucket for plant cover images.

insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', true)
on conflict (id) do nothing;

-- Authenticated users can upload into their own folder: {user_id}/filename
create policy "plant_images_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'plant-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update/delete their own uploads
create policy "plant_images_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'plant-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "plant_images_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'plant-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read (bucket is public; cover images are shown in the app)
create policy "plant_images_select_public"
on storage.objects for select
to public
using (bucket_id = 'plant-images');
