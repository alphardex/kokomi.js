import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "kokomi",
      file: "./build/kokomi.umd.js",
      format: "umd",
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      typescript(), // so Rollup can convert TypeScript to JavaScript
      terser(), // so Rollup can minify js code
    ],
  },
];
