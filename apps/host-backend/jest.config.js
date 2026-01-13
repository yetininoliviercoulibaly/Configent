/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        useESM: false,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@configent/sdk/(.*)$": "<rootDir>/../../../packages/sdk/src/$1",
    "^@configent/sdk$": "<rootDir>/../../../packages/sdk/src/index.ts",
    "^@configent/sandbox/(.*)$": "<rootDir>/../../../packages/sandbox/src/$1",
    "^@configent/sandbox$": "<rootDir>/../../../packages/sandbox/src/index.ts",
  },
  collectCoverageFrom: ["**/*.(t|j)s", "!**/*.spec.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};

module.exports = config;

