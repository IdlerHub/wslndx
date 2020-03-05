/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-04 17:31:36
 */
import { promisifyAll } from "miniprogram-api-promise";
const wxp = {};
promisifyAll(wx, wxp);

import md5 from "./md5.js";

//验证code
function handle(req, res) {
  getApp().fundebug.notifyHttpError(req, res);
  switch (res.statusCode) {
    case 401:
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

function xhr(path, method, param = {}, noToken) {
  wx.showNavigationBarLoading();
  //是否需要登录信息才能请求
  if (!noToken) {
    let token = wx.getStorageSync("token");
    if (!token) return Promise.reject("请登录后再请求");
    param.uid = wx.getStorageSync("uid");
    param.timestamp = parseInt(new Date().getTime() / 1000 + "");
    param.sign = md5(
      "uid=" + param.uid + "&token=" + token + "&timestamp=" + param.timestamp
    );
  }

  let req = {
    method: method,
    data: param || {},
    url: getApp().API_URL + path
  };

  return new Promise((resolve, reject) => {
    wx.request({
      ...req,
      success(res) {
        if (res.statusCode == 200 && res.data && res.data.code == 1) {
          resolve(res.data);
        } else {
          handle(req, res);
          reject(err);
        }
      },
      fail(err) {
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
function post(path, param = {}, noToken) {
  return xhr(path, "POST", param, noToken);
}

// delete
function del(path, param = {}, noToken, type) {
  return xhr(path, "DELETE", param, noToken);
}

//文件上传
function upload(path, file, noLoading) {
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
    header: header,
    name: "file",
    formData: {}
  };
  return wxp.uploadFile(req).then(
    function(res) {
      handle(req, res);
      if (!noLoading) wx.hideLoading();
      wx.hideNavigationBarLoading();
      return res.data;
    },
    function(res) {
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
