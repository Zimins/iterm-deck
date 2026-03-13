import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/plugin.ts",
  output: {
    file: "dev.lightsoft.iterm-deck.sdPlugin/bin/plugin.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    resolve({ exportConditions: ["node"], preferBuiltins: true }),
    commonjs(),
    typescript(),
  ],
};
