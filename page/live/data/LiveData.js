/*
 * @Date: 2020-08-03 10:45:14
 * @LastEditors: zxk
 */
var httpService = require("../../../utils/service.js");

/**
 * @description: 获取直播课程列表
 * @param
 * @return:  promise
 * **/
function getLiveLessons() {
  return httpService.post("schedule/lessons");
}

/**
 * @description: 获取报名详情页面信息
 * @param {lesson_id, inviter}  --- {课程ID, 邀请人uid}
 * @return:  promise
 * **/
function getApplyDetail(params) {
  return httpService.post("schedule/applyDetail", params);
}
/**
 * @description: 获取邀请记录
 * @param {lesson_id, page_size}  --- {课程ID, 获取数量(默认是10)}
 * @return:  promise
 * **/
function getInviteRecord(params) {
  return httpService.post("schedule/inviteRecord", params);
}
/**
 * @description: 立即学习(即领取课程,用户首次进入课程详情页面)
 * @param {lesson_id}  --- {课程ID}
 * @return:  promise
 * **/
function getReceiveLesson(params) {
  return httpService.post("schedule/receiveLesson", params);
}

/**
 * @description: 获取课程详情页面信息
 * @param {lesson_id}  --- {课程ID}
 * @return:  promise
 * **/
function getLessonDetail(params) {
  return httpService.post("schedule/lessonDetail", params);
}
/**
 * @description: 课程章节列表
 * @param {lesson_id}  --- {课程ID}
 * @return:  promise
 * **/
function getSublesson(params) {
  return httpService.post("schedule/sublesson", params);
}

/**
 * @description: 获取用户课程列表
 * @return:  promise
 * **/
function getUserLessons() {
  return httpService.post("schedule/userLessons");
}

/**
 * @description: 搜索课程
 * @param {keywords,page_size,last_id}  --- {搜索关键字,分页数量大小(默认5),翻页时取下一条的条件(最后一条ID)}
 * @return:  promise
 * **/
function toLiveSearch(params) {
  return httpService.post("schedule/search", params);
}

module.exports = {
  getLiveLessons,
  getApplyDetail,
  getInviteRecord,
  getReceiveLesson,
  getLessonDetail,
  getSublesson,
  getUserLessons,
  toLiveSearch,
};
