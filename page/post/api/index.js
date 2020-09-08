var httpService = require("../../../utils/service.js")

// POST bokeblog/searchWord 获取博客搜索信息
function searchWord() {
  return httpService.post("bokeblog/searchWord")
}

module.exports = {
  searchWord
}