/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    [
      "@semantic-release/github",
      {
        assets: [
          { path: "build/index.es.js", label: "" },
          { path: "build/index.d.ts", label: "" },
          { path: "build/index.iife.js", label: "" },
          { path: "package.json", label: "" },
          { path: "README.md", label: "" },
          { path: "LICENSE", label: "" },
        ],
      },
    ],
  ],
};
