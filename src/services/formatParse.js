// redux-form field的format和parse 帮助函数
import moment from 'moment';

export const formatSex = value => {
  // 用户性别：1男性, 2女性, 0未知
  if (value === 1) {
    return 'male';
  } else if (value === 2) {
    return 'female';
  } else return '';
};

export const parseSex = value => {
  if (value === 'male') return 1;
  else if (value === 'female') return 2;
  else throw 'sex only male or female';
};

export const formatUnixTsToDateOnly = value =>
  moment.unix(value).format('YYYY-MM-DD');

export const formatDateOnlyToUnixTs = value => moment(value).unix();
