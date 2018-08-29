/** utils to translate json schema. */
import FuncUtils, { getAllInputSchemaForComponent } from './ComponentWidgetFunctions';

// stores schema titls => translate function.
const registeredSpecialJsonSchemas = {
  // Switch_Schema: translateSwitchSchema,
};

const registeredSpecialUISchemas = {
  Switch_Schema: translateSwitchUISchema,
  Fixed_File_Path: translateReadFilePathUISchema,
  Fixed_Dir_Path: translateDirFilePathUISchema,
  Database_Path: translateDatabasePathUISchema,
  Fixed_Any: translateFixedAnyUISchema,
  File_Source_Conf: translateFileSourceConfUISchema,
  Fixed_Column: translateInputColumnUISchema,
  Fixed_Double: translateFixedDoubleUISchema,
  Fixed_Int: translateFixedIntUISchema,
  // tunable
  Tunable_Int: translateTunableIntUISchema,
  Tunable_Double: translateTunableIntUISchema,

  Column_Name_Pair_Array: translateColumnMappingArrayUISchema,
  Column_Name_Pair: translateColumnMappingItemUISchema,
  Fixed_String_Array: translateColumnSelectCheckboxUISchema,
  Fixed_Column_Array: translateColumnSelectSelectorUISchema,

  // expression.
  Fixed_Expression: translateBooleanExpressionUISchema,

  Column_Assembler_Conf: translateColumnAssemblerConfUISchema,

  Column_Type_Pair_Array: translateColumnTypePairArrayUISchema,
  RandomSplitTransformerConf: translateRandomSplitTransformerConfUISchema,
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
  return { 'ui:field': 'file_selector', 'ui:options': { projectId, mode: 'file' } };
}

function translateDirFilePathUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'file_selector', 'ui:options': { projectId, mode: 'directory' } };
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

function translateColumnMappingArrayUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_mapping_array',
    'ui:options': {
      getField: () => FuncUtils.getAllColumnsFromUpstream(id),
      inputColumnTitle: '输入列',
      outputColumnTitle: '输出列',
    },
  };
}
function translateColumnMappingItemUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_mapping',
    'ui:options': {
      getField: () => FuncUtils.getAllColumnsFromUpstream(id),
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

function translateBooleanExpressionUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'boolean_expression_editor',
    'ui:options': {
      getTableSchema: () => getAllInputSchemaForComponent(id),
    },
  };
}

function translateColumnAssemblerConfUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_assembler_conf',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id) },
  };
}

function translateColumnTypePairArrayUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'column_type_pair_array',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id) },
  };
}

function translateRandomSplitTransformerConfUISchema(originJsonSchema, id, code, name, projectId) {
  return { 'ui:field': 'random_split_widget',
    'ui:options': { getField: () => FuncUtils.getAllColumnsFromUpstream(id) },
  };
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

  const translateFunc = registeredSpecialUISchemas[originJsonSchema.title];
  let newUISchema = uiSchema;
  if (translateFunc !== undefined) {
    // translate.
    const obj = translateFunc(originJsonSchema, id, code, name, projectId);
    newUISchema = { ...uiSchema, ...obj };
  }
  return newUISchema;
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
