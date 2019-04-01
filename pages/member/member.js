//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    IMG_URL: app.IMG_URL,
  },
  onLoad(options) {
    var that = this;
    this.param = { fs_id: options.id, page: 1, pageSize: 10 };
    this.setData({
      detail: {
        user:[],
        friendscircle:[]
      }
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getList([]);
  },
  getList(list,callback) {
    var that = this;
    var detail = that.data.detail;
    var list = list ? list : that.data.detail.user;
    wx.showNavigationBarLoading()
    app.circle.member(this.param, function (msg) {
      wx.hideNavigationBarLoading()
      if (msg.code == 1) {
        detail = msg.data;
        msg.data.user.forEach(function (item) {
          list.push(item);
        })
        detail.user = list;
        that.setData({
          detail: detail
        })
      }
      if (callback) {
        callback();
      }
    }, function () { })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.param.page = 1;
    this.getList([],function () {
      wx.stopPullDownRefresh();
    });
  },
  //上拉加载
  onReachBottom() {
    this.param.page++;
    this.getList();
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent('退出', { "name": "学友圈成员页" })
  }
})
