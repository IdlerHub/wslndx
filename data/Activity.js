var httpService = require("../utils/service.js")

// POST activity/hots 获取活动列表
function hots(param) {
  return httpService.post("activity/hots", param)
}

// POST activity/hots 获取活动banner
function bannerList() {
  return httpService.post("activity/bannerList")
}

// 体验营接口

/**
 * @description: 获取新手体验馆任务和积分配置
 * @param {} 
 * @return:  promise
 * **/
function hallGetTaskPointInfo(params) {
  return httpService.post("hall/getTaskPointInfo", params, null, true);
}

/**
 * @description: 获取网大简介
 * @param {} 
 * @return:  promise
 * **/
function hallGgetContentInfo(params) {
  return httpService.post("hall/getContentInfo", params, null, true);
}

/**
 * @description: 获取优秀作品列表
 * @param {} 
 * @return:  promise
 * **/
function hallGetOpus(params) {
  return httpService.post("hall/getOpus", params, null, true);
}

/**
 * @description: 获取作品详情
 * @param {} 
 * @return:  promise
 * **/
function hallGetOpusInfo(params) {
  return httpService.post("hall/getOpusInfo", params, null, true);
}

/**
 * @description: 点赞或者取消点赞
 * @param {} 
 * @return:  promise
 * **/
function giveOrCancelLike(params) {
  return httpService.post("experienceHall/giveOrCancelLike", params, null, true);
}

/**
 * @description: 記錄新人體驗館的内容分享
 * @param {} 
 * @return:  promise
 * **/
function experienceHallShare(params) {
  return httpService.post("experienceHall/share", params, null, true);
}

/**
 * @description: 增加学分
 * @param {} 
 * @return:  promise
 * **/
function addStudyRecord(params) {
  return httpService.post("experienceHall/addStudyRecord", params, null, true);
}
  
module.exports = {
  hots,
  bannerList,
  hallGetTaskPointInfo,
  hallGgetContentInfo,
  hallGetOpus,
  hallGetOpusInfo,
  giveOrCancelLike,
  experienceHallShare,
  addStudyRecord,
}