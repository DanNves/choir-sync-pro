import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProfilesTool from "./tools/list-profiles";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "choir-sync-pro",
  title: "Choir Sync Pro",
  version: "0.1.0",
  instructions: "Tools for Choir Sync Pro management system. Use `list_profiles` to view members.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProfilesTool],
});
