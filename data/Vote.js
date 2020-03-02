/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: hxz
 */
var httpService = require("../utils/service.js");

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
  return httpService.post("h5opus/getSecureToken");
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

module.exports = {
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
  noteGuide
};
