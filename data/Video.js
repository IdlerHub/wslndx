var httpService = require('../utils/service.js');

//POST Shortvideo/lists 获取短视频列表
function list(param, successFn, failFn, from) {
    if (from) {
        //POST shortvideo/nologinlists 从分享获取短视频列表
        httpService.nologinpost('shortvideo/nologinlists', param, function(data) {
            if (successFn) {
                successFn(data);
            }
        }, function(err) {
            if (failFn) {
                failFn(err);
            }
        });
    } else {
        httpService.post('Shortvideo/lists', param, function(data) {
            if (successFn) {
                successFn(data);
            }
        }, function(err) {
            if (failFn) {
                failFn(err);
            }
        });
    }

}


//POST Shortvideo/praise 点赞
function praise(param, successFn, failFn) {
    httpService.post('Shortvideo/praise', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Shortvideo/praiseCancel 取消点赞
function delPraise(param, successFn, failFn) {
    httpService.post('Shortvideo/praiseCancel', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Shortvideo/forward 分享
function share(param, successFn, failFn) {
    httpService.post('Shortvideo/forward', param, function(data) {
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
    list: list,
    praise: praise,
    delPraise: delPraise,
    share: share

}