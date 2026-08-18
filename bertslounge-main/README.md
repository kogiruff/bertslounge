# Bert's Lounge

This is a static portfolio site with a commission page. An authorised admin can sign in with Google and switch commissions **open** or **closed**. The public website reads that setting from Supabase.

You do **not** need to configure Supabase's “OAuth Server” screen. This project uses Google for admin sign-in and uses Supabase only to store the commission status.

## What you need before starting

Create free accounts for these services:

- [Supabase](https://supabase.com/dashboard) — stores the open/closed setting.
- [Google Cloud Console](https://console.cloud.google.com/) — creates the Google sign-in ID.
- [Vercel](https://vercel.com/dashboard) — deploys the website and keeps secrets safe.

You also need the email address that should be allowed to use the admin page, for example `yourname@gmail.com`.

## How it works

```text
Visitor → Commission page → Vercel API → Supabase (open / closed)

Admin → /admin → Google sign-in → Vercel API → Supabase (changes open / closed)
```

The browser never receives the Supabase service-role key. Keep that key private.

## Step 1 — Create the Supabase database

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and select **New project**.
2. Choose a project name, database password, and region, then wait for the project to finish creating.
3. In the left sidebar, select **SQL Editor** → **New query**.
4. Open [`supabase/schema.sql`](supabase/schema.sql) in this project. Copy the SQL *inside* the file, paste it into Supabase, then choose **Run**.
   - Do not type `supabase/schema.sql` into the SQL editor; that is a filename, not SQL.
5. Go to **Project Settings** → **API**. Keep this tab open; you will need the Project URL and a server-side key in Step 3.

The query creates a `commission_config` table and starts commissions as closed.

## Step 2 — Create Google sign-in credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Open **APIs & Services** → **OAuth consent screen**. Complete the required app name and support email fields.
   - If the app is in **Testing** mode, add your admin email under **Test users**.
3. Open [Credentials](https://console.cloud.google.com/apis/credentials) → **Create credentials** → **OAuth client ID**.
4. Choose **Web application**.
5. Under **Authorized JavaScript origins**, add each address where you will open the site:

   - `https://your-project.vercel.app`
   - Your custom domain, if you use one, for example `https://bertslounge.com`
   - `http://localhost:3000` only if you run the site locally.

   Use the origin only: no page path, `/admin`, trailing slash, or query string.
6. Click **Create** and copy the **Client ID**. It ends in `.apps.googleusercontent.com`.

> Do not create a “Desktop app” client. The admin page needs a **Web application** client.

## Step 3 — Add Vercel environment variables

1. Import this repository into [Vercel](https://vercel.com/new), or create a Vercel project and upload/connect the repository.
2. In the Vercel project, open **Settings** → **Environment Variables**.
3. Add all four variables below. Select at least the **Production** environment. Use the same values for Preview if you want preview deployments to work too.

| Variable | Value | Where to find it |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth Web Client ID | Google Cloud Console → Credentials |
| `ALLOWED_ADMIN_EMAILS` | Your allowed email(s), separated by commas | Example: `you@gmail.com,helper@gmail.com` |
| `SUPABASE_URL` | Your Supabase Project URL | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side service-role key | Supabase → Project Settings → API |

Copy the variable names exactly. Do not add quotation marks around values.

### Important: protect the service-role key

`SUPABASE_SERVICE_ROLE_KEY` has full database access. Only put it in Vercel environment variables. Never put it in an HTML, CSS, JavaScript, or `.env` file that you upload to GitHub or share with others.

The provided [`.env.example`](.env.example) is only a template. It contains fake placeholder values and is safe to commit.

## Step 4 — Deploy and test

1. In Vercel, open the **Deployments** tab and deploy the project.
2. Open your deployed site and go to:

   ```text
   https://your-project.vercel.app/admin
   ```

3. Sign in with an email listed in `ALLOWED_ADMIN_EMAILS`.
4. Change the commission toggle and click **Save status**.
5. Open `/comms.html` in a new private/incognito browser window. Confirm that the site shows the same open or closed state.

When you change a Vercel environment variable, redeploy the site for the new value to be used.

## Day-to-day use

To open or close commissions later:

1. Visit `https://your-project.vercel.app/admin`.
2. Sign in with your allowed Google account.
3. Switch the toggle.
4. Click **Save status**.

The public commission page will use the new status as soon as it next checks the API.

## Troubleshooting

### “Google sign-in is not configured”

`GOOGLE_CLIENT_ID` is missing from Vercel, or the deployment has not been redeployed after adding it.

### “This Google account is not allowed”

Add that exact email address to `ALLOWED_ADMIN_EMAILS`, then redeploy. If Google is in Testing mode, also add the address as a test user in the OAuth consent screen.

### Google shows an origin / redirect error

Check the **Authorized JavaScript origins** in your Google OAuth Web Client. The exact site origin must be present, such as `https://your-project.vercel.app`. Do not use the Supabase OAuth Server page for this project.

### “Commission status is temporarily unavailable”

Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct in Vercel. Also make sure the SQL in [`supabase/schema.sql`](supabase/schema.sql) was run successfully. The site intentionally treats an unavailable status as closed.

### I accidentally exposed my service-role key

In Supabase, rotate the key immediately, update `SUPABASE_SERVICE_ROLE_KEY` in Vercel, and redeploy. Treat the old key as compromised.

## Project structure

```text
api/                  Vercel serverless API routes
api/_lib/             Shared auth, Supabase, and HTTP helpers
api/admin/            Admin configuration, verification, and status update routes
supabase/schema.sql   Database setup script
admin.html            Admin interface
comms.html            Public commission page
```

## Security notes

- Google credentials are validated on the server, including the issuer, intended client ID, verified email, and email allowlist.
- Visitors can read the status but cannot change it.
- The app fails closed: if Supabase cannot be reached, commissions are shown as closed.
