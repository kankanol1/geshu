export function getSchema(req, res) {
  const result = {
    success: true,
    message: '验证成功',
    schema: [
      { name: 'key', type: '"string"', nullable: false },
      { name: 'value', type: '"string"', nullable: true },
    ],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  'POST /api/datapro/projects/pipeline/conf/getschema': getSchema,
};
