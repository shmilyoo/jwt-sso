import { sleep } from './utility';

/**
 * 同步验证regForm的数据
 *
 * @param {{username:string,password1:string,password2:string}} values form提交的表单数据
 * @returns {*} errors
 */
export const syncCheckRegForm = values => {
  const errors = {};
  ['username', 'password1', 'password2'].forEach(key => {
    if (!values[key]) {
      errors[key] = `${key}不能为空`;
    }
  });
  if (
    values.username &&
    !/^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(values.username)
  ) {
    errors.username =
      '用户名需4-16字符，包含英文字母、数字和下划线且以字母开头';
  }
  if (
    values.password1 &&
    values.password2 &&
    values.password1 !== values.password2
  ) {
    errors.password1 = errors.password2 = '两次密码需要相同';
  }
  return errors;
};

/**
 * 服务端验证用户名是否冲突
 * @param {{username:string}} values 包含username的对象
 */
// export const asyncCheckUsername = values => {
//   return sleep(1000).then(() => {
//     if (["aaaa", "bbbb", "bbbb"].includes(values.username)) {
//       return Promise.reject({ username: `用户名${values.username}已存在` });
//     }
//   });
// };
export const asyncCheckUsername = (values, dispatch) => {
  return new Promise(() => {
    dispatch({ type: 'saga-checkUsername', values });
  });
};

/**
 * 函数作为redux-form的参数，确保在submit的时候，不需要先async validate
 * @param {*} params
 */
export const shouldAsyncValidate = params => {
  if (!params.syncValidationPasses) {
    return false;
  }
  switch (params.trigger) {
    case 'blur':
      // blurring
      return true;
    case 'submit':
      // submitting, so only async validate if form is dirty or was never initialized
      // conversely, DON'T async validate if the form is pristine just as it was initialized
      return false;
    default:
      return false;
  }
};
