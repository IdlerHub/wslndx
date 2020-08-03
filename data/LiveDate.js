/*
 * @Date: 2020-08-03 10:45:14
 * @LastEditors: zxk
 */
var httpService = require("../utils/service.js");

/** 
 *  @description: 获取直播课程列表
 * @param 
 * @return:  promise
 * **/
function getLiveLessons() {
  return httpService.get("schedule/lessons");
}

module.exports = {
  getLiveLessons,
};