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

/**
 * @description: 获取短视频分类列表
 */
function categoryMore(param) {
  return httpService.post("Shortvideo/Category", param, true)
}

/**
 * @description: 短视频播放记录(置顶)
 */
function recordAdd(param) {
  return httpService.post("Shortvideo/recordAdd", param)
}

/**
 * @description: 短视频奖励判断
 */
function shortvideoAward(param) {
  return httpService.post("Shortvideo/shortvideoAward", param)
}

/**
 * @description: 短视频完成播放
 */
function recordFinish(param) {
  return httpService.post("Shortvideo/recordFinish", param)
}

module.exports = {
  list,
  praise,
  delPraise,
  share,
  search,
  category,
  categoryMore,
  recordAdd,
  shortvideoAward,
  recordFinish
}
