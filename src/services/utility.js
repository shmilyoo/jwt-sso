// 一些辅助函数
import { types as accountType } from '../reducers/account';
import jwtDecode from 'jwt-decode';
import md5 from 'md5';
import axios from 'axios';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * client端启动前加载本地用户token信息，设置相关state
 */
export const initAuthInfoAtStart = dispatch => {
  console.log('init start');
  // 修改为cookie 存储
  const token = localStorage.getItem('token');
  // decode token， state中dispatch设置username active 等信息，判断过期时间等
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded && decoded.username) {
      dispatch({
        type: accountType.AUTH_INFO,
        username: decoded.username,
        active: decoded.active || 1
      });
      // 改为cookie session方案，不再做检查了
      // 如果本地保存有用户信息，则从服务器获取用户实时相关信息，避免本地信息过期或被篡改
      // dispatch({
      //   type: accountType.SAGA_GET_USER_INFO,
      //   username: decoded.username
      // });
    }
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
 * @param {string} password 用户原始密码
 * @return 密码的md5值，32位
 */
export const md5Passwd = password => md5(password);

/**
 * @return {Array} 获取部门结构列表
 */
export const getDeptArray = async () => {
  const response = await axios.get('/dept/all');
  return response;
};

export const createDept = async (name, intro, parentId) => {
  const response = await axios.post('/dept/create', { name, intro, parentId });
  return response;
};

/**
 *
 * @param {Array} deptArray 按照level从小到大排列的dept object数组
 * @param {(boolean|Object)} expanded id:bool 对象 设置各个节点是否展开,如果是Boolean则代表全展开或全折叠
 * @return {Array} [符合react-sortable-tree数据格式的数组,如果是第一次mount后返回的新expands值]
 */
export const makeDeptTree = (deptArray, expanded) => {
  // [{name,intro,parent,path,level,id,sid},{},{}]
  const result = [];
  const tmp = {};
  let newExpands = null;
  for (let i = 0; i < deptArray.length; i++) {
    const dept = deptArray[i];
    tmp[dept.id] = { title: dept.name, id: dept.id };
    // 如果是页面初始mount，则展开第一层级。mount的时候expanded为{}
    if (JSON.stringify(expanded) === '{}' && dept.level === 1) {
      tmp[dept.id].expanded = true;
      newExpands
        ? (newExpands[dept.id] = true)
        : (newExpands = { [dept.id]: true });
    }
    // 如果expanded 为true或者 为Object且对应dept.id的key值为true
    if (expanded && (expanded === true || expanded[dept.id] === true)) {
      tmp[dept.id].expanded = true;
    }
    if (dept.parent !== '0') {
      tmp[dept.parent].children
        ? tmp[dept.parent].children.push(tmp[dept.id])
        : (tmp[dept.parent].children = [tmp[dept.id]]);
    } else {
      result.push(tmp[dept.id]);
    }
  }
  return [result, newExpands];
};

/**
 *
 * @param {Object[]} treeData tree的数据结构
 * @param {boolean} expand 是否展开
 */
export const toogleExpandTreeData = (treeData, expand) => {
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i].children) {
      treeData[i].expanded = expand;
      toogleExpandTreeData(treeData[i].children, expand);
    }
  }
  return treeData;
};
