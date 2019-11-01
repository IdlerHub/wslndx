/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-10 10:45:27
 */
var httpService = require("../utils/service.js")

// POST Friendscircle/index 获取所有学友圈集合
function allCircles() {
  return httpService.post("Friendscircle/indexs")
}

// POST Friendscircle/joined 获取加入的学友圈集合
function joinedCircles() {
  return httpService.post("Friendscircle/joined")
}

//POST Friendscircle/index 获取未加的学友圈集合
function noJoinCircles() {
  return httpService.post("Friendscircle/index")
}

//POST Userfriendscircle/add 加入学友圈
function join(param) {
  return httpService.post("Userfriendscircle/add", param)
}

//POST Userfriendscircle/add 取消加圈
function cancelJoin(param) {
  return httpService.post("Friendscircle/cancel", param)
}

//POST bokeblog/add 发布帖子
function add(param) {
  return httpService.post("bokeblog/add", param)
}

//POST bokeblog/index 获取学友圈最新动态
function news(param) {
  return httpService.post("bokeblog/index", param)
}

//POST Userfriendscircle/index 获取某个圈的成员
function member(param) {
  return httpService.post("Userfriendscircle/index", param)
}

//POST bokeblog/index 学友圈某个动态详情
function detail(param) {
  return httpService.post("bokeblog/index", param)
}

//POST Bokecomments/index 获取评论
function getComment(param) {
  return httpService.post("Bokecomments/index", param)
}

//删除评论
function delComment(param) {
  return httpService.post("Bokecomments/del", param)
}

//POST Bokelikes/index 获取点赞
function getPraise(param) {
  return httpService.post("Bokelikes/index", param)
}

//POST Bokelikes/add 点赞
function praise(param) {
  return httpService.post("Bokelikes/add", param)
}

//POST Bokelikes/del 取消点赞
function delPraise(param) {
  return httpService.post("Bokelikes/del", param)
}

//POST Bokecomments/add 发布评论
function comment(param) {
  return httpService.post("Bokecomments/add", param)
}

/**
 * @description: 回复评论 （二级评论）
 * @param {blog_id ,comment_id ,reply_type ,reply_id ,reply_content ,to_user }
 * @return: promise
 */
function reply(param) {
  return httpService.post("Bokereply/add", param)
}

/**
 * @description:删除回复 （二级评论）
 * @param { blog_id , comment_id  , id }
 * @return:promise
 */
function replydel(param) {
  return httpService.post("Bokereply/del", param)
}
/**
 * @description: 评论详情
 * @param {blog_id , comment_id }
 * @return:promise
 */
function replyDetail(param) {
  return httpService.post("Bokereply/index", param)
}

//POST bokeblog/del  删除我的最新动态
function delPost(param) {
  return httpService.post("bokeblog/del", param)
}

//POST upload/upload 文件上传
function upload(file, type, noLoading) {
  return httpService.upload("upload/upload?media_type=" + type, file, noLoading)
}

//获取圈子信息
function fsinfo(param) {
  return httpService.post("Bokeblog/fsinfo", param)
}

/**
 * 博客转发
 * @param { * } param     博客id必填项
 */
function addForward(param) {
  return httpService.post("bokeforward/add", param)
}

/* 博客通知列表 */
function getMessage(param) {
  return httpService.post("Bokeblog/blogMessageList", param)
}

/* 收藏博客 */
function collect(param) {
  return httpService.post("Bokeblog/collect", param)
}

module.exports = {
  allCircles,
  noJoinCircles,
  joinedCircles,
  join,
  cancelJoin,
  add,
  news,
  detail,
  getPraise,
  getComment,
  praise,
  delPraise,
  member,
  comment,
  reply,
  replydel,
  replyDetail,
  delPost,
  upload,
  fsinfo,
  delComment,
  addForward,
  getMessage,
  collect
}
