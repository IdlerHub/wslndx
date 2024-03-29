/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-12 16:41:40
 */
var httpService = require("../utils/service.js");

//POST User/wxlogin 微信登录
function wxLoginCode(param) {
  return httpService.post("wx/login", param, true, true);
}

/**
 * @description:获取验证码
 * @mobile {number}
 * @return:promise
 */
function getAuthCode(mobile) {
  return httpService.post("sms/send", mobile, true);
}

/**
 * @description:手机号注册
 * @param {*}
 * @return: promise
 */
function register(param) {
  return httpService.post("wx/register", param, true, true);
}

//POST user/profile 更新用户资料
function profile(param) {
  return httpService.post("wx/profile", param, null, true);
}

//POST user/getOtherUser 个人首页用户信息
function getOtherUser(param) {
  return httpService.post("user/getOtherUser", param, null, true);
}

//POST User/collect 收藏课程
function collect(param) {
  return httpService.post("User/collect", param);
}

//POST User/history 学习历史
function history(param) {
  return httpService.post("User/history", param);
}

//POST area/search 搜索地址和大学
function search(param) {
  return httpService.post("area/search", param);
}
//用户专属二维码 -----邀请好友时使用
function userQr(param) {
  return httpService.post("User/qrcode", param);
}
//  用户签到
function sign(param) {
  return httpService.post("User/sign", param);
}

/**
 * @description:用户学分总和 及 学分获取明细
 * @param {*}
 * @return: promise
 */
function pointsinfo(param) {
  return httpService.post("User/pointsinfo", param);
}

/**
 * @description:学分兑换列表
 * @param {*}
 * @return: promise
 */
function gift(param) {
  return httpService.post("Gift/index", param);
}

/**
 * @description: 获取礼品规格
 * @param {giftId: 礼品id}
 * @return: promise
 */
function getSpecification(param) {
  return httpService.post("gift/quality/list", param , null ,true);
}

/**
 * @description:兑换物品
 * @param {*}
 * @return: promise
 */
function exchange(param) {
  return httpService.post("Gift/exchange", param);
}
/**
 * @description:  首页活动
 * @param { * }
 * @return: promise
 */
function activite() {
  return httpService.post("activity/index", {});
}
/**
 * @description: 用户签到状态
 * @param {*}
 * @return:promise
 */
function signed() {
  return httpService.post("User/signed", {});
}

/**
 * @description: 收集formID
 * @param {form_id}
 * @return:  promise
 */
function addFormId(param) {
  return httpService.post("user/addFormId", param);
}

//POST User/shareConfig 获取转发配置
function share() {
  return httpService.post("User/shareConfig", {});
}

//POST User/experienceArticle 获取体验官文章
function experienceArticle() {
  return httpService.post("User/experienceArticle", {});
}

//POST User/collectBlog 查看已收藏博客列表
function collectBlog(param) {
  return httpService.post("User/collectBlog", param);
}

//POST User/guideRecord 获取指引阅读记录
function guideRecord(param) {
  return httpService.post("User/guideRecord", param);
}

//POST User/guideRecord 增加指引阅读记录
function guideRecordAdd(param) {
  return httpService.post("User/guideRecordAdd", param);
}

//POST User/dialog 获取弹框
function dialog(param) {
  return httpService.post("User/dialog", param);
}

//POST User/getNewTaskStatus 获取新手任务状态
function getNewTaskStatus(param) {
  return httpService.post("User/getNewTaskStatus", param);
}

//POST User/getDayTaskStatus 获取每日任务状态
function getDayTaskStatus(param) {
  return httpService.post("User/getDayTaskStatus", param);
}

//POST User/lessonFinishStatus 获取用户课程完成状态
function lessonFinishStatus(param) {
  return httpService.post("User/lessonFinishStatus", param);
}
//POST User/userLessonCategory 获取用户课程用户分类
function getLessonCategory(param) {
  return httpService.post("User/userLessonCategory", param);
}

//POST User/collectLessonCategory 获取用户课程用户分类
function collectLessonCategory(param) {
  return httpService.post("User/collectLessonCategory", param);
}

//POST Message/index 获取用户消息列表
function getMessage(param) {
  return httpService.post("Message/index", param);
}

//POST Message/detail 消息详情
function messageDetail(param) {
  return httpService.post("Message/detail", param);
}

//POST User/following 关注用户
function following(param) {
  return httpService.post("User/following", param);
}

//POST User/cancelFollowing 取消关注用户
function cancelFollowing(param) {
  return httpService.post("User/cancelFollowing", param);
}

//POST User/userFollowing 用户关注列表
function userFollowing(param) {
  return httpService.post("User/userFollowing", param);
}

//POST Message/unreadNum 未读消息数目
function unreadNum(param) {
  return httpService.post("Message/unreadNum", param);
}

//POST /User/addLotteryInvite 抽奖活动邀请记录
function addLotteryInvite(param) {
  return httpService.post("User/addLotteryInvite", param);
}

//POST /user/getAreainfo 获取省市区
function getAreainfo(param) {
  return httpService.post("user/getAreainfo", param);
}

//POST /user/getGoodsAddress 获取收货地址信息
function getGoodsAddress() {
  return httpService.post("user/getGoodsAddress");
}

//POST /user/putGoodsaddress 提交信息
function putGoodsaddress(params) {
  return httpService.post("user/putGoodsaddress", params);
}

//POST /user/schoolWrite 提交用户地址暂无
function schoolWrite() {
  return httpService.post("user/schoolWrite");
}

//POST /user/getSchoolLessonTime 学校学习时间排名
function getSchoolLessonTime(params) {
  return httpService.post("user/getSchoolLessonTime", params);
}

//POST /user/getSchoolLessonTime 学校学习时间排名
function getUserLessonTime(params) {
  return httpService.post("user/getUserLessonTime", params);
}

//POST /user/getSchoolLessonTime 学校学习时间排名
function rankRule(params) {
  return httpService.post("user/rankRule", params);
}

//POST /user/getSchoolLearnTimeRank 获取学校学习时间排名
function getSchoolLearnTimeRank(params) {
  return httpService.post("user/getSchoolLearnTimeRank", params);
}

//POST /user/getUserLearnTimeRank 获取学校学习时间排名
function getUserLearnTimeRank(params) {
  return httpService.post("user/getUserLearnTimeRank", params);
}

//POST /user/getLearnTimeProportion 获取用户学习时间比例
function getLearnTimeProportion(params) {
  return httpService.post("user/getLearnTimeProportion", params);
}

//POST /User/putEmail 更新邮箱
function putEmail(params) {
  return httpService.post("user/putEmail", params);
}

//POST /User/putEmail 获取openid
function getUserOpenData(params) {
  return httpService.post("user/getUserOpenData", params);
}

//POST /schedule/getUserOpenid 获取openid/个人邀请数
function myIndex(params) {
  return httpService.post("user/myIndex", params);
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
  getSpecification,
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
  getGoodsAddress,
  putGoodsaddress,
  schoolWrite,
  getSchoolLessonTime,
  getUserLessonTime,
  rankRule,
  getSchoolLearnTimeRank,
  getUserLearnTimeRank,
  getLearnTimeProportion,
  putEmail,
  getUserOpenData,
  myIndex,
  getOtherUser
};
