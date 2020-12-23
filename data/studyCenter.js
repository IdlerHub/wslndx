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


module.exports = {
  certificateList,
  certificateiInfo
}