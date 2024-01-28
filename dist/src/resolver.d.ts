import { ParserOptions } from '@apidevtools/json-schema-ref-parser';
import { JSONSchema } from './types/JSONSchema';
import type { JSONSchema4Object, JSONSchema6Object, JSONSchema7Object } from 'json-schema';
export type JSONSchemaObject = JSONSchema4Object | JSONSchema6Object | JSONSchema7Object;
export type DereferencedPaths = WeakMap<JSONSchemaObject, string>;
export declare function dereference(schema: JSONSchema, { cwd, $refOptions }: {
    cwd: string;
    $refOptions: ParserOptions;
}): Promise<{
    dereferencedPaths: DereferencedPaths;
    dereferencedSchema: JSONSchema;
}>;
