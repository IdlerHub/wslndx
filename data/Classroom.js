var httpService = require('../utils/service.js');

//POST Classroom/recommend 微课堂推荐列表
function recommend(param) {
    return httpService.post('Classroom/recommend', param, true);
}

//POST Classroom/detail 微课堂视频详情
function detail(param) {
    return httpService.post('Classroom/detail', param);
}

//POST Classroom/category 微课堂分类
function category() {
    return httpService.post('Classroom/category', '', true);
}

//POST Classroom/lessons 筛选课程
function lessons(param) {
    return httpService.post('Classroom/lessons', param, true);
}

//POST Classroom/recordAdd 添加播放记录课程
function recordAdd(param) {
    return httpService.post('Classroom/recordAdd', param);
}

//POST Classroom/collect 收藏视频
function collect(param) {
    return httpService.post('Classroom/collect', param);
}

//POST Classroom/collectCancel 取消收藏视频
function collectCancel(param) {
    return httpService.del('Classroom/collectCancel', param);
}

module.exports = {
    recommend: recommend,
    detail: detail,
    category: category,
    lessons: lessons,
    recordAdd: recordAdd,
    collect: collect,
    collectCancel: collectCancel
}