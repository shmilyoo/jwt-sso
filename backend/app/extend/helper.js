'use strict';
// 项目中在helper中定义一些不需要app/ctx等上下文的帮助函数,但会在app/ctx中调用

module.exports = {
  /**
   *
   * @param {boolean} success 返回请求是否成功
   * @param {Object} dataOrError success为true时为object，false时为错误描述字符串
   * @return {object} {success:true,{...data}}或者{success:false,error:string}
   */
  getRespBody(success, dataOrError) {
    return success
      ? { success, data: dataOrError }
      : { success, error: dataOrError };
  },

  /**
   * set cookies时根据参数获取expires, maxAge
   * @param {'week'|'day'|'month'|'hour'|'minute'} type 时间单位，周月日等
   * @param {number} num 倍数
   * @return {array} [ expires:utcstring, maxAge:million seconds ]
   */
  getExpiresAndMaxAge(type, num) {
    let maxAge;
    switch (type) {
      case 'week':
        maxAge = 3600 * 24 * 7 * 1000 * num;
        break;
      case 'day':
        maxAge = 3600 * 24 * 1000 * num;
        break;
      case 'month':
        maxAge = 3600 * 24 * 30 * 1000 * num;
        break;
      case 'hour':
        maxAge = 3600 * 1000 * num;
        break;
      case 'minute':
        maxAge = 60 * 1000 * num;
        break;
      default:
        maxAge = 1000 * num;
        break;
    }
    let expires = new Date();
    expires.setTime(expires.getTime() + maxAge);
    expires = expires.toUTCString();
    return [ expires, maxAge ];
  },

  getCookie(key) {
    return this.ctx.cookies.get(key, { signed: false });
  },

  setCookie(key, value, option = {}) {
    this.ctx.cookies.set(
      key,
      value,
      Object.assign({ signed: false, httpOnly: false }, option)
    );
  },
};
