# Aura Fit Netlify Deploy

- Upload the contents of this folder to Netlify.
- Build command: leave blank.
- Publish directory: `.`
- The site is static and keeps local demo account data in the browser.
- Admin Panel is available to admin-role accounts from Account → top-right Admin Panel.
- Admin PIN: `7128`.
- Profile photo uploads are cropped locally in the browser and stored with the local account.
- Backend/database note: this ZIP contains the static frontend only. The API client connects to a backend only when `AURA_API_URL` is configured (or when the site is served locally on port 5000). No Flask/Supabase server code or live backend credentials are bundled in this ZIP.
- Profile photos are cropped locally. The original crop source is now retained as `photoSource` so reopening Edit profile can re-crop the saved image without being limited to the previously exported 512×512 crop.
