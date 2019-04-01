var httpService = require('../utils/service.js');

// POST Friendscircle/index 获取所有学友圈集合
function allCircles(successFn, failFn) {
    httpService.post('Friendscircle/indexs', {}, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

// POST Friendscircle/joined 获取加入的学友圈集合
function joinedCircles(successFn, failFn) {
    httpService.post('Friendscircle/joined', {}, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Friendscircle/index 获取未加的学友圈集合
function noJoinCircles(successFn, failFn) {
    httpService.post('Friendscircle/index', {}, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Userfriendscircle/add 加入学友圈
function join(param, successFn, failFn) {
    httpService.post('Userfriendscircle/add', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Userfriendscircle/add 取消加圈
function cancelJoin(param, successFn, failFn) {
    httpService.post('Friendscircle/cancel', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST bokeblog/add 发布帖子
function add(param, successFn, failFn) {
    httpService.post('bokeblog/add', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST bokeblog/index 获取学友圈最新动态
function news(param, successFn, failFn) {
    httpService.post('bokeblog/index', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Userfriendscircle/index 获取某个圈的成员
function member(param, successFn, failFn) {
    httpService.post('Userfriendscircle/index', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST bokeblog/index 学友圈某个动态详情
function detail(param, successFn, failFn) {
    httpService.post('bokeblog/index', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Bokecomments/index 获取评论
function getComment(param, successFn, failFn) {
    httpService.post('Bokecomments/index', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//删除评论
function delComment(param, successFn, failFn) {
    httpService.post('Bokecomments/del', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Bokelikes/index 获取点赞
function getPraise(param, successFn, failFn) {
    httpService.post('Bokelikes/index', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}


//POST Bokelikes/add 点赞
function praise(param, successFn, failFn) {
    httpService.post('Bokelikes/add', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Bokelikes/del 取消点赞
function delPraise(param, successFn, failFn) {
    httpService.post('Bokelikes/del', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST Bokecomments/add 发布评论
function comment(param, successFn, failFn) {
    httpService.post('Bokecomments/add', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST bokeblog/del  删除我的最新动态
function delPost(param, successFn, failFn) {
    httpService.post('bokeblog/del', param, function(data) {
        if (successFn) {
            successFn(data);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    });
}

//POST upload/upload 文件上传
function upload(file, type, successFn, failFn, noloading) {
    httpService.upload('upload/upload?media_type=' + type, file, function(data, uploadTask) {
        if (successFn) {
            successFn(data, uploadTask);
        }
    }, function(err) {
        if (failFn) {
            failFn(err);
        }
    }, noloading);
}

//获取圈子信息
function fsinfo(param, successFn, failFn) {
    httpService.post('Bokeblog/fsinfo', param, function(data) {
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
    allCircles: allCircles,
    noJoinCircles: noJoinCircles,
    joinedCircles: joinedCircles,
    join: join,
    cancelJoin: cancelJoin,
    add: add,
    news: news,
    detail: detail,
    getPraise: getPraise,
    getComment: getComment,
    praise: praise,
    delPraise: delPraise,
    member: member,
    comment: comment,
    delPost: delPost,
    upload: upload,
    fsinfo: fsinfo,
    delComment: delComment
}