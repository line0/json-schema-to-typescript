#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const get_stdin_1 = __importDefault(require("get-stdin"));
const fs_1 = require("mz/fs");
const mkdirp = __importStar(require("mkdirp"));
const glob_promise_1 = __importDefault(require("glob-promise"));
const isGlob = require("is-glob");
const path_1 = require("path");
const index_1 = require("./index");
const utils_1 = require("./utils");
main(minimist(process.argv.slice(2), {
    alias: {
        help: ['h'],
        input: ['i'],
        output: ['o'],
    },
    boolean: [
        'additionalProperties',
        'declareExternallyReferenced',
        'enableConstEnums',
        'format',
        'ignoreMinAndMaxItems',
        'strictIndexSignatures',
        'unknownAny',
        'unreachableDefinitions',
    ],
    default: index_1.DEFAULT_OPTIONS,
    string: ['bannerComment', 'cwd'],
}));
async function main(argv) {
    if (argv.help) {
        printHelp();
        process.exit(0);
    }
    const argIn = argv._[0] || argv.input;
    const argOut = argv._[1] || argv.output; // the output can be omitted so this can be undefined
    const ISGLOB = isGlob(argIn);
    const ISDIR = isDir(argIn);
    if ((ISGLOB || ISDIR) && argOut && argOut.includes('.d.ts')) {
        throw new ReferenceError(`You have specified a single file ${argOut} output for a multi file input ${argIn}. This feature is not yet supported, refer to issue #272 (https://github.com/bcherny/json-schema-to-typescript/issues/272)`);
    }
    try {
        // Process input as either glob, directory, or single file
        if (ISGLOB) {
            await processGlob(argIn, argOut, argv);
        }
        else if (ISDIR) {
            await processDir(argIn, argOut, argv);
        }
        else {
            const result = await processFile(argIn, argv);
            outputResult(result, argOut);
        }
    }
    catch (e) {
        (0, utils_1.error)(e);
        process.exit(1);
    }
}
// check if path is an existing directory
function isDir(path) {
    return (0, fs_1.existsSync)(path) && (0, fs_1.lstatSync)(path).isDirectory();
}
async function processGlob(argIn, argOut, argv) {
    const files = await (0, glob_promise_1.default)(argIn); // execute glob pattern match
    if (files.length === 0) {
        throw ReferenceError(`You passed a glob pattern "${argIn}", but there are no files that match that pattern in ${process.cwd()}`);
    }
    // we can do this concurrently for perf
    const results = await Promise.all(files.map(async (file) => {
        return [file, await processFile(file, argv)];
    }));
    // careful to do this serially
    results.forEach(([file, result]) => {
        const outputPath = argOut && `${argOut}/${(0, path_1.basename)(file, '.json')}.d.ts`;
        outputResult(result, outputPath);
    });
}
async function processDir(argIn, argOut, argv) {
    const files = getPaths(argIn);
    // we can do this concurrently for perf
    const results = await Promise.all(files.map(async (file) => {
        if (!argOut) {
            return [file, await processFile(file, argv)];
        }
        else {
            const outputPath = (0, utils_1.pathTransform)(argOut, argIn, file);
            return [file, await processFile(file, argv), outputPath];
        }
    }));
    // careful to do this serially
    results.forEach(([file, result, outputPath]) => outputResult(result, outputPath ? `${outputPath}/${(0, path_1.basename)(file, '.json')}.d.ts` : undefined));
}
async function outputResult(result, outputPath) {
    if (!outputPath) {
        process.stdout.write(result);
    }
    else {
        if (!isDir((0, path_1.dirname)(outputPath))) {
            mkdirp.sync((0, path_1.dirname)(outputPath));
        }
        return await (0, fs_1.writeFile)(outputPath, result);
    }
}
async function processFile(argIn, argv) {
    const schema = JSON.parse(await readInput(argIn));
    return (0, index_1.compile)(schema, argIn, argv);
}
function getPaths(path, paths = []) {
    if ((0, fs_1.existsSync)(path) && (0, fs_1.lstatSync)(path).isDirectory()) {
        (0, fs_1.readdirSync)((0, path_1.resolve)(path)).forEach(item => getPaths((0, path_1.join)(path, item), paths));
    }
    else {
        paths.push(path);
    }
    return paths;
}
function readInput(argIn) {
    if (!argIn) {
        return (0, get_stdin_1.default)();
    }
    return (0, fs_1.readFile)((0, path_1.resolve)(process.cwd(), argIn), 'utf-8');
}
function printHelp() {
    const pkg = require('../../package.json');
    process.stdout.write(`
${pkg.name} ${pkg.version}
Usage: json2ts [--input, -i] [IN_FILE] [--output, -o] [OUT_FILE] [OPTIONS]

With no IN_FILE, or when IN_FILE is -, read standard input.
With no OUT_FILE and when IN_FILE is specified, create .d.ts file in the same directory.
With no OUT_FILE nor IN_FILE, write to standard output.

You can use any of the following options by adding them at the end.
Boolean values can be set to false using the 'no-' prefix.

  --additionalProperties
      Default value for additionalProperties, when it is not explicitly set
  --cwd=XXX
      Root directory for resolving $ref
  --declareExternallyReferenced
      Declare external schemas referenced via '$ref'?
  --enableConstEnums
      Prepend enums with 'const'?
  --format
      Format code? Set this to false to improve performance.
  --maxItems
      Maximum number of unioned tuples to emit when representing bounded-size
      array types, before falling back to emitting unbounded arrays. Increase
      this to improve precision of emitted types, decrease it to improve
      performance, or set it to -1 to ignore minItems and maxItems.
  --style.XXX=YYY
      Prettier configuration
  --unknownAny
      Output unknown type instead of any type
  --unreachableDefinitions
      Generates code for definitions that aren't referenced by the schema
`);
}
//# sourceMappingURL=cli.js.map