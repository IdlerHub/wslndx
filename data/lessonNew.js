var httpService = require("../utils/service.js");

/**
 * @description: 获取分类信息
 * @param {}
 * @return:  promise
 * **/
function getAllCategory(params) {
  return httpService.post("index/getAllCategory", params, null ,true);
}

/**
 * @description: 根据分类获取课程和直播专栏列表(全部课程)
 * @param {categoryId, pageSize, pageNum, requestTime} 二级分类ID - 分页大小 - 当前页码 - 第一页请求时间（秒）解决下拉分页数据重复问题
 * @return:  promise
 * **/
function categoryLessonOrLive(params) {
  return httpService.post("index/categoryLessonOrLive", params, null ,true);
}

module.exports = {
  getAllCategory,
  categoryLessonOrLive
}