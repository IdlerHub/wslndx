var httpService = require('../utils/service.js');

//POST User/wxlogin 微信登录
function wxLoginCode(param) {
    console.log('wx.login');
    return httpService.post('User/wxlogin', param, true);
}

//POST user/profile 更新用户资料
function profile(param) {
    return httpService.post('User/profile', param);
}

//POST User/collect 收藏课程
function collect(param) {
    return httpService.post('User/collect', param);
}

//POST User/history 学习历史
function history(param) {
    return httpService.post('User/history', param);
}

//POST area/search 搜索地址和大学
function search(param) {
    return httpService.post('area/search', param);
}

module.exports = {
    wxLoginCode: wxLoginCode,
    collect: collect,
    history: history,
    search: search,
    profile: profile,
}