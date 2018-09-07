import { sleep } from './utility';
import { types as accountTypes } from '../reducers/account';
import { actions as accountActions } from '../reducers/account';

export const required = value => {
  console.log(`check required =${value}=`);
  if (!value) return '不能为空';
};

export const checkUsername = value => {
  console.log(`checkUsername =${value}=`);
  if (value && !/^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(value)) {
    return '4-16字符,字母开头,允许字母/数字/_';
  }
};

/**
 * 同步验证regForm的数据
 *
 * @param {{username:string,password1:string,password2:string}} values form提交的表单数据
 * @returns {*} errors
 */
export const syncCheckRegForm = values => {
  console.log('syncCheckRegForm');
  const errors = {};
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
 * 服务端验证注册的用户名是否冲突
 * @param {{username:string}} values 包含username的对象
 */
export const asyncCheckUsername = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(accountActions.sagaCheckUsername(values, resolve, reject));
  });
};

/**
 * 函数作为redux-form的参数，确保在submit的时候，不需要先async validate
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
