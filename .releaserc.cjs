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
        assets: ["build", "package.json", "README.md", "LICENSE"],
      },
    ],
  ],
};
