export function callFuncElseError(func) {
  let result;
  let error;
  if (func !== undefined) {
    try {
      result = func();
    } catch (err) {
      error = err;
    }
  } else {
    error = { message: '未定义处理函数,请通过ui:option设置' };
  }
  return { result, error };
}
