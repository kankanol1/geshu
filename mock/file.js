const fileList = [
  {
    fileName: '文件夹1',
    address: 'project/demo1',
    addressId: '10001',
    childFile: [
      {
        fileName: '子文件夹1',
        address: 'project/demo1/file1',
        addressId: '100010001',
      },
      {
        fileName: '子文件夹2',
        address: 'project/demo1/file2',
        addressId: '100010001',
      },
      {
        fileName: '子文件夹3',
        address: 'project/demo1/file3',
        addressId: '100010001',
      },
    ],
  },
  {
    fileName: '文件夹1',
    address: 'project/demo1',
    addressId: '10001',
  },
];

export function getFileList(res, req) {
  const result = {
    list: fileList,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveFile(res, req) {
  const result = {
    success: true,
    message: '添加成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getFileList,
  saveFile,
};
