
export const extractFileName = (path) => {
  const nameArr = path.split('/');
  return nameArr[nameArr.length - 1];
};

export default {
  extractFileName,
};
