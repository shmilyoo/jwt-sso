// request.js
import axios from 'axios';
import NProgress from 'nprogress';
import qs from 'qs';
import { server_base_url_product, server_baseURL_dev } from './config';
import { actions as commonActions } from './reducers/common';
// import { notification, message } from "antd";
// import { routerRedux } from "dva/router";
// import store from "../index";

/**
 * 一、功能：
 * 1. 统一拦截http错误请求码；
 * 2. 统一拦截业务错误代码；
 * 3. 统一设置请求前缀
 * |-- 每个 http 加前缀 baseURL = /api/v1，从配置文件中获取 apiPrefix
 * 4. 配置异步请求过渡状态：显示蓝色加载条表示正在请求中，避免给用户页面假死的不好体验。
 * |-- 使用 NProgress 工具库。
 *
 * 二、引包：
 * |-- axios：http 请求工具库
 * |-- NProgress：异步请求过度条，在浏览器主体部分顶部显示蓝色小条
 * |-- notification：Antd组件 > 处理错误响应码提示信息
 * |-- routerRedux：dva/router对象，用于路由跳转，错误响应码跳转相应页面
 * |-- store：dva中对象，使用里面的 dispatch 对象，用于触发路由跳转
 */
const configureAxios = (dispatch, history) => {
  // 设置全局参数，如响应超市时间，请求前缀等。
  axios.defaults.timeout = 3000;
  axios.defaults.withCredentials = true;
  // post会根据data的格式自动设置contentType
  // axios.defaults.headers.post["Content-Type"] =
  //   "application/x-www-form-urlencoded";
  // axios.defaults.baseURL = "/api/v1";

  // 状态码错误信息
  // const codeMessage = {
  //   200: '服务器成功返回请求的数据。',
  //   201: '新建或修改数据成功。',
  //   202: '一个请求已经进入后台排队（异步任务）。',
  //   204: '删除数据成功。',
  //   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  //   401: '用户没有权限（令牌、用户名、密码错误）。',
  //   403: '用户得到授权，但是访问是被禁止的。',
  //   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  //   406: '请求的格式不可得。',
  //   410: '请求的资源被永久删除，且不会再得到的。',
  //   422: '当创建一个对象时，发生一个验证错误。',
  //   500: '服务器发生错误，请检查服务器。',
  //   502: '网关错误。',
  //   503: '服务不可用，服务器暂时过载或维护。',
  //   504: '网关超时。'
  // };

  // 添加一个请求拦截器，用于设置请求过渡状态
  axios.interceptors.request.use(
    config => {
      // 请求开始，蓝色过渡滚动条开始出现
      NProgress.start();
      if (process.env.NODE_ENV === 'production') {
        // 生产环境下，设置为后端服务器地址
        config.baseURL = server_base_url_product;
      } else {
        config.baseURL = server_baseURL_dev;
      }
      if (config.method === 'post') {
        // content-type 自动设置为application/x-www-form-urlencoded
        config.data = qs.stringify(config.data);
      }
      // 考虑后还是采用cookie-session的方案吧
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers.Authorization = 'Token ' + token;
      // }
      return config;
    },
    error => {
      console.error('error at axios request');
      return Promise.reject(error);
    }
  );

  // 添加一个返回拦截器
  axios.interceptors.response.use(
    response => {
      // 如果请求结果为200，且success为false，在这里统一报错
      if (!response.data.success) {
        dispatch(commonActions.showMessage(response.data.error, 'error'));
      }
      // 请求结束，蓝色过渡滚动条消失
      NProgress.done();
      return response.data;
    },
    error => {
      // 非2xx响应在这里处理
      if (error.response && error.response.status === 401) {
        // 自定义401 重定向代替302重定向
        history.push(error.response.data);
        throw new axios.Cancel('cancel request and redirect');
      }
      dispatch(
        commonActions.showMessage(
          process.env.NODE_ENV === 'production' ? '请求失败' : error.message,
          'error'
        )
      );
      // console.error(
      //   'interceptors response, error is ' + JSON.stringify(error.message)
      // );
      // 请求结束，蓝色过渡滚动条消失
      // 即使出现异常，也要调用关闭方法，否则一直处于加载状态很奇怪
      NProgress.done();
      // return Promise.reject(error);
      console.log(error.response.data, error.response.status);
      throw new axios.Cancel('cancel request and redirect');
    }
  );

  // export default axios;

  // export default function request (opt) {
  //   // 调用 axios api，统一拦截
  //   return axios(opt)
  //     .then((response) =>
  //       // >>>>>>>>>>>>>> 请求成功 <<<<<<<<<<<<<<
  //       console.log(`【${opt.method} ${opt.url}】请求成功，响应数据：%o`, response);

  //       // 打印业务错误提示
  //       if (response.data && response.data.code != '0000') {
  //         message.error(response.data.message);
  //       }

  //       return { ...response.data };
  //     })
  //     .catch((error) => {
  //       // >>>>>>>>>>>>>> 请求失败 <<<<<<<<<<<<<<
  //       // 请求配置发生的错误
  //       if (!error.response) {
  //         return console.log('Error', error.message);
  //       }

  //       // 响应时状态码处理
  //       const status = error.response.status;
  //       const errortext = codeMessage[status] || error.response.statusText;

  //       notification.error({
  //         message: `请求错误 ${status}`,
  //         description: errortext,
  //       });

  //       // 存在请求，但是服务器的返回一个状态码，它们都在2xx之外
  //       const { dispatch } = store;

  //       if (status === 401) {
  //         dispatch(routerRedux.push('/user/login'));
  //       } else if (status === 403) {
  //         dispatch(routerRedux.push('/exception/403'));
  //       } else if (status <= 504 && status >= 500) {
  //         dispatch(routerRedux.push('/exception/500'));
  //       } else if (status >= 404 && status < 422) {
  //         dispatch(routerRedux.push('/exception/404'));
  //       }

  //       // 开发时使用，上线时删除
  //       console.log(`【${opt.method} ${opt.url}】请求失败，响应数据：%o`, error.response);

  //       return { code: status, message: errortext };
  //     });
  // }
};

export default configureAxios;
