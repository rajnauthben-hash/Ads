import { config } from "@remotion/eslint-config-flat";

export default [
  // Node build scripts are not part of the Remotion browser bundle.
  { ignores: ["scripts/**"] },
  ...config,
];
