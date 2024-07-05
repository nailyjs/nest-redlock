import naiup, { presetLib } from "@naiable/rollup-config";

export default naiup(
  presetLib({
    external: ["tslib"],
  }),
);
