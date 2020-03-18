/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-12 16:41:40
 */
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
 * @description:用户学分总和 及 学分获取明细
 * @param {*}
 * @return: promise
 */
function pointsinfo(param) {
  return httpService.post("User/pointsinfo", param)
}

/**
 * @description:学分兑换列表
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

//POST User/shareConfig 获取转发配置
function share() {
  return httpService.post("User/shareConfig", {})
}

//POST User/experienceArticle 获取体验官文章
function experienceArticle() {
  return httpService.post("User/experienceArticle", {})
}

//POST User/collectBlog 查看已收藏博客列表
function collectBlog(param) {
  return httpService.post("User/collectBlog", param)
}

//POST User/guideRecord 获取指引阅读记录
function guideRecord(param) {
  return httpService.post("User/guideRecord", param)
}

//POST User/guideRecord 增加指引阅读记录
function guideRecordAdd(param) {
  return httpService.post("User/guideRecordAdd", param)
}

//POST User/dialog 获取弹框
function dialog(param) {
  return httpService.post("User/dialog", param)
}

//POST User/getNewTaskStatus 获取新手任务状态
function getNewTaskStatus(param) {
  return httpService.post("User/getNewTaskStatus", param)
}

//POST User/getDayTaskStatus 获取每日任务状态
function getDayTaskStatus(param) {
  return httpService.post("User/getDayTaskStatus", param)
}

//POST User/lessonFinishStatus 获取用户课程完成状态
function lessonFinishStatus(param) {
  return httpService.post("User/lessonFinishStatus", param)
}
//POST User/userLessonCategory 获取用户课程用户分类
function getLessonCategory(param) {
  return httpService.post("User/userLessonCategory", param)
}

//POST User/collectLessonCategory 获取用户课程用户分类
function collectLessonCategory(param) {
  return httpService.post("User/collectLessonCategory", param)
}

//POST Message/index 获取用户消息列表
function getMessage(param) {
  return httpService.post("Message/index", param)
}

//POST Message/detail 消息详情
function messageDetail(param) {
  return httpService.post("Message/detail", param)
}

//POST User/following 关注用户
function following(param) {
  return httpService.post("User/following", param)
}

//POST User/cancelFollowing 取消关注用户
function cancelFollowing(param) {
  return httpService.post("User/cancelFollowing", param)
}

//POST User/userFollowing 用户关注列表
function userFollowing(param) {
  return httpService.post("User/userFollowing", param)
}

//POST Message/unreadNum 未读消息数目
function unreadNum(param) {
  return httpService.post("Message/unreadNum", param)
}

//POST /User/addLotteryInvite 抽奖活动邀请记录
function addLotteryInvite(param) {
  return httpService.post("User/addLotteryInvite", param)
}

//POST /user/getAreainfo 获取省市区
function getAreainfo(param) {
  return httpService.post("user/getAreainfo", param)
}

//POST /user/getAreainfo 获取收货地址信息
function getGoodsAddress() {
  return httpService.post("user/getGoodsAddress")
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
  addFormId,
  share,
  experienceArticle,
  collectBlog,
  guideRecord,
  guideRecordAdd,
  dialog,
  getNewTaskStatus,
  getDayTaskStatus,
  getLessonCategory,
  collectLessonCategory,
  getMessage,
  messageDetail,
  following,
  cancelFollowing,
  userFollowing,
  lessonFinishStatus,
  unreadNum,
  addLotteryInvite,
  getAreainfo,
  getGoodsAddress
}
