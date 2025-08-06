import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducer'

/**
 * 自定义log中间件
 * @param store
 */
//这里用到了JS的函数柯里化，logger = store => next => action => 是函数柯里化的ES6写法
const logger = store => next => action => {
  if (typeof action === 'function') {
    //console.log('dispatching a function');
  } else {
    //console.log('dispatching ', action);
  }
  const result = next(action);
  //console.log('nextState ', store.getState());
  return result;
};


const middleware = [
  logger,
  thunk,
]

/**
 * 创建store
 */
export default createStore(reducer, applyMiddleware(...middleware));
