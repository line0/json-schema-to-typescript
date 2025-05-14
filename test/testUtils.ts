import test from 'ava'
import {link} from '../src/linker'
import {pathTransform, generateName, isSchemaLike} from '../src/utils'
import {JSONSchema} from '../src/types/JSONSchema'

export function run() {
  const schema = link({
    title: 'Example Schema',
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
      },
      lastName: {
        id: 'lastName',
        type: 'string',
      },
    },
    required: ['firstName', 'lastName'],
  })

  test('pathTransform', t => {
    t.is(pathTransform('types', 'schemas', 'schemas/foo/a.json'), 'types/foo')
    t.is(pathTransform('./schemas/types', './schemas', 'schemas/foo/bar/a.json'), 'schemas/types/foo/bar')
    t.is(pathTransform('types', './src/../types/../schemas', 'schemas/foo/a.json'), 'types/foo')
  })
  test('generateName', t => {
    const usedNames = new Map<string, JSONSchema>()
    t.is(generateName('a', usedNames, schema), 'A')
    t.is(generateName('abc', usedNames, schema), 'Abc')
    t.is(generateName('ABcd', usedNames, schema), 'ABcd')
    t.is(generateName('$Abc_123', usedNames, schema), '$Abc_123')
    t.is(generateName('Abc-de-f', usedNames, schema), 'AbcDeF')

    // Index should increment:
    t.is(generateName('a', usedNames, schema), 'A1')
    t.is(generateName('a', usedNames, schema), 'A2')
    t.is(generateName('a', usedNames, schema), 'A3')
  })
  test('isSchemaLike', t => {
    t.is(isSchemaLike(schema), true)
    t.is(isSchemaLike([]), false)
    t.is(isSchemaLike(schema.properties), false)
    t.is(isSchemaLike(schema.required), false)
    t.is(isSchemaLike(schema.title), false)
    t.is(isSchemaLike(schema.properties!.firstName), true)
    t.is(isSchemaLike(schema.properties!.lastName), true)
  })
}
