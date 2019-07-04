var httpService = require("../utils/service.js")

//POST Shortvideo/lists 获取短视频列表
function list(param) {
  return httpService.post("Shortvideo/lists", param)
}

//POST Shortvideo/praise 点赞
function praise(param) {
  return httpService.post("Shortvideo/praise", param)
}

//POST Shortvideo/praiseCancel 取消点赞
function delPraise(param) {
  return httpService.post("Shortvideo/praiseCancel", param)
}

//POST Shortvideo/forward 分享
function share(param) {
  return httpService.post("Shortvideo/forward", param)
}

/**
 * @description: 短视频分类
 * @param {page ,pageSize ,id ,categoryId }
 * @return: promise
 */
function search(param) {
  return httpService.post("Shortvideo/search", param)
}

/**
 * @description: 根据id获取分类列表（登录）
 * @param {categoryId, id ,position,include  ,pageSize }
 * @return:
 */
function category(param) {
  return httpService.post("Shortvideo/categoryLists", param)
}

module.exports = {
  list,
  praise,
  delPraise,
  share,
  search,
  category
}
