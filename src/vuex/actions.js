import {
  GET_ADDRESS, GET_FOODCATEGORIES, GET_SHOPS, GET_USERMESSAGE, REMOVEUSER, GET_SHOP_MSG
} from './mutation-type';

import { reqAddress, reqFoodCategories, reqShops, reqAutoLogin, reqShopMsg } from '../api/index';
import router from '../router';

export default {
  async getAddress({ commit, state }) {
    let result = await reqAddress(`${state.latitude},${state.longitude}`);
    if (result.code === 0) {
      // console.log(result.data);
      commit(GET_ADDRESS, result.data);
    }
  },

  async getFoodCategories({ commit }, callback) {
    let result = await reqFoodCategories();
    if (result.code === 0) {
      commit(GET_FOODCATEGORIES, result.data);
    }
    // console.log( typeof callback);
    typeof callback === 'function' && callback()
  },

  async getShops({ commit, state }) {
    let result = await reqShops(state.latitude, state.longitude);
    if (result.code === 0) {
      commit(GET_SHOPS, result.data);
    }
  },

  // 更改用户信息项
  setUser({ commit }, user) {
    // 存储token
    localStorage.setItem("userToken", user.token);
    commit(GET_USERMESSAGE, user);
  },

  // 自动登录并更新用户信息
  async login_auto({ commit, state }) {
    if (localStorage.getItem("userToken") && JSON.stringify(state.user) === "{}") {
      const result = await reqAutoLogin();
      if (!result.code) {
        commit(GET_USERMESSAGE, result.data);
        let arr = ["/msite", "/order", "/search", "/profile", "/", "/shop/goods", "/shop/shopRatings", "/shop/shopInfo"]
        arr.indexOf(router.currentRoute.path) > -1 || router.replace('/msite');
        // router.currentRoute.path === "/login" && router.replace('/msite');
      }
    }
  },

  // 登出功能
  loginOut({ commit }) {
    localStorage.removeItem("userToken");
    commit(REMOVEUSER)
  },

  // 获取单个商家的信息
  async getShopMsg({ commit }) {
    const shopMsg = await reqShopMsg();
    if (!shopMsg.code) {
      commit(GET_SHOP_MSG, shopMsg.data)
    }
  }
}


