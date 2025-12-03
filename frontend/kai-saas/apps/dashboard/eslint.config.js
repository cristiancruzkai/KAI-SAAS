import { root } from "@repo/eslint-config/base";

export default [
  ...root,
  {
    ignores: [".next/**"],
  },
];
