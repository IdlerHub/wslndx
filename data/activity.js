var httpService = require("../utils/service.js")

// POST activity/hots 获取活动列表
function hots(param) {
  return httpService.post("activity/hots", param)
}

// POST activity/hots 获取活动banner
function bannerList() {
  return httpService.post("activity/bannerList")
}
  
module.exports = {
  hots,
  bannerList
}