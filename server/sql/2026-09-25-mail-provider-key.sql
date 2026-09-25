-- Hands the admissions API the Brevo credentials that already live in this
-- project's Vault, so the key does not have to be duplicated into the API's
-- own environment.
--
-- Why this exists: Render's free instances block outbound SMTP, so the API
-- has to send through Brevo's HTTPS API instead - and the Render service was
-- created under an account we can no longer sign in to, which makes adding
-- BREVO_API_KEY there impossible. The API does still hold
-- SUPABASE_SERVICE_ROLE_KEY, so it can ask for the key here instead. The same
-- secret then serves both the portal's admission-decision mail and the
-- website's verification and reset codes, and rotating it stays a one-line
-- Vault update rather than a change in two places.
--
-- SECURITY DEFINER because vault.decrypted_secrets is readable only by the
-- owner; the grants below are what keep that from leaking. Execute is revoked
-- from anon and authenticated, so a browser holding the publishable key gets
-- a permission error, not a credential. Only service_role - which never
-- reaches the browser - may call it.
--
-- Safe to re-run.

create or replace function public.mail_provider_key()
returns jsonb
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_key  text;
  v_from text;
begin
  select decrypted_secret into v_key
    from vault.decrypted_secrets where name = 'brevo_api_key' limit 1;

  select decrypted_secret into v_from
    from vault.decrypted_secrets where name = 'admission_from_email' limit 1;

  return jsonb_build_object('brevoApiKey', v_key, 'fromEmail', v_from);
end;
$$;

revoke all on function public.mail_provider_key() from public;
revoke all on function public.mail_provider_key() from anon;
revoke all on function public.mail_provider_key() from authenticated;
grant execute on function public.mail_provider_key() to service_role;

comment on function public.mail_provider_key() is
  'Returns the Brevo key and sender address from Vault for the admissions API. '
  'service_role only - never callable from a browser.';
