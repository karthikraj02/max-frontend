# ProTech Frontend

## Required environment variables

Create `/home/runner/work/max-frontend/max-frontend/max-frontend-main/.env` for local development, and configure the same values in your hosting provider for production:

```bash
REACT_APP_API_URL=https://<your-backend-domain>
REACT_APP_RAZORPAY_KEY_ID=<your-razorpay-public-key>
```

Notes:
- `REACT_APP_API_URL` can be provided with or without `/api`; the app normalizes it automatically.
- If `REACT_APP_API_URL` is missing, the app falls back to:
  - `http://localhost:5000/api` on localhost
  - `/api` on deployed environments

## Deployment verification

After deploy, verify:
1. Open the browser devtools Network tab and confirm product/auth requests go to `<backend>/api/...` (or `/api/...` if using a reverse proxy).
2. Visit product listing and product detail pages and confirm data loads.
3. Attempt login/register and ensure API calls return 2xx/4xx responses (not network errors).
4. Trigger checkout order creation and verify `POST /api/payment/create-order` succeeds.

## Rollback-safe note

If deployment still fails, set `REACT_APP_API_URL` explicitly to the known working backend domain and redeploy only frontend config (no schema/data rollback needed).
