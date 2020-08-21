/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js");

//POST H5teachers/getRule 获取活动规则
function getH5Rule() {
  return httpService.post("H5teachers/getRule");
}

// //POST Studyreport/getAllProvince 获取省份
// function getAllProvince() {
//   return httpService.post("Studyreport/getAllProvince");
// }

// //POST Studyreport/getCity 获取城市
// function getCity(params) {
//   return httpService.post("Studyreport/getCity", params);
// }

// //POST Studyreport/getAllUniversity 获取学校
// function getSchool(params) {
//   return httpService.post("Studyreport/getAllUniversity", params);
// }

//POST H5teachers/getNewsMessage 获取最新的10条送花信息
function getNewestOpus(params) {
  return httpService.post("H5teachers/getNewsMessage", params);
}

/** POST H5teachers/getTeacherList
 * @description: 获取作品列表
 * @param {page}
 * @return:  promise
 */
function getOpusList(params) {
  return httpService.post("H5teachers/getTeacherList", params);
}

/** POST H5teachers/sendFlower
 * @description: 送花
 * @param {uid,teacher_id}
 * @return:  promise
 */
function praiseOpus(params) {
  return httpService.post("H5teachers/sendFlower", params);
}


/** POST H5teachers/getTeacherInfo
 * @description: 获取教师详情
 * @param {teacher_id}  作品id
 * @return:  promise
 */
function getOpusInfo(params) {
  return httpService.post("H5teachers/getTeacherInfo", params);
}

/** POST H5teachers/searchTeacher
 * @description: 作品搜索
 * @param {word,scroll_id}
 * @return:  promise
 */
function searchOpus(params) {
  return httpService.post("H5teachers/searchTeacher", params);
}

// POST H5teachers/getSearchWord 搜索历史记录
function getSearchWord() {
  return httpService.post("H5teachers/getSearchWord");
}

// POST H5teachers/delSearchWord 删除历史搜索记录
function delSearchWord(params) {
  return httpService.post("H5teachers/delSearchWord", params);
}

/**
 *  @description: 记录活动邀请用户数
 * @param {uid, invite_id , invite_type}
 * @return:  promise
 * **/
function recordInvite(params) {
  return httpService.post("h5opus/recordInvite", params);
}

/** H5teachers/getPosterInfo
 *  @description: 获取海报信息
 * @param {teacher_id}
 * @return:  promise
 * **/
function getPosterInfo(params) {
  return httpService.post("H5teachers/getPosterInfo", params);
}

/** H5teachers/getTeacherComment
 *  @description: 新增教师评论列表
 * @param {teacher_id}
 * @return:  promise
 * **/
function getTeacherComment(params) {
  return httpService.post("H5teachers/getTeacherComment", params);
}

/** H5teachers/addTeacherComment
 *  @description: 新增教师评论
 * @param {teacher_id, content}
 * @return:  promise
 * **/
function addTeacherComment(params) {
  return httpService.post("H5teachers/addTeacherComment", params);
}

/** H5teachers/deleteTeacherComment
 *  @description: 删除教师评论
 * @param {comment_id}
 * @return:  promise
 * **/
function deleteTeacherComment(params) {
  return httpService.post("H5teachers/deleteTeacherComment", params);
}

/** H5teachers/getMySendList
 *  @description: 获取我的送花列表
 * @param {page}
 * @return:  promise
 * **/
function getMySendList(params) {
  return httpService.post("H5teachers/getMySendList", params);
}

/** H5teachers/getTask
 *  @description: 获取任务列表
 * @param {}
 * @return:  promise
 * **/
function getTaskList() {
  return httpService.post("H5teachers/getTask");
}

module.exports = {
  // getAllProvince,
  // getCity,
  // getSchool,
  getH5Rule,
  getOpusList,
  praiseOpus,
  searchOpus,
  getOpusInfo,
  getSearchWord,
  recordInvite,
  getPosterInfo,
  getNewestOpus,
  delSearchWord,
  getMySendList,
  getTaskList,
  getTeacherComment,
  addTeacherComment,
  deleteTeacherComment,
};
