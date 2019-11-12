var httpService = require("../utils/service.js")

//POST Lottery/finishGetPrize 领取奖品
function finishGetPrize(param) {
  return httpService.post("Lottery/finishGetPrize", param)
}

//POST Lottery/prizeList 获取奖品列表
function prizeList(param) {
  return httpService.post("Lottery/prizeList", param)
}

//POST Lottery/lotteryCfgList 获取抽奖配置列表
function lotteryCfgList(param) {
  return httpService.post("Lottery/lotteryCfgList", param)
}

//POST Lottery/lotteryRes 获取抽奖结果
function lotteryRes(param) {
  return httpService.post("Lottery/lotteryRes", param)
}

module.exports = {
  finishGetPrize,
  prizeList,
  lotteryCfgList,
  lotteryRes
}


