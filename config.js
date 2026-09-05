// js/config.js
//
// Fill these two values in from your Supabase project:
// Project Settings → API → Project URL / Publishable (anon) key.
//
// This is safe to commit and safe to ship to GitHub Pages: the
// publishable key is meant to sit in client code. It grants nothing by
// itself — every table is locked down with Row Level Security, and every
// operation that matters (rating, currency, PvP outcomes, quest
// rewards) only happens inside the SECURITY DEFINER functions in
// supabase/schema.sql. Never put a service_role / secret key here.

const SUPABASE_URL = 'https://qsxxyrxpzkyuwnupkesf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_f0hFhhelV4thfnuvQAhB_A_WOGelAko';

// Toggle verbose console logging for testSupabaseConnection() and the
// database/auth modules. Set to false before sharing the GitHub Pages
// link publicly.
const SUPABASE_DEBUG = true;
