var httpService = require('../utils/service.js');

//POST User/wxlogin 微信登录
function wxlogin(param, successFn, failFn) {
    console.log('wx.login')
    httpService.post('User/wxlogin', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    }, true);
}

//POST user/profile 更新用户资料
function profile(param, successFn, failFn) {
    httpService.post('User/profile', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST User/collect 收藏课程
function collect(param, successFn, failFn) {
    httpService.post('User/collect', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}
//POST User/history 学习历史
function history(param, successFn, failFn) {
    httpService.post('User/history', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST area/search 搜索地址和大学
function search(param, successFn, failFn) {
    httpService.post('area/search', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

module.exports = {
    wxlogin: wxlogin,
    collect: collect,
    history: history,
    search: search,
    profile: profile,
}