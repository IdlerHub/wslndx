var httpService = require("../utils/service.js")

//POST User/wxlogin 微信登录
function wxLoginCode(param) {
  return httpService.post("User/wxlogin", param, true)
}

/**
 * @description:获取验证码
 * @mobile {number}
 * @return:promise
 */
function getAuthCode(mobile) {
  return httpService.post("sms/send", mobile, true)
}

/**
 * @description:手机号注册
 * @param {*}
 * @return: promise
 */
function register(param) {
  return httpService.post("User/register", param, true)
}

//POST user/profile 更新用户资料
function profile(param) {
  return httpService.post("User/profile", param)
}

//POST User/collect 收藏课程
function collect(param) {
  return httpService.post("User/collect", param)
}

//POST User/history 学习历史
function history(param) {
  return httpService.post("User/history", param)
}

//POST area/search 搜索地址和大学
function search(param) {
  return httpService.post("area/search", param)
}
//用户专属二维码 -----邀请好友时使用
function userQr(param) {
  return httpService.post("User/qrcode", param)
}
//  用户签到
function sign(param) {
  return httpService.post("User/sign", param)
}

/**
 * @description:
 * @param {*}
 * @return: promise
 */
function pointsinfo(param) {
  return httpService.post("User/pointsinfo", param)
}

/**
 * @description:积分兑换列表
 * @param {*}
 * @return: promise
 */
function gift(param) {
  return httpService.post("Gift/index", param)
}

/**
 * @description:兑换物品
 * @param {*}
 * @return: promise
 */
function exchange(param) {
  return httpService.post("Gift/exchange", param)
}
/**
 * @description:  首页活动
 * @param { * }
 * @return: promise
 */
function activite() {
  return httpService.post("activity/index", {})
}
/**
 * @description: 用户签到状态
 * @param {*}
 * @return:promise
 */
function signed() {
  return httpService.post("User/signed", {})
}

/**
 * @description: 收集formID
 * @param {form_id}
 * @return:  promise
 */
function addFormId(param) {
  return httpService.post("user/addFormId", param)
}

module.exports = {
  wxLoginCode,
  getAuthCode,
  register,
  collect,
  history,
  search,
  profile,
  userQr,
  sign,
  gift,
  exchange,
  pointsinfo,
  activite,
  signed,
  addFormId
}
