import type {
    BunPlugin,
    OnLoadArgs,
    OnLoadResult,
    PluginBuilder,
} from "bun";
import ts from "typescript";
import { transform } from "typia/lib/transform";
import { resolve } from "node:path";

type TypiaResult = { [filePath: string]: string };

const pluginName = "bun-plugin-typia";

const getTestFiles = () => {

    const testFilePatterns = "{.test.{js,jsx,ts,tsx},_test.{js,jsx,ts,tsx},.spec.{js,jsx,ts,tsx},_spec.{js,jsx,ts,tsx}}"
    const files = []

    for (const file of new Bun.Glob(
        `**/*${testFilePatterns}`,
    ).scanSync({ absolute: true, onlyFiles: true })) {

        if (!file.includes('node_modules'))
            files.push(file)

    }

    return files
}

const typiaPlugin = (options?: {
    verbose?: true;
    disableLoader?: true;
}): BunPlugin & {
    results: TypiaResult;
    onLoadCallback: typeof onLoadCallback;
} => {

    const results: TypiaResult = {};

    const onLoadCallback: (
        build: PluginBuilder,
        args: OnLoadArgs,
    ) => OnLoadResult | Promise<OnLoadResult> = async (_, { path }) => {
        return {
            contents: results[path] ?? (await Bun.file(path).text()),
        };
    };

    return {
        name: pluginName,
        setup(build) {
            if (options?.verbose) {
                console.log(`${pluginName}: Generating...`);
            }

            const { options: compilerOptions } = ts.parseJsonConfigFileContent(
                ts.readConfigFile(`${process.cwd()}/tsconfig.json`, ts.sys.readFile)
                    .config,
                {
                    fileExists: ts.sys.fileExists,
                    readFile: ts.sys.readFile,
                    readDirectory: ts.sys.readDirectory,
                    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
                },
                process.cwd(),
            );

            const files =
                process.env.NODE_ENV === "test"
                    ? getTestFiles()
                    : build.config?.entrypoints
                        ? build.config.entrypoints.map((entrypoint) => resolve(entrypoint))
                        : [Bun.main];

            const program: ts.Program = ts.createProgram(files, compilerOptions);

            const result: ts.TransformationResult<ts.SourceFile> = ts.transform(

                program.getSourceFiles().filter((file) => {
                    return (
                        !file.isDeclarationFile &&
                        resolve(file.fileName).indexOf(process.cwd()) !== -1
                    );
                }),
                [
                    transform(
                        program,
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        ((compilerOptions.plugins as any[]) ?? []).find(
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (p: any) => p.transform === "typia/lib/transform",
                        ) ?? {},
                        {
                            addDiagnostic: () => 0,
                        },
                    ),
                ],
                program.getCompilerOptions(),
            );

            const printer: ts.Printer = ts.createPrinter({
                newLine: ts.NewLineKind.LineFeed,
            });

            for (const file of result.transformed) {
                const content: string = printer.printFile(file);
                results[resolve(file.fileName)] = content;
            }

            if (!options?.disableLoader)
                build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) =>
                    onLoadCallback(build, args),
                );

            if (options?.verbose) {
                // biome-ignore lint/complexity/noForEach: <explanation>
                Object.keys(results).forEach((filePath) => {
                    console.log(`${pluginName}: ${filePath}`);
                });
                console.log(`${pluginName}: Done`);
            }
        },
        onLoadCallback,
        results,
    };
};

export default typiaPlugin;
