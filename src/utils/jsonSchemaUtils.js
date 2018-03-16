/** utils to translate json schema. */

// stores schema titls => translate function.
const registeredSpecialSchemas = {
  Switch_Schema: translateSwitchSchema,
};

function translateSwitchSchema(originJsonSchema) {
  const newProps = {};
  const dependencies = {};
  for (const [key, value] of Object.entries(originJsonSchema.properties)) {
    if (key === 'on') {
      newProps[key] = value;
    } else {
      if (dependencies.on === undefined) {
        dependencies.on = { properties: {}, required: [] };
      }
      dependencies.on.properties[key] = value;
      if (value.required !== false) {
        dependencies.on.required.push(key);
      }
    }
  }
  const translated = { ...originJsonSchema, ...{ properties: newProps, dependencies } };
  return translated;
}

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
    } else if (value.type === 'boolean') {
      // default all booleans to false,
      value.default = false;
    } else if (value.type === 'object') {
      schemaClone.properties[key] = extractJsonSchema(value);
    }

    const translateFunc = registeredSpecialSchemas[value.title];

    if (translateFunc !== undefined) {
      // translate.
      schemaClone.properties[key] = translateFunc(value);
    }
  }
  if (required.length > 0) {
    return { ...schemaClone, required };
  } else {
    return { ...schemaClone };
  }
}

export function extractUISchemaForSample(originJsonSchema) {
  return { diy: { 'ui:field': 'sample', 'ui:options': { url: '/api/component/sample' } } };
}

export function extractUISchema(originJsonSchema) {
  const uiSchema = {};
  for (const [key, value] of Object.entries(originJsonSchema.properties)) {
    // set all boolean default to false.
    if (value.type === 'boolean') {
      uiSchema[key] = { 'ui:emptyValue': false };
    }

    if (value.type === 'object') {
      uiSchema[key] = extractUISchema(value);
    }
  }
  return {};
}

export default {
  extractJsonSchema,
  extractUISchemaForSample,
  extractUISchema,
};
