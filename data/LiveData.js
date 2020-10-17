/*
 * @Date: 2020-08-03 10:45:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js");

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
function getUserLessons(params) {
  return httpService.post("schedule/userLessons", params);
}

/**
 * @description: 搜索课程
 * @param {keywords,page_size,last_id}  --- {搜索关键字,分页数量大小(默认5),翻页时取下一条的条件(最后一条ID)}
 * @return:  promise
 * **/
function toLiveSearch(params) {
  return httpService.post("schedule/search", params);
}

// 讨论模块接口
/**
 * @description: 课程评论列表
 * @param {lesson_id,page_size,page}  --- {课程ID}
 * @return:  promise
 * **/
function getCommentList(params) {
  return httpService.post("schedule/commentList", params);
}
/**
 * @description: 发布课程评论
 * @param {lesson_id,content}  --- {课程ID,评论内容}
 * @return:  promise
 * **/
function putComment(params) {
  return httpService.post("schedule/putComment", params);
}
/**
 * @description: 删除课程评论
 * @param {comment_id}  --- {评论ID}
 * @return:  promise
 * **/
function delComment(params) {
  return httpService.post("schedule/delComment", params);
}
/**
 * @description: 提交二级/三级评论
 * @param {comment_id,reply_content,reply_id,to_user}  --- {评论ID,回复内容,回复的信息的ID(三级评论),被回复人的用户ID}
 * @return:  promise
 * **/
function putReply(params) {
  return httpService.post("schedule/putReply", params);
}
/**
 * @description: 删除二级/三级评论
 * @param {reply_id}  --- {回复ID}
 * @return:  promise
 * **/
function delReply(params) {
  return httpService.post("schedule/delReply", params);
}
/**
 * @description: 评论回复详细列表
 * @param {comment_id}  --- {评论ID}
 * @return:  promise
 * **/
function replyList(params) {
  return httpService.post("schedule/replyList", params);
}

/**
 * @description: 分享课程记录
 * @param {lesson_id}  --- {课程ID}
 * @return:  promise
 * **/
function shareLesson(params) {
  return httpService.post("schedule/shareLesson", params);
}

/**
 * @description: 获取公众号订阅消息
 * @param {lesson_id, uid , openid}  --- {课程ID}
 * @return:  promise
 * **/
function getSendMessage(params) {
  return httpService.post("schedule/subscribeLesson", params);
}

/**
 * @description: 获取获取课程中心
 * @param {}
 * @return:  promise
 * **/
function getLessonCenter(params) {
  return httpService.post("schedule/getLessonCenter", params);
}

/**
 * @description: 获取课程中心的的直播课程
 * @param {center_id}
 * @return:  promise
 * **/
function getLessonCenterClass(params) {
  return httpService.post("schedule/getLessonCenterClass", params);
}

/**
 * @description: 获取课程星期列表
 * @param {}
 * @return:  promise
 * **/
function getLessonWeeks(params) {
  return httpService.post("schedule/getLessonWeeks", params);
}

/**
 * @description: 获取课程星期列表
 * @param {}
 * @return:  promise
 * **/
function newUserLessons(params) {
  return httpService.post("schedule/newUserLessons", params);
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
  getCommentList,
  putComment,
  delComment,
  putReply,
  delReply,
  replyList,
  shareLesson,
  getSendMessage,
  getLessonCenter,
  getLessonCenterClass,
  getLessonWeeks,
  newUserLessons
};
