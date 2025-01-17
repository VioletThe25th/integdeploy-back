module.exports = {
    setupFiles: ['./.jest/setEnvVars.js'],
    collectCoverage: true, 
    coverageDirectory: "coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    testEnvironment: "node",
};