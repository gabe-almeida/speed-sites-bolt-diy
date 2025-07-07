/**
 * Remix config for Node.js SSR deployment (Render, Docker, etc.)
 */
module.exports = {
  serverBuildTarget: "node-cjs",
  server: "./server.js",
  ignoredRouteFiles: ["**/.*"],
};