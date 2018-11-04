// 一些辅助函数
import { actions as accountActions } from '../reducers/account';
import md5 from 'md5';
import axios from 'axios';
import Cookies from 'js-cookie';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * client端启动前加载本地用户token信息，设置相关state
 */
export const initAuthInfoAtStart = dispatch => {
  // todo 修改为cookie 存储
  // decode token， state中dispatch设置username active 等信息，判断过期时间等
  const username = Cookies.get('username');
  const active = Number.parseInt(Cookies.get('active'), 10);
  if (username && !active) {
    dispatch(accountActions.userAuth(username, active));
    // 如果本地保存有用户信息，则从服务器获取用户实时相关信息，避免本地信息过期或被篡改
    // todo 暂时取消下行，因为后端中间件会检查对比cookie和session信息，不一致则返回401
    dispatch(accountActions.checkUserAuth());
  }
};

/**
 * 重构每个表单的submit函数，避免重复代码
 */
export const formSubmit = (action, dispatch) => values =>
  new Promise(resolve => {
    dispatch({ type: action, resolve, values });
  });

/**
 *
 * @param {string|Buffer|Array|Uint8Array} message
 * @return {string} md5值，32位
 */
export const md5Passwd = message => md5(message);

/**
 * @return {Array} 获取部门结构列表
 */
export const getDeptArray = async () => {
  const response = await axios.get('/dept/all');
  return response;
};

export const addDept = async (name, intro, parentId) => {
  const response = await axios.post('/dept/add', { name, intro, parentId });
  return response;
};

/**
 * 根据dept list 返回第一级别展开的对象
 * @param {{id:string,level:number}[]} treeArray tree的按照level order 排列的dept数据array
 * @return {{string:boolean}} {1stLevel1Id:true,2ndLevel1Id:true...}
 */
export const getLevel1ExpandsfromTreeArray = treeArray => {
  let level1Expands = {};
  const length = treeArray.length;
  for (let i = 0; i < length; i++) {
    if (treeArray[i].level === 1) {
      level1Expands[treeArray[i].id] = true;
    }
    if (treeArray[i].level > 1) break;
  }
  return level1Expands;
};

/**
 *
 * @param {Array} deptArray 按照level从小到大排列的dept object数组
 * @param {(boolean|Object)} expanded id:bool 对象 设置各个节点是否展开,如果是Boolean则代表全展开或全折叠
 * @return {Array} 符合react-sortable-tree数据格式的数组
 */
export const makeDeptTree = (deptArray, expanded) => {
  // [{name,intro,parent,path,level,id,sid},{},{}]
  const result = [];
  const tmp = {};
  for (let i = 0; i < deptArray.length; i++) {
    const dept = deptArray[i];
    tmp[dept.id] = { title: dept.name, id: dept.id };
    // 如果expanded 为true或者 为Object且对应dept.id的key值为true
    if (expanded === true || expanded[dept.id] === true) {
      tmp[dept.id].expanded = true;
    }
    if (dept.parent_id !== '0') {
      tmp[dept.parent_id].children
        ? tmp[dept.parent_id].children.push(tmp[dept.id])
        : (tmp[dept.parent_id].children = [tmp[dept.id]]);
    } else {
      result.push(tmp[dept.id]);
    }
  }
  return result;
};

/**
 *  全部展开或者折叠树
 * @param {Object[]} treeData tree的数据结构
 * @param {boolean} expand 是否展开
 */
export const toggleExpandTreeData = (treeData, expand) => {
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      treeData[i].expanded = expand;
      toggleExpandTreeData(treeData[i].children, expand);
    }
  }
  return [...treeData];
};

export const getDeptWithParent = id => {
  return axios.get(`/dept/${id}?withParent=1`);
};
