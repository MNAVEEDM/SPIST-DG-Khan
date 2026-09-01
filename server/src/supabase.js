import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client for writing admission applications into the Smart-SMS
 * Supabase project. This key bypasses RLS, so it must never reach the browser.
 *
 * Everything stays null when the integration isn't configured, so a missing
 * key simply disables the sync instead of crashing the admissions API.
 */
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const smsSchoolId = process.env.SMS_SCHOOL_ID || null;
export const smsCampusId = process.env.SMS_CAMPUS_ID || null;
export const smsSchoolCode = process.env.SMS_SCHOOL_CODE || null;

export const isSmsConfigured = Boolean(url && key && smsSchoolId);

export const supabase = isSmsConfigured
  ? createClient(url, key, { auth: { persistSession: false } })
  : null;

if (!isSmsConfigured) {
  console.warn('[sms] Supabase sync disabled — SUPABASE_URL / SERVICE_ROLE_KEY / SMS_SCHOOL_ID missing');
}