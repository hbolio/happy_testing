# Infrastructure (Pulumi)

This folder manages Vercel + database infrastructure with Pulumi (TypeScript).

## Prerequisites
- Pulumi CLI (`brew install pulumi` or https://www.pulumi.com/docs/install/)
- Vercel account + token
- Supabase account + access token (default provider)
- Optional: Neon account + API key (alternative provider)

## Stacks
- `dev` -> preview environments
- `prod` -> production

## One-time bootstrap
1. Login to Pulumi:
   ```bash
   pulumi login
   ```
2. Create stacks:
   ```bash
   pulumi stack init dev
   pulumi stack init prod
   ```
3. Set shared config (non-secret):
   ```bash
   pulumi config set appName happy-testing
   pulumi config set vercelProjectId <VERCEL_PROJECT_ID>
   pulumi config set vercelTeamId <VERCEL_ORG_ID>
   ```
4. Supabase config (default provider):
   ```bash
   pulumi config set dbProvider supabase
   pulumi config set supabaseOrganizationId <SUPABASE_ORG_ID>
   pulumi config set supabaseRegion us-east-1
   pulumi config set supabaseInstanceSize micro
   pulumi config set --secret supabaseDbPassword <SUPABASE_DB_PASSWORD>
   ```
5. Optional Neon config (alternative provider):
   ```bash
   pulumi config set dbProvider neon
   pulumi config set neonOrgId <NEON_ORG_ID>
   pulumi config set neonRegionId <NEON_REGION_ID>
   ```
   If the Neon provider is missing locally, install it once:
   ```bash
   pulumi package add terraform-provider kislerdm/neon
   ```

## Running locally
```bash
cd infra
pulumi preview --stack dev
pulumi up --stack dev
```

## Outputs
- `databaseUrlOutput`: DB connection string (secret)
- `vercelProjectIdOutput`: Vercel project id

## Notes
- Supabase does not expose a full connection string in its Pulumi provider, so the stack builds
  `DATABASE_URL` from the project ref + db password.
- Vercel env vars are managed per stack: preview/development for `dev`, production for `prod`.
