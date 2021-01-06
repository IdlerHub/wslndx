var httpService = require("../utils/service.js");

/**
 * @description: 首页banner
 * @param {}
 * @return:  promise
 * **/
function getBannerList(params) {
  return httpService.post("index/getBannerList", params, null, true);
}

/**
 * @description: 入门推荐温故知新
 * @param {}
 * @return:  promise
 * **/
function interestList(params) {
  return httpService.post("index/interestList", params, null, true);
}

/**
 * @description: 获取分类信息
 * @param {}
 * @return:  promise
 * **/
function getAllCategory(params) {
  return httpService.post("index/getAllCategory", params, null, true);
}

/**
 * @description: 根据分类获取课程和直播专栏列表(全部课程)
 * @param {categoryId, pageSize, pageNum, requestTime} 二级分类ID - 分页大小 - 当前页码 - 第一页请求时间（秒）解决下拉分页数据重复问题
 * @return:  promise
 * **/
function categoryLessonOrLive(params) {
  return httpService.post("index/categoryLessonOrLive", params, null, true);
}

/**
 * @description: 学校列表
 * @param { pageSize, pageNum, requestTime} 分页大小 - 当前页码 - 第一页请求时间（秒）解决下拉分页数据重复问题
 * @return:  promise
 * **/
function getSchollList(params) {
  return httpService.post("university/getList", params, null, true);
}

/**
 * @description: 根据分类查找课程
 * @param { categoryId, universityId, pageSize, pageNum, requestTime} 分类ID - 学校ID - 分页大小 - 当前页码 - 第一页请求时间（秒）解决下拉分页数据重复问题
 * @return:  promise
 * **/
function categoryLesson(params) {
  return httpService.post("university/categoryLesson", params, null, true);
}

/**
 * @description: 用户收藏课程分类
 * @param { categoryStr } 
 * @return:  promise
 * **/
function collectLessonCategory(params) {
  return httpService.post("index/collectLessonCategory", params, null, true);
}

/**
 * @description: 首页搜索获取热门搜索标签
 * @param {  } 
 * @return:  promise
 * **/
function getHotSearchLabel(params) {
  return httpService.post("index/getHotSearchLabel", params, null, true);
}


/**
 * @description: searchLessonAndColumn
 * @param { type, universityId, keyword } 
 * @return:  promise
 * **/
function searchLessonAndColumn(params) {
  return httpService.post("index/searchLessonAndColumn", params, null, true);
}

/**
 * @description: searchLessonAndColumn
 * @param { type, keyword } 
 * @return:  promise
 * **/
function addSearchLabel(params) {
  return httpService.post("index/addSearchLabel", params, null, true);
}

/**
 * @description: 高校讲师列表
 * @param { } 
 * @return:  promise
 * **/
function lecturerList(params) {
  return httpService.post("university/lecturer/list", params, null, true);
}

/**
 * @description: 搜索学校
 * @param { } 
 * @return:  promise
 * **/
function universitySearchList(params) {
  return httpService.post("university/searchList", params, null, true);
}

/**
 * @description: 在线课程详情
 * @param { lessonId } 
 * @return:  promise
 * **/
function lessonInfo(params) {
  return httpService.post("lesson/info", params, null, true);
}

/**
 * @description: 在线课程获取课程子列表
 * @param { lessonId } 
 * @return:  promise
 * **/
function lessonSublessonList(params) {
  return httpService.post("lesson/sublessonList", params, null, true);
}

/**
 * @description: 在线课程播放记录增加
 * @param { lessonId } 
 * @return:  promise
 * **/
function recordAdd(params) {
  return httpService.post("study/center/add/record", params, null, true);
}

/**
 * @description: 在线课程播放完成记录
 * @param { lessonId } 
 * @return:  promise
 * **/
function recordFinish(params) {
  return httpService.post("lesson/record/finish", params, null, true);
}

/**
 * @description: 统计空中课堂和直播
 * @param { } 
 * @return:  promise
 * **/
function countVideo(params) {
  return httpService.post("live/count/video", params, null, true);
}

/**
 * @description: 获取高校详情
 * @param { id } 
 * @return:  promise
 * **/
function getUniversityInfo(params) {
  return httpService.post("university/getUniversityInfo", params, null, true);
}

/**
 * @description: 搜索高校在线课程
 * @param { keyword } 
 * @return:  promise
 * **/
function searchLessonList(params) {
  return httpService.post("lesson/searchLessonList", params, null, 2);
}

module.exports = {
  getBannerList,
  interestList,
  getAllCategory,
  categoryLessonOrLive,
  getSchollList,
  categoryLesson,
  collectLessonCategory,
  getHotSearchLabel,
  searchLessonAndColumn,
  addSearchLabel,
  lecturerList,
  universitySearchList,
  lessonInfo,
  lessonSublessonList,
  recordAdd,
  recordFinish,
  countVideo,
  getUniversityInfo,
  searchLessonList
}