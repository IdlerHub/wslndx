var httpService = require("../utils/service.js")

// POST ive/buygift/createGiftOrder 小程序创建购买礼物订单
function buygift(param) {
  return httpService.post("live/buygift/createGiftOrder", param, null ,true)
}

module.exports = {
  buygift,
}