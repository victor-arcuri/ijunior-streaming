import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  extensionsToTreatAsEsm: [".ts"],
  clearMocks: true,
  setupFilesAfterEnv: ['./config/singleton.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // strip .js so Jest resolves .ts instead
  },
};
