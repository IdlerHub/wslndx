//配置
var content_type = [
    'application/json',
    'application/x-www-form-urlencoded'
];
var header = {
    'content-type': content_type[0]
};
//验证code
function handle(res) {
    switch (res.statusCode) {
        case 401:
            wx.showModal({
                title: '',
                content: '当前身份已过期',
                showCancel: false,
                success: function(val) {
                    if (val.confirm) {
                        getApp().wxLogin()
                    }
                }
            })
            break;
        case 404:
            wx.showToast({
                title: '找不到资源',
                icon: 'none',
                duration: 2000
            })
            break;
        case 500:
            wx.showToast({
                title: '服务器出错',
                icon: 'none',
                duration: 2000
            })
            break;
        default:
    }
    switch (res.data.code) {
        case -1:
            // 重新登录
            getApp().wxLogin();
            break;
    }
};

// get
function get(path, param, successFn, failFn, noToken, type) {
    var url = getApp().API_URL + path;
    if (!noToken) {
        var token = wx.getStorageSync('token');
        if (!token) return;
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    wx.request({
        method: 'GET',
        header: header,
        url: url,
        data: param || {},
        success: function(res) {
            handle(res);
            if (successFn) {
                successFn(res.data);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res.data);
            }
        }
    })
}

// post
function post(path, param, successFn, failFn, noToken, type) {
    var url = getApp().API_URL + path;
    if (!noToken) {
        var token = wx.getStorageSync('token');
        if (!token) return;
        param.uid = wx.getStorageSync('uid');
        param.timestamp = parseInt((new Date()).getTime() / 1000);
        param.sign = getApp().md5('uid=' + param.uid + '&token=' + token + '&timestamp=' + param.timestamp);
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    wx.request({
        method: 'POST',
        header: header,
        data: param || {},
        url: url,
        success: function(res) {
            // wx.hideLoading();
            handle(res);
            if (successFn) {
                successFn(res.data);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res.data);
            }
        }
    })
}

// put
function put(path, param, successFn, failFn, noToken, type) {
    var url = getApp().API_URL + path;
    if (!noToken) {
        var token = wx.getStorageSync('token');
        if (!token) return;
        param.uid = wx.getStorageSync('uid');
        param.timestamp = parseInt((new Date()).getTime() / 1000);
        param.sign = getApp().md5('uid=' + param.uid + '&token=' + token + '&timestamp=' + param.timestamp);
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    wx.showLoading({
        title: ''
    })
    wx.request({
        method: 'PUT',
        header: header,
        data: param || {},
        url: url,
        success: function(res) {
            wx.hideLoading();
            handle(res);
            if (successFn) {
                successFn(res.data);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res.data);
            }
        }
    })
}
// delete
function del(path, param, successFn, failFn, noToken, type) {
    var url = getApp().API_URL + path;
    if (!noToken) {
        var token = wx.getStorageSync('token');
        if (!token) return;
        param.uid = wx.getStorageSync('uid');
        param.timestamp = parseInt((new Date()).getTime() / 1000);
        param.sign = getApp().md5('uid=' + param.uid + '&token=' + token + '&timestamp=' + param.timestamp);
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    // wx.showLoading({
    //   title: '',
    // });
    wx.request({
        method: 'DELETE',
        header: header,
        url: url,
        data: param || {},
        success: function(res) {
            // wx.hideLoading(); 
            handle(res);
            if (successFn) {
                successFn(res.data);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res.data);
            }
        }
    })
}

//文件上传
function upload(path, file, successFn, failFn, noloading) {
    var url = getApp().API_URL + path;
    if (!noloading) {
        wx.showLoading({
            title: '上传中',
        });
    }
    const uploadTask = wx.uploadFile({
        url: url,
        filePath: file,
        header: header,
        name: 'file',
        formData: {},
        success: function(res) {
            if (!noloading) wx.hideLoading();
            handle(res);
            if (successFn) {
                successFn(res.data, uploadTask);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res);
            }
        }
    })
}

//没有登录post
// post
function nologinpost(path, param, successFn, failFn, noToken, type) {
    var url = getApp().API_URL + path;
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    wx.request({
        method: 'POST',
        header: header,
        data: param || {},
        url: url,
        success: function(res) {
            // wx.hideLoading();
            handle(res);
            if (successFn) {
                successFn(res.data);
            }
        },
        fail: function(res) {
            if (failFn) {
                failFn(res.data);
            }
        }
    })
}

module.exports = {
    get: get,
    post: post,
    put: put,
    del: del,
    upload: upload,
    nologinpost: nologinpost
}