import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_profiles",
  title: "List Profiles",
  description: "List all user profiles in the system.",
  inputSchema: {
    limit: z.number().optional().default(10).describe("Limit the number of profiles returned."),
  },
  annotations: { readOnlyHint: true },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, instruments")
      .limit(limit);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { profiles: data }
    };
  },
});
