/*
* DB_BASE — prefix for any Store-stored, data-driven asset path so it
* resolves correctly whether the current page is dashboard/*.html (depth 0)
* or dashboard/pages/*.html (depth 1). Load this before any inline script
* that builds <img src> from Store/seed data.
*/
window.DB_BASE = /\/pages\//.test(window.location.pathname) ? "../" : "";
