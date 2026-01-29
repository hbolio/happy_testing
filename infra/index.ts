import * as pulumi from "@pulumi/pulumi";
import * as vercel from "@pulumiverse/vercel";
import * as supabase from "supabase";
import * as neon from "neon";

const config = new pulumi.Config();
const stack = pulumi.getStack();

const appName = config.get("appName") ?? "happy-testing";
const dbProvider = (config.get("dbProvider") ?? "supabase").toLowerCase();

const vercelProjectId = config.get("vercelProjectId") ?? process.env.VERCEL_PROJECT_ID;
const vercelImportProjectId = config.get("vercelImportProjectId");
const vercelTeamId = config.get("vercelTeamId") ?? process.env.VERCEL_ORG_ID;
const vercelProjectName = config.get("vercelProjectName") ?? `${appName}-${stack}`;
const vercelFramework = config.get("vercelFramework") ?? "nextjs";
const vercelRootDirectory = config.get("vercelRootDirectory");

const project = new vercel.Project(
  "project",
  {
    name: vercelProjectName,
    teamId: vercelTeamId,
    framework: vercelFramework,
    buildCommand: "npm run build",
    installCommand: "npm ci",
    nodeVersion: "20.x",
    rootDirectory: vercelRootDirectory,
  },
  vercelImportProjectId ? { import: vercelImportProjectId } : undefined
);

const databaseUrl = dbProvider === "neon" ? createNeonDatabase() : createSupabaseDatabase();

const isProd = stack === "prod" || stack === "production";
const sensitiveTargets = isProd ? ["production"] : ["preview"];
const standardTargets = isProd ? ["production"] : ["preview", "development"];

new vercel.ProjectEnvironmentVariable("database-url", {
  projectId: project.id,
  teamId: vercelTeamId,
  key: "DATABASE_URL",
  value: databaseUrl,
  targets: sensitiveTargets,
  sensitive: true,
  comment: "Managed by Pulumi",
});

new vercel.ProjectEnvironmentVariable("node-env", {
  projectId: project.id,
  teamId: vercelTeamId,
  key: "NODE_ENV",
  value: stack === "prod" || stack === "production" ? "production" : "development",
  targets: standardTargets,
  comment: "Managed by Pulumi",
});

function createSupabaseDatabase(): pulumi.Output<string> {
  const supabaseOrgId = config.require("supabaseOrganizationId");
  const supabaseRegion = config.get("supabaseRegion") ?? "us-east-1";
  const supabaseInstanceSize = config.get("supabaseInstanceSize");
  const supabaseDbPassword = config.requireSecret("supabaseDbPassword");

  const supabaseProjectArgs: supabase.ProjectArgs = {
    organizationId: supabaseOrgId,
    name: `${appName}-${stack}`,
    databasePassword: supabaseDbPassword,
    region: supabaseRegion,
  };

  if (supabaseInstanceSize) {
    supabaseProjectArgs.instanceSize = supabaseInstanceSize;
  }

  const supabaseProject = new supabase.Project("supabase-project", supabaseProjectArgs);

  return pulumi.interpolate`postgresql://postgres:${supabaseDbPassword}@db.${supabaseProject.id}.supabase.co:5432/postgres?sslmode=require`;
}

function createNeonDatabase(): pulumi.Output<string> {
  const neonOrgId = config.require("neonOrgId");
  const neonProjectName = config.get("neonProjectName") ?? `${appName}-${stack}`;
  const neonRegionId = config.get("neonRegionId");

  const neonProject = new neon.Project("neon-project", {
    orgId: neonOrgId,
    name: neonProjectName,
    regionId: neonRegionId,
  });

  return neonProject.connectionUri;
}

export const dbProviderSelected = dbProvider;
export const databaseUrlOutput = databaseUrl;
export const vercelProjectIdOutput = project.id;
