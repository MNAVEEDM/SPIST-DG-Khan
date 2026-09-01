import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { supabase, smsSchoolCode } from '../supabase.js';

/**
 * The institute's real course list, for the admission form's course selector.
 *
 * Public and unauthenticated: an applicant has to see what they can apply for
 * before they have an account. Safe to expose, because it comes from the
 * `public_courses_for_school` function in Smart-SMS, which is SECURITY DEFINER
 * and returns only presentational fields — no fees, seats or teacher.
 */
const router = Router();

/** A course list barely changes, and every applicant asks for the same one. */
const CACHE_TTL_MS = 5 * 60 * 1000;

let cache = null; // { at: number, courses: [] }

/** Flattens the RPC's row shape into what the form actually renders. */
function toCourse(row) {
  return {
    id: row.course_id,
    code: (row.course_code ?? '').toString().trim(),
    title: (row.course_title ?? '').toString().trim(),
    description: (row.course_description ?? '').toString().trim(),
    duration: (row.course_duration ?? '').toString().trim(),
    creditHours: row.credit_hours ?? null,
  };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
      return res.json({ courses: cache.courses, cached: true });
    }

    if (!supabase || !smsSchoolCode) {
      return res
        .status(503)
        .json({ message: 'The course list is not available right now.' });
    }

    const { data, error } = await supabase.rpc('public_courses_for_school', {
      p_school_code: smsSchoolCode,
    });

    if (error) {
      console.error('[courses] Lookup failed:', error.message);
      return res.status(502).json({ message: 'The course list could not be loaded.' });
    }

    // A row without an id or a title can't be offered as a choice, so it's
    // dropped rather than rendered as a blank option.
    const courses = (data ?? []).map(toCourse).filter((course) => course.id && course.title);

    cache = { at: Date.now(), courses };

    res.json({ courses, cached: false });
  }),
);

export default router;
