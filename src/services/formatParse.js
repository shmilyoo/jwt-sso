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
  else return 2;
};

export const formatUnixTsToMoment = ts => {
  console.log('formatUnixTsToMoment ', ts, '----');
  return Number.isInteger(ts) ? moment.unix(ts) : null;
};

/**
 * @param {moment} m a moment instance
 * @return unix timestamp
 */
export const parseMomentToUnixTs = m => {
  return moment(m).unix();
};
