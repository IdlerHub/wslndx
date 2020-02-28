var httpService = require("../utils/service.js")
//POST Tutor/myIndex 获取收徒首页的今日，汇总会员积分以及收益
function myIndex(param) {
  return httpService.post("Tutor/myIndex", param)
}

//POST Tutor/rankList 获取导师排名
function rankList(param) {
  return httpService.post("Tutor/rankList", param)
}

//POST Tutor/explain 收徒攻略
function explain(param) {
  return httpService.post("Tutor/explain", param)
}

//POST Tutor/prenticePointsList  学员进贡积分列表
function prenticePointsList(param) {
  return httpService.post("Tutor/prenticePointsList", param)
}

//POST Tutor/amountList 学员金额收益表
function amountList(param) {
  return httpService.post("Tutor/amountList", param)
}

//POST Tutor/extractAmount 获取提现列表
function extractAmount(param) {
  return httpService.post("Tutor/extractAmount", param)
}

//POST Tutor/extractAmountConfig 获取提现金额表
function extractAmountConfig(param) {
  return httpService.post("Tutor/extractAmountConfig", param)
}

/**
 * @description:现金提现
 * @param: amount
 * @return:promise
 */
function extractFinance(param) {
  return httpService.post("Tutor/extractFinance", param)
}

//POST Tutor/totalAmount 用户累计收徒收益
function totalAmount(param) {
  return httpService.post("Tutor/totalAmount", param)
}

//POST Tutor/totalExtractAmount 用户提现轮播表
function totalExtractAmount(param) {
  return httpService.post("Tutor/totalExtractAmount", param)
}

module.exports = {
  myIndex,
  rankList,
  explain,
  amountList,
  extractAmount,
  extractAmountConfig,
  prenticePointsList,
  extractFinance,
  totalAmount,
  totalExtractAmount
}