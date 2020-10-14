var httpService = require("../utils/service.js")

// POST activity/hots 获取活动列表
function hots() {
  return httpService.post("activity/hots")
}

// POST activity/hots 获取活动banner
function bannerList() {
  return httpService.post("activity/bannerList")
}

module.exports = {
  hots,
  bannerList
}