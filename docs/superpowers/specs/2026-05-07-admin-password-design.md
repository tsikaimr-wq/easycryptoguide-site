# Admin Password Rotation Design

## Goal

Update the admin portal login password to `beibei12345` while keeping the username as `admin`.

## Current State

- `admin_login.html` reads Firestore document `admin_settings/credentials` for the active admin username and password.
- If the Firestore document is missing, the page initializes it with hardcoded defaults.
- `admin.html` uses the same document when validating the current password during password changes.
- Production Firestore currently stores:
  - `username: admin`
  - `password: admin12345`

## Chosen Approach

Apply the password change in both places:

1. Update the hardcoded fallback/default password in the admin login and admin settings pages to `beibei12345`.
2. Update the live Firestore document `admin_settings/credentials` so the running site immediately uses the new password.

## Why This Approach

- Changing only the code would not affect the live password while the Firestore document exists.
- Changing only Firestore would leave an outdated fallback that could recreate the old password if the document were ever missing.
- Updating both keeps runtime behavior and recovery behavior aligned.

## Verification

- Read back the Firestore document after the update and confirm `password: beibei12345`.
- Confirm the two HTML files now use `beibei12345` as the fallback/default password.
