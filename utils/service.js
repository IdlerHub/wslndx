//配置
const content_type = [
    'application/json',
    'application/x-www-form-urlencoded'
];
let header = {
    'content-type': content_type[0]
};

//验证code
function handle(res) {
    switch (res.statusCode) {
        case 401:
            wx.clearStorage();
            getApp().wxLogin();
            /*   wx.showModal({
                  title: '',
                  content: '当前身份已过期',
                  showCancel: false,
                  success: function(val) {
                      if (val.confirm) {
                          wx.reLaunch({ url: '/pages/index/index' });
                      }
                  }
              }); */
            break;
        case 404:
            wx.showToast({
                title: '找不到资源',
                icon: 'none',
                duration: 2000
            });
            break;
        case 500:
            wx.showToast({
                title: '服务器出错',
                icon: 'none',
                duration: 2000
            });
            break;
        default:
    }
    switch (res.data.code) {
        case -1:
            // 重新登录
            wx.clearStorage();
            getApp().wxLogin();
            break;
    }
};

// post  return  promise
function post(path, param = {}, noToken, type) {
    let url = getApp().API_URL + path;
    if (!noToken) {
        let token = wx.getStorageSync('token');
        if (!token) return;
        param.uid = wx.getStorageSync('uid');
        param.timestamp = parseInt(new Date().getTime() / 1000 + '');
        param.sign = getApp().md5('uid=' + param.uid + '&token=' + token + '&timestamp=' + param.timestamp);
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    return wx.pro.request({
        method: 'POST',
        header: header,
        data: param || {},
        url: url
    }).then(function(res) {
        handle(res);
        return res.data;
    }, function(res) {
        return res.data;
    })
}

// delete
function del(path, param, noToken, type) {
    let url = getApp().API_URL + path;
    if (!noToken) {
        let token = wx.getStorageSync('token');
        if (!token) return;
        param.uid = wx.getStorageSync('uid');
        param.timestamp = parseInt(new Date().getTime() / 1000 + '');
        param.sign = getApp().md5('uid=' + param.uid + '&token=' + token + '&timestamp=' + param.timestamp);
    }
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    return wx.pro.request({
        method: 'DELETE',
        header: header,
        url: url,
        data: param || {}
    }).then(function(res) {
        handle(res);
        return res.data;
    }, function(res) {
        return res.data;
    })
}

//文件上传
function upload(path, file, noLoading) {
    let url = getApp().API_URL + path;
    if (!noLoading) {
        wx.showLoading({
            title: '上传中',
        });
    }

    return wx.pro.uploadFile({
        url: url,
        filePath: file,
        header: header,
        name: 'file',
        formData: {}
    }).then(function(res) {
        if (!noLoading) wx.hideLoading();
        handle(res);
        return res.data;
    }, function(res) {
        return res.data;
    })
}

//没有登录post
// post
function noLoginPost(path, param, noToken, type) {
    let url = getApp().API_URL + path;
    if (type) {
        header['content-type'] = content_type[type];
    } else {
        header['content-type'] = content_type[0];
    }
    return wx.pro.request({
        method: 'POST',
        header: header,
        data: param || {},
        url: url
    }).then(function(res) {
        handle(res);
        return res.data;
    }, function(res) {
        return res.data;
    })
}

module.exports = {
    post: post,
    del: del,
    upload: upload,
    noLoginPost: noLoginPost
}