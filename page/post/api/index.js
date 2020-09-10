var httpService = require("../../../utils/service.js")

// POST bokeblog/searchWord 获取博客搜索信息
function searchWord(param) {
  return httpService.post("bokeblog/searchWord", param)
}

// POST bokeblog/search 用户搜索
function search(param) {
  return httpService.post("bokeblog/search", param)
}

//POST User/following 关注用户
function following(param) {
  return httpService.post("User/following", param);
}

//POST Userfriendscircle/addOne 单个加入学有圈
function addOne(param) {
  return httpService.post("Userfriendscircle/addOne", param)
}

module.exports = {
  searchWord,
  search,
  following,
  addOne
}