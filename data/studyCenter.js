var httpService = require("../utils/service.js")

/**
 * @description: 结课证书列表
 * @param {}
 * @return:  promise
 * **/
function certificateList(params) {
  return httpService.post("live/certificate/list", params, null, true);
}

/**
 * @description: 证书详情
 * @param {columnId}
 * @return:  promise
 * **/
function certificateiInfo(params) {
  return httpService.post("live/certificate/info", params, null, true);
}


/**
 * @description: 统计学习天数和本周学习时长
 * @param {}
 * @return:  promise
 * **/
function centerDuration(params) {
  return httpService.post("study/center/duration", params, null, true);
}

/**
 * @description: 我的直播
 * @param {}
 * @return:  promise
 * **/
function centerLive(params) {
  return httpService.post("study/center/live", params, null, true);
}

/**
 * @description: 我的直播
 * @param {}
 * @return:  promise
 * **/
function centerHistoryLesson(params) {
  return httpService.post("study/center/historyLesson", params, null, true);
}

module.exports = {
  certificateList,
  certificateiInfo,
  centerDuration,
  centerLive,
  centerHistoryLesson
}