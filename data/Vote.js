/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js");

//POST h5opus/getH5Rule 获取活动规则
function getH5Rule() {
  return httpService.post("h5opus/getH5Rule");
}

//POST Studyreport/getAllProvince 获取省份
function getAllProvince() {
  return httpService.post("Studyreport/getAllProvince");
}

//POST Studyreport/getCity 获取城市
function getCity(params) {
  return httpService.post("Studyreport/getCity", params);
}

//POST Studyreport/getAllUniversity 获取学校
function getSchool(params) {
  return httpService.post("Studyreport/getAllUniversity", params);
}

//POST h5opus/getCategory 获取分类列表
function getCategory(params) {
  return httpService.post("h5opus/getCategory", params);
}

//POST h5opus/getNewestOpus 获取最新发布的作品消息
function getNewestOpus() {
  return httpService.post("h5opus/getNewestOpus");
}

/** POST h5opus/getOpusList
 * @description: 获取作品列表
 * @param {type,page}
 * @return:  promise
 */
function getOpusList(params) {
  return httpService.post("h5opus/getOpusList", params);
}

/** POST h5opus/praiseOpus
 * @description: 作品点赞
 * @param {type,id}
 * @return:  promise
 */
function praiseOpus(params) {
  return httpService.post("h5opus/praiseOpus", params);
}

/** POST h5opus/searchOpus
 * @description: 作品搜索
 * @param {word,page}
 * @return:  promise
 */
function searchOpus(params) {
  return httpService.post("h5opus/searchOpus", params);
}

/** POST h5opus/getMyOpus
 * @description: 我的作品
 * @param {type}    作品审核状态
 * @return:  promise
 */
function getMyOpus(params) {
  return httpService.post("h5opus/getMyOpus", params);
}

/** POST h5opus/getOpusInfo
 * @description: 作品详情
 * @param {id}  作品id
 * @return:  promise
 */
function getOpusInfo(params) {
  return httpService.post("h5opus/getOpusInfo", params);
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
 *  @description: 获取桶上传的ak/sk等相关参数
 * @param {*}
 * @return:  promise
 * **/
function getSecureToken() {
  return httpService.post("h5opus/getSecureToken", {}, true);
}

/**
 *  @description: 上传作品
 * @param {uid，name，content，type，hoc_id，url}
 * @return:  promise
 * **/
function uploadOpus(params) {
  return httpService.post("h5opus/uploadOpus", params);
}

/**
 *  @description: 记录活动邀请用户数
 * @param {uid, invite_id , invite_type}
 * @return:  promise
 * **/
function recordInvite(params) {
  return httpService.post("h5opus/recordInvite", params);
}

/** /h5opus/getPosterInfo
 *  @description: 获取海报信息
 * @param {uid，ho_id}
 * @return:  promise
 * **/
function getPosterInfo(params) {
  return httpService.post("h5opus/getPosterInfo", params);
}

// POST h5opus/getSchoolSortList 活动学校排行
function getSchoolSortList() {
  return httpService.post("h5opus/getSchoolSortList");
}

// POST h5opus/getPrize 活动排行榜type:1=优秀组织奖,2=个人作品奖,个人作品的话要多传一个hoc_id
function getPrize(params) {
  return httpService.post("h5opus/getPrize", params);
}

function searchCertificate(params) {
  return httpService.post("h5opus/searchCertificate", params);
}

module.exports = {
  getAllProvince,
  getCity,
  getSchool,
  getH5Rule,
  getCategory,
  getOpusList,
  praiseOpus,
  getSecureToken,
  uploadOpus,
  searchOpus,
  getMyOpus,
  getOpusInfo,
  getSearchWord,
  recordInvite,
  getPosterInfo,
  getNewestOpus,
  delSearchWord,
  noteGuide,
  getSchoolSortList,
  getPrize,
  searchCertificate,
};
