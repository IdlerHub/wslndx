var httpService = require("../utils/service.js");

/**
 * @description: 获取分类信息
 * @param {}
 * @return:  promise
 * **/
function getAllCategory(params) {
  return httpService.post("index/getAllCategory", params, null ,true);
}

module.exports = {
  getAllCategory
}