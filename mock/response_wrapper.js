const wrapResponse = (response) => {
  if (response === undefined) {
    return {
      error: true,
      message: '无该条目数据',
    };
  }
  return {
    error: false,
    message: 'ok',
    data: response,
  };
};

export default { wrapResponse };
