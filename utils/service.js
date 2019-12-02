/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-12-02 15:30:19
 */
import { promisifyAll } from "miniprogram-api-promise";
const wxp = {};
promisifyAll(wx, wxp);

//配置
const content_type = ["application/json", "application/x-www-form-urlencoded"];
let header = {
  "content-type": content_type[0]
};

//验证code
function handle(res) {
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
        title: "服务器出错",
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

// post  return  promise
function post(path, param = {}, noToken, type) {
  wx.showNavigationBarLoading();
  let url = getApp().API_URL + path;
  if (!noToken) {
    let token = wx.getStorageSync("token");
    if (!token) return;
    param.uid = wx.getStorageSync("uid");
    param.timestamp = parseInt(new Date().getTime() / 1000 + "");
    param.sign = getApp().md5(
      "uid=" + param.uid + "&token=" + token + "&timestamp=" + param.timestamp
    );
  }
  if (type) {
    header["content-type"] = content_type[type];
  } else {
    header["content-type"] = content_type[0];
  }
  return wxp
    .request({
      method: "POST",
      header: header,
      data: param || {},
      url: url
    })
    .then(
      function(res) {
        handle(res);
        return res.data;
      },
      function(res) {
        return res.data;
      }
    )
    .catch(err => {
      throw new Error(error);
    })
    .finally(() => {
      wx.hideNavigationBarLoading();
    });
}

// delete
function del(path, param, noToken, type) {
  wx.showNavigationBarLoading();
  let url = getApp().API_URL + path;
  if (!noToken) {
    let token = wx.getStorageSync("token");
    if (!token) return;
    param.uid = wx.getStorageSync("uid");
    param.timestamp = parseInt(new Date().getTime() / 1000 + "");
    param.sign = getApp().md5(
      "uid=" + param.uid + "&token=" + token + "&timestamp=" + param.timestamp
    );
  }
  if (type) {
    header["content-type"] = content_type[type];
  } else {
    header["content-type"] = content_type[0];
  }
  return wxp
    .request({
      method: "DELETE",
      header: header,
      url: url,
      data: param || {}
    })
    .then(
      function(res) {
        handle(res);
        return res.data;
      },
      function(res) {
        return res.data;
      }
    )
    .finally(() => {
      wx.hideNavigationBarLoading();
    });
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

  return wxp
    .uploadFile({
      url: url,
      filePath: file,
      header: header,
      name: "file",
      formData: {}
    })
    .then(
      function(res) {
        handle(res);
        return res.data;
      },
      function(res) {
        return res;
      }
    )
    .finally(() => {
      if (!noLoading) wx.hideLoading();
      wx.hideNavigationBarLoading();
    });
}

module.exports = {
  post: post,
  del: del,
  upload: upload,
  wxp: wxp
};
