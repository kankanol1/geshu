/** utils to translate json schema. */

export function extractJsonSchema(originJsonSchema) {
  // extract required fields.
  const schemaClone = Object.assign({}, originJsonSchema);
  const required = [];
  for (const [key, value] of Object.entries(schemaClone.properties)) {
    if (value.required !== undefined && value.required === false) {
      // means false.
    } else {
      // means true.
      required.push(key);
    }

    // remove required field.
    if (value.required !== undefined) {
      delete value.required;
    }

    if (value.format !== undefined) {
      // not the same format.
      delete value.format;
    }

    if (value.type === 'array') {
      // delete format as well.
      if (value.items.format !== undefined) {
        delete value.items.format;
      }
    }

    if (value.type === 'object') {
      schemaClone.properties[key] = extractJsonSchema(value);
    }
  }
  if (required.length > 0) {
    return { ...schemaClone, required };
  } else {
    return { ...schemaClone };
  }
}

export function extractUISchema(originJsonSchema) {
  return { diy: { 'ui:field': 'sample', 'ui:options': { url: '/api/component/sample' } } };
}

export default {
  extractJsonSchema,
  extractUISchema,
};
