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
const vercelNodeVersion = config.get("vercelNodeVersion");
const vercelBuildCommand = config.get("vercelBuildCommand") ?? "npm run build";
const vercelInstallCommand = config.get("vercelInstallCommand") ?? "npm ci";
const vercelManageProjectSettings = config.getBoolean("vercelManageProjectSettings") ?? false;
const vercelImportDatabaseUrlId = config.get("vercelImportDatabaseUrlId");

const isImporting = Boolean(vercelImportProjectId);

const projectArgs: vercel.ProjectArgs = {
  name: vercelProjectName,
};

if (!isImporting && vercelManageProjectSettings) {
  if (vercelTeamId) {
    projectArgs.teamId = vercelTeamId;
  }
  if (vercelFramework) {
    projectArgs.framework = vercelFramework;
  }
  if (vercelBuildCommand) {
    projectArgs.buildCommand = vercelBuildCommand;
  }
  if (vercelInstallCommand) {
    projectArgs.installCommand = vercelInstallCommand;
  }
  if (vercelNodeVersion) {
    projectArgs.nodeVersion = vercelNodeVersion;
  }
  if (vercelRootDirectory) {
    projectArgs.rootDirectory = vercelRootDirectory;
  }
}

const project = new vercel.Project(
  "project",
  projectArgs,
  vercelImportProjectId ? { import: vercelImportProjectId } : undefined
);

type DatabaseConfig = {
  databaseUrl: pulumi.Output<string>;
  directUrl?: pulumi.Output<string>;
};

const database: DatabaseConfig = dbProvider === "neon"
  ? createNeonDatabase()
  : createSupabaseDatabase();

const isProd = stack === "prod" || stack === "production";
const sensitiveTargets = isProd ? ["production"] : ["preview"];
const standardTargets = isProd ? ["production"] : ["preview", "development"];

new vercel.ProjectEnvironmentVariable(
  "database-url",
  {
  projectId: project.id,
  teamId: vercelTeamId,
  key: "DATABASE_URL",
  value: database.databaseUrl,
  targets: sensitiveTargets,
  sensitive: true,
  comment: "Managed by Pulumi",
  },
  vercelImportDatabaseUrlId ? { import: vercelImportDatabaseUrlId } : undefined
);

new vercel.ProjectEnvironmentVariable("node-env", {
  projectId: project.id,
  teamId: vercelTeamId,
  key: "NODE_ENV",
  value: stack === "prod" || stack === "production" ? "production" : "development",
  targets: standardTargets,
  comment: "Managed by Pulumi",
});

if (database.directUrl) {
  new vercel.ProjectEnvironmentVariable("direct-url", {
    projectId: project.id,
    teamId: vercelTeamId,
    key: "DIRECT_URL",
    value: database.directUrl,
    targets: sensitiveTargets,
    sensitive: true,
    comment: "Managed by Pulumi",
  });
}

function createSupabaseDatabase(): { databaseUrl: pulumi.Output<string>; directUrl?: pulumi.Output<string> } {
  const supabaseOrgId = config.require("supabaseOrganizationId");
  const supabaseRegion = config.get("supabaseRegion") ?? "us-east-1";
  const supabaseInstanceSize = config.get("supabaseInstanceSize");
  const supabaseDbPassword = config.requireSecret("supabaseDbPassword");
  const supabaseDirectUrl = config.getSecret("supabaseDirectUrl");
  const supabasePoolerUrl = config.getSecret("supabasePoolerUrl");

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

  const directUrl = supabaseDirectUrl
    ?? pulumi.interpolate`postgresql://postgres:${supabaseDbPassword}@db.${supabaseProject.id}.supabase.co:5432/postgres?sslmode=require`;

  const databaseUrl = supabasePoolerUrl ?? directUrl;

  return { databaseUrl, directUrl };
}

function createNeonDatabase(): DatabaseConfig {
  const neonOrgId = config.require("neonOrgId");
  const neonProjectName = config.get("neonProjectName") ?? `${appName}-${stack}`;
  const neonRegionId = config.get("neonRegionId");

  const neonProject = new neon.Project("neon-project", {
    orgId: neonOrgId,
    name: neonProjectName,
    regionId: neonRegionId,
  });

  return { databaseUrl: neonProject.connectionUri };
}

export const dbProviderSelected = dbProvider;
export const databaseUrlOutput = database.databaseUrl;
export const vercelProjectIdOutput = project.id;
