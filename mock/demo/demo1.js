let count = 0;

const genTableData = id => {
  const headers = ['name1', 'name2', 'name3', 'name4', 'col2', 'col3', 'col4', 'col5'];
  const columns = [];
  for (let i = 0; i < 1000; i++) {
    columns.push([
      `${count}-1${i}`,
      `${count}-9000${i}`,
      `${count}-name${i}`,
      `${count}-8011dsdad${i}`,
      `${count}-yo119${i}`,
      `${count}-cdd9xx${i}`,
      `${count}-1231232${i}`,
      count * 10000 + 90 * i,
    ]);
  }
  count += 1;
  return { headers, items: columns };
};

function init(req, res) {
  const result = { success: true, message: 'done.' };
  res.json(result);
}

function fetchData(req, res) {
  const data = genTableData(1);
  const result = { data, success: true, message: null };
  res.json(result);
}

export default {
  'GET /api/datapro/demo/init': init,
  'GET /api/datapro/demo/data': fetchData,
};
