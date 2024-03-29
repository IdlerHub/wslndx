/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 10:11:55
 */
import {
  promisifyAll
} from "miniprogram-api-promise";
const wxp = {};
let noNext = 0;
import store from "../store";
promisifyAll(wx, wxp);

import md5 from "./md5.js";
//验证code
function handle(req, res) {
  // getApp().fundebug.notifyHttpError(req, res);
  switch (res.statusCode || res.status) {
    case 401:
      if (res.data.msg == 'Account is locked') {
        if (noNext) return
        noNext = 1
        wx.showModal({
          content: '由于您近期有违规操作已被限制使用该程序，如有疑问请联系客服为您解答',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return
      }
      wx.clearStorage();
      getApp().wxLogin();
      break;
    case 404:
      wx.showToast({
        title: "找不到资源",
        icon: "none",
        duration: 2000
      });
      break;
    case 500:
      wx.showToast({
        title: "系统正在维护，请稍后重试",
        icon: "none",
        duration: 2000
      });
      break;
    default:
  }
  switch (res.data.code) {
    case -1:
      // 重新登录
      wx.clearStorage();
      getApp()
        .wxLogin()
        .then(() => {
          wx.startPullDownRefresh();
        });
      break;
  }

}

function xhr(path, method, param = {}, noToken, checkAPI) {
  wx.showNavigationBarLoading();
  let header = {}
  //是否需要登录信息才能请求
  if (!noToken) {
    let token = wx.getStorageSync("token");
    // return Promise.reject("请登录后再请求");
    if (token) {
      // param.uid = wx.getStorageSync("uid");
      param.timestamp = parseInt(new Date().getTime() / 1000 + "");
      header['Authorization'] = checkAPI ? token : "Bearer " + token
    }
  }
  let req = {
    method: method,
    data: param || {},
    url: checkAPI ? getApp().API_URLBASECHECK + path : getApp().API_URL + path,
    header: header || {}
  };

  return new Promise((resolve, reject) => {
    wx.request({
      ...req,
      success(res) {
        if (res.statusCode == 200 && res['data'] && (res['data']['code'] == 1 || res['data']['code'] == 200) || res.code == 200) {
          resolve(res.data);
        } else if (res['data']['code'] == 110) {
          store.setState({
            blackShow: true
          })
          return
        } else {
          handle(req, res);
          reject(res['data']);
        }
      },
      fail(err) {
        if (!err.statusCode) {
          wx.showToast({
            title: '网络错误请退出小程序重试',
            icon: "none"
          })
          return
        }
        handle(req, err);
        reject(err);
      },
      complete() {
        wx.hideNavigationBarLoading();
      }
    });
  });
}

// post
function post(path, param = {}, noToken, checkAPI) {
  return xhr(path, "POST", param, noToken, checkAPI);
}
// delete
function del(path, param = {}, noToken, type, header) {
  return xhr(path, "DELETE", param, noToken);
}

//文件上传
function upload(path, file, noLoading, header) {
  wx.showNavigationBarLoading();
  let url = getApp().API_URL + path;
  if (!noLoading) {
    wx.showLoading({
      title: "上传中",
      mask: true
    });
  }
  let req = {
    url: url,
    filePath: file,
    header: {
      "content-type": "application/json"
    },
    name: "file",
    formData: {}
  };
  return wxp.uploadFile(req).then(
    function (res) {
      handle(req, res);
      if (!noLoading) wx.hideLoading();
      wx.hideNavigationBarLoading();
      return res.data;
    },
    function (res) {
      handle(req, res);
      if (!noLoading) wx.hideLoading();
      wx.hideNavigationBarLoading();
      return res;
    }
  );
}

module.exports = {
  post: post,
  del: del,
  upload: upload,
  wxp: wxp
};