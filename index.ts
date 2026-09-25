import type { BunPlugin } from "bun";
import ttsc from "@ttsc/unplugin/bun";
import type { TtscUnpluginOptions } from "@ttsc/unplugin/api";

export type TypiaPluginOptions = TtscUnpluginOptions;

const pluginName = "bun-plugin-typia";

const typiaPlugin = (options?: TypiaPluginOptions): BunPlugin => ({
    ...(ttsc(options) as unknown as BunPlugin),
    name: pluginName,
});

export default typiaPlugin;
