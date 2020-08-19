/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js");

//POST h5opus/getH5Rule 获取活动规则
function getH5Rule() {
  return httpService.post("h5opus/getH5Rule");
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
function getNewestOpus() {
  return httpService.post("H5teachers/getNewsMessage");
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

/** POST h5opus/searchOpus
 * @description: 作品搜索
 * @param {word,page}
 * @return:  promise
 */
function searchOpus(params) {
  return httpService.post("h5opus/searchOpus", params);
}

/** POST H5teachers/getTeacherInfo
 * @description: 获取教师详情
 * @param {teacher_id}  作品id
 * @return:  promise
 */
function getOpusInfo(params) {
  return httpService.post("H5teachers/getTeacherInfo", params);
}

// POST h5opus/getSearchWord 搜索历史记录
function getSearchWord() {
  return httpService.post("h5opus/getSearchWord");
}

// POST h5opus/noteGuide 记录用户活动引导状态
function noteGuide() {
  return httpService.post("h5opus/noteGuide");
}

// POST h5opus/delSearchWord 删除历史搜索记录
function delSearchWord(params) {
  return httpService.post("h5opus/delSearchWord", params);
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

function searchCertificate(params) {
  return httpService.post("h5opus/searchCertificate", params);
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
  noteGuide,
  searchCertificate,
};
