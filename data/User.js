var httpService = require("../utils/service.js")

//POST User/wxlogin 微信登录
function wxLoginCode(param) {
  // console.log("wx.login")
  return httpService.post("User/wxlogin", param, true)
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

module.exports = {
  wxLoginCode: wxLoginCode,
  register: register,
  collect: collect,
  history: history,
  search: search,
  profile: profile,
  userQr: userQr,
  sign: sign,
  gift: gift,
  exchange: exchange,
  pointsinfo: pointsinfo
}
