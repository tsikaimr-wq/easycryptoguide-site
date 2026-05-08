# Frontend Maintenance Mode Design

## Goal

Temporarily block public frontend access to EasyCrypto and show a single maintenance notice page, while keeping admin pages available.

## Scope

- Block all user-facing HTML entry pages.
- Keep `admin.html`, `admin_login.html`, and `support_admin.html` available.
- Show the exact maintenance notice provided by the user.
- Make recovery simple by centralizing the redirect behavior.

## Chosen Approach

1. Add a dedicated `maintenance.html` page that contains the maintenance notice.
2. Add a small shared guard script `js/maintenance-guard.js`.
3. Include the guard script in all public frontend HTML pages so they immediately redirect to `maintenance.html`.
4. Exclude admin pages from the redirect.

## Why This Approach

- One maintenance page keeps the message consistent.
- One shared guard makes rollback easy.
- Admin pages remain accessible for operations during the maintenance window.

## Verification

- Public pages should redirect to `maintenance.html`.
- `maintenance.html` should render the provided notice.
- Admin pages should remain reachable and should not redirect.
