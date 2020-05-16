var httpService = require("../utils/service.js")

//POST Classroom/recommend 微课堂推荐列表
function recommend(param) {
  return httpService.post("Classroom/recommend", param)
}

//POST Classroom/detail 微课堂视频详情
function detail(param) {
  return httpService.post("Classroom/detail", param)
}

//POST Classroom/category 微课堂分类
function category() {
  return httpService.post("Classroom/category", "", true)
}

//POST Classroom/lessons 筛选课程
function lessons(param) {
  return httpService.post("Classroom/lessons", param)
}

//POST Classroom/recordAdd 添加播放记录课程
function recordAdd(param) {
  return httpService.post("Classroom/recordAdd", param)
}

//POST Classroom/collect 收藏视频
function collect(param) {
  return httpService.post("Classroom/collect", param)
}

//POST Classroom/collectCancel 取消收藏视频
function collectCancel(param) {
  return httpService.del("Classroom/collectCancel", param)
}

/**
 * @description: 分享课程
 * @param {*}
 * @return: promise
 */
function share(param) {
  return httpService.post("classroom/share", param)
}

//POST Classroom/banner 获取广告配置
function banner(param) {
  return httpService.post("Classroom/banner", param)
}

//POST Classroom/banner 获取早报
function paper(param) {
  return httpService.post("Classroom/paper", param)
}

//POST Classroom/addComment 课程评论
function addComment(param) {
  return httpService.post("Classroom/addComment", param)
}

//POST Classroom/addReply 课程回复添加
function addReply(param) {
  return httpService.post("Classroom/addReply", param)
}

//POST Classroom/CommentDetail 课程评论详情
function commentDetail(param) {
  return httpService.post("Classroom/CommentDetail", param)
}

//POST Classroom/delComment 课程评论删除
function delComment(param) {
  return httpService.post("Classroom/delComment", param)
}

//POST Classroom/delReply 课程回复删除
function delReply(param) {
  return httpService.post("Classroom/delReply", param)
}

//POST Classroom/replyList 课程回复页展示
function replyList(param) {
  return httpService.post("Classroom/replyList", param)
}

//POST Classroom/sublessonfinish 课程回复页展示
function sublessonfinish(param) {
  return httpService.post("Classroom/sublessonfinish", param)
}

//POST Classroom/sublessons 课程回复页展示
function sublessons(param) {
  return httpService.post("Classroom/sublessons", param)
}

//POST Classroom/search 课程搜索
function lessSearch(param) {
  return httpService.post("Classroom/search", param)
}

//POST Classroom/updateProgress 更新课程播放进度
function updateProgress(param) {
  return httpService.post("Classroom/updateProgress", param)
}

module.exports = {
  recommend,
  detail,
  category,
  lessons,
  recordAdd,
  collect,
  collectCancel,
  share,
  banner,
  paper,
  addReply,
  addComment,
  commentDetail,
  delComment,
  delReply,
  replyList,
  sublessonfinish,
  sublessons,
  lessSearch,
  updateProgress
}
