/** utils to translate json schema. */
import FuncUtils from './ComponentWidgetFunctions';

// stores schema titls => translate function.
const registeredSpecialJsonSchemas = {
  // Switch_Schema: translateSwitchSchema,
};

const registeredSpecialUISchemas = {
  Switch_Schema: translateSwitchUISchema,
  Read_File_Path: translateReadFilePathUISchema,
  Database_Path: translateDatabasePathUISchema,
  Fixed_Any: translateFixedAnyUISchema,
  File_Source_Conf: translateFileSourceConfUISchema,
  Input_Column: translateInputColumnUISchema,
  Fixed_Double: translateFixedDoubleUISchema,
  Fixed_Int: translateFixedIntUISchema,
  Tunable_Int: translateTunableIntUISchema,
  Column_Name_Pair_Array: translateColumnMappingUISchema,
  Fixed_String_Array: translateColumnSelectCheckboxUISchema,
  Fixed_Column_Array: translateColumnSelectSelectorUISchema,
};

/* fixed any */

function translateFixedAnyUISchema(originJsonSchema, id, code, name) {
  return { 'ui:field': 'any_value' };
}


/** ======== translate switch schema ========== */
function translateSwitchJsonSchema(originJsonSchema, id, code, name, projectId) {
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

function translateSwitchUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'switch_schema', schema: { 'ui:field': 'define_schema' } };
}

function translateReadFilePathUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'file_selector', 'ui:options': { projectId } };
}

function translateDatabasePathUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'database_selector', 'ui:options': '/api/dataSelect/all' };
}

function translateFileSourceConfUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'file_source_conf', 'ui:options': { url: '/api/component/schema/prefetch' } };
}

function translateInputColumnUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'input_column',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id),
    } };
}

function translateColumnMappingUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_mapping',
    'ui:options': {
      getField: () => FuncUtils.getAllColumnsFromUpstream(id),
      inputColumnTitle: '输入列',
      outputColumnTitle: '输出列',
    },
  };
}

function translateColumnSelectCheckboxUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_selector_checkbox',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id) },
  };
}
function translateColumnSelectSelectorUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_selector_selector',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id) },
  };
}

function translateFixedDoubleUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'number_input', 'ui:options': { min: 0, max: undefined, step: 0.001 } };
}

function translateFixedIntUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'number_input', 'ui:options': { min: 0, max: undefined, step: 1 } };
}

function translateTunableIntUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'tunable_int' };
}

/** ======== end translate switch schema ========== */

/** general translation */
export function extractJsonSchema(originJsonSchema, id, code, name, projectId) {
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
      schemaClone.properties[key] = extractJsonSchema(value, id, code, name, projectId);
    }

    const translateFunc = registeredSpecialJsonSchemas[value.title];

    if (translateFunc !== undefined) {
      // translate.
      schemaClone.properties[key] = translateFunc(value, id, code, name, projectId);
    }
  }
  if (required.length > 0) {
    return { ...schemaClone, required };
  } else {
    return { ...schemaClone };
  }
}

export function extractUISchema(originJsonSchema, id, code, name, projectId) {
  const uiSchema = {};
  for (const [key, value] of Object.entries(originJsonSchema.properties)) {
    if (value.type === 'object') {
      uiSchema[key] = extractUISchema(value, id, code, name, projectId);
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
      if (uiSchema[key] === undefined) {
        uiSchema[key] = translateFunc(value, id, code, name, projectId);
      } else {
        const obj = translateFunc(value, id, code, name, projectId);
        uiSchema[key] = { ...uiSchema[key], ...obj };
      }
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
