import { registerAs } from "@nestjs/config";

export default registerAs("workspace", () => ({
  rootPath: process.env.WORKSPACE_ROOT || "project-instances",
}));