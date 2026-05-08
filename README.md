# FastListing

FastListing is a Next.js 16 app for generating branded real-estate listing videos in both 16:9 and 9:16 using Prisma, S3, Stripe, NextAuth, and Remotion Lambda.

## 1) Install

```bash
npm ci
```

## 2) Local development

1. Copy envs:
   ```bash
   cp .env.example .env
   ```
2. Fill all required values in `.env`.
3. Start dev server:
   ```bash
   npm run dev
   ```

## 3) Prisma migration

Use a Postgres database and run:

```bash
npx prisma migrate dev
npx prisma generate
```

## 4) S3 setup

- Create an S3 bucket for uploads and rendered assets.
- Set `S3_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.
- Set `NEXT_PUBLIC_S3_BUCKET` and `NEXT_PUBLIC_S3_REGION` for client asset URLs.
- Ensure IAM policy allows read/write for the configured bucket.

## 5) Stripe webhook setup

- Create two recurring prices in Stripe (Starter and Pro).
- Set `STRIPE_STARTER_PRICE_ID` and `STRIPE_PRO_PRICE_ID`.
- Set `STRIPE_SECRET_KEY`.
- Run Stripe CLI locally and forward webhooks:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
- Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## 6) Remotion Lambda setup

- Deploy/configure Remotion Lambda function and site bundle.
- Set:
  - `REMOTION_SERVE_URL`
  - `REMOTION_FUNCTION_NAME`
- Verify Lambda can access your S3 bucket for outputs.

## 7) Vercel deployment

- Import this repository in Vercel.
- Add all variables from `.env.example` in Vercel Project Settings.
- Use a production Postgres database.
- Redeploy after schema/env changes.

## 8) Launch QA checklist

- [ ] Login works with Google OAuth
- [ ] Photo upload only accepts jpeg/png/webp
- [ ] Upload/proxy routes reject cross-project access
- [ ] Render starts and produces both 16:9 + 9:16 outputs
- [ ] Render status endpoint requires auth and project ownership
- [ ] Starter/Pro checkout starts with correct server-side price mapping
- [ ] Stripe webhook updates user subscription state
- [ ] Homepage demo cards gracefully fallback when local demo files are absent
