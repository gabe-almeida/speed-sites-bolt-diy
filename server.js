const path = require("path");
const express = require("express");
const { createRequestHandler } = require("@remix-run/express");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

app.use(express.static("public"));

app.all(
  "*",
  createRequestHandler({
    build: require(path.join(BUILD_DIR, "server")),
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Remix SSR server listening on port ${port}`);
});