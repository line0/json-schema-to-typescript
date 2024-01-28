import $RefParser, {ParserOptions} from '@apidevtools/json-schema-ref-parser'
import {JSONSchema} from './types/JSONSchema'
import {log} from './utils'

import type {JSONSchema4Object, JSONSchema6Object, JSONSchema7Object} from 'json-schema'

export type JSONSchemaObject = JSONSchema4Object | JSONSchema6Object | JSONSchema7Object
export type DereferencedPaths = WeakMap<JSONSchemaObject, string>

export async function dereference(
  schema: JSONSchema,
  {cwd, $refOptions}: {cwd: string; $refOptions: ParserOptions},
): Promise<{dereferencedPaths: DereferencedPaths; dereferencedSchema: JSONSchema}> {
  log('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema)
  const parser = new $RefParser()
  const dereferencedPaths: DereferencedPaths = new WeakMap()
  const dereferencedSchema = (await parser.dereference(cwd, schema as any, {
    ...$refOptions,
    dereference: {
      ...$refOptions.dereference,
      onDereference(path: string, value: JSONSchemaObject) {
        dereferencedPaths.set(value, path)
      },
    },
  })) as any // TODO: fix types
  return {dereferencedPaths, dereferencedSchema}
}
