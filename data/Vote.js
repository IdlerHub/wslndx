/*
 * @Date: 2020-02-26 10:33:14
 * @LastEditors: hxz
 */
var httpService = require("../utils/service.js");

//POST h5opus/getCategory 获取分类列表
function getCategory() {
  return httpService.post("h5opus/getCategory");
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
  recordInvite
};
