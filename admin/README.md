# BELORYA Admin — Setup guide

The admin dashboard is a static app that talks to **Supabase** (Postgres database + Auth + Storage).
You create the free Supabase project once; everything else is already coded.

Security model: the storefront and admin use the **anon (public) key** — this is safe because the
database enforces **Row Level Security**. The public can only *read* products/settings and *create*
orders; only signed-in **admins** can manage data.

---

## 1. Create the Supabase project (5 min)

1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. Choose a name (e.g. `belorya`), a strong database password, and a region close to Morocco (e.g. `West EU`).
3. Wait ~2 min for it to provision.

## 2. Create the database

1. In the project, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](../supabase/schema.sql) and click **Run**.
3. New query again → paste [`supabase/seed-products.sql`](../supabase/seed-products.sql) → **Run**.
   (This loads the current 16 products, categories, filters, the `BELORYA10` promo, and default settings.)

## 3. Create the image storage bucket

1. Open **Storage → New bucket**.
2. Name it exactly **`media`**, set it to **Public**, and create it.
   (Product/homepage images will be uploaded here from the admin.)

## 4. Create your admin login

1. Open **Authentication → Users → Add user** → enter your email + a password → create.
   (Disable "Auto-confirm" is not needed; a manually added user is confirmed.)
2. Copy that user's **UID** (from the users list).
3. Open **SQL Editor → New query** and run — replacing the two values:

   ```sql
   insert into admins (user_id, email)
   values ('PASTE-USER-UID-HERE', 'you@example.com');
   ```

   Only users listed in the `admins` table can sign in to the dashboard.

## 5. Connect the admin + storefront

1. Open **Project Settings → API** and copy:
   - **Project URL**
   - **anon / public** key
2. Paste them into [`admin/config.js`](config.js):

   ```js
   window.BELORYA_SUPABASE = {
     url: 'https://xxxx.supabase.co',
     anonKey: 'eyJ...'   // the anon/public key (NOT service_role)
   };
   ```

   > The same values are read by the storefront (via `js/store-data.js`) so the site pulls
   > products/settings from the database. Until this is filled in, the storefront keeps using
   > its built-in data and the admin shows a "Configuration requise" screen — nothing breaks.

3. Commit & push. Done.

## 6. Log in

Open **`/admin/login.html`** on the live site, sign in with the email/password from step 4.

---

## Adding more admins later

Repeat step 4 for each new person (add an Auth user, then insert their UID into `admins`).

## Notes
- Never put the **service_role** key anywhere in the website — it bypasses all security.
- `supabase/gen-seed.cjs` regenerates `seed-products.sql` from `js/products.js` if you ever
  need to re-import the original catalogue: `node supabase/gen-seed.cjs > supabase/seed-products.sql`.
