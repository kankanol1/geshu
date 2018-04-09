/** utils to translate json schema. */

// stores schema titls => translate function.
const registeredSpecialJsonSchemas = {
  // Switch_Schema: translateSwitchSchema,
};

const registeredSpecialUISchemas = {
  Switch_Schema: translateSwitchUISchema,
  Select_Schema: translateSelectUISchema,
  Fixed_Any: translateFixedAnyUISchema,
};

/* fixed any */

function translateFixedAnyUISchema(originJsonSchema, id, code, name) {
  return { 'ui:field': 'any_value' };
}


/** ======== translate switch schema ========== */
function translateSwitchJsonSchema(originJsonSchema, id, code, name) {
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

function translateSwitchUISchema(originJsonSchema, id, code, name) {
  return { 'ui:field': 'switch_schema', schema: { 'ui:field': 'define_schema' } };
}

function translateSelectUISchema(originJsonSchema, id, code, name) {
  return { 'ui:field': 'select_schema', schema: { 'ui:field': 'define_schema' } };
}

/** ======== end translate switch schema ========== */

/** general translation */
export function extractJsonSchema(originJsonSchema, id, code, name) {
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
      schemaClone.properties[key] = extractJsonSchema(value, id, code, name);
    }

    const translateFunc = registeredSpecialJsonSchemas[value.title];

    if (translateFunc !== undefined) {
      // translate.
      schemaClone.properties[key] = translateFunc(value, id, code, name);
    }
  }
  if (required.length > 0) {
    return { ...schemaClone, required };
  } else {
    return { ...schemaClone };
  }
}

export function extractUISchema(originJsonSchema, id, code, name) {
  const uiSchema = {};
  for (const [key, value] of Object.entries(originJsonSchema.properties)) {
    if (value.type === 'object') {
      uiSchema[key] = extractUISchema(value, id, code, name);
      if (Object.keys(value.properties).length === 1) {
        // hide labels.
        uiSchema[key][Object.keys(value.properties)[0]] = { 'ui:options': { label: false } };
      }
    } else if (value.type === 'integer') {
      // use up-down for integer.
      uiSchema[key] = { 'ui:widget': 'updown' };
    }

    if ((value.type === 'string' && value.enum !== undefined)
      || (value.type === 'array')) {
      // hide labels.
      uiSchema[key] = { 'ui:options': { label: false } };
    }

    const translateFunc = registeredSpecialUISchemas[value.title];
    if (translateFunc !== undefined) {
      // translate.
      uiSchema[key] = translateFunc(value, id, code, name);
    }
  }
  return uiSchema;
}


/** just for example */
export function extractUISchemaForSample(originJsonSchema) {
  return { diy: { 'ui:field': 'sample', 'ui:options': { url: '/api/component/sample' } } };
}
/** example end */

export default {
  extractJsonSchema,
  extractUISchemaForSample,
  extractUISchema,
};
