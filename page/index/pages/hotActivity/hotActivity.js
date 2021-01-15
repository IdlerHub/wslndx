// page/index/pages/hotActivity/hotActivity.js
const app = getApp()
Page({
  data: {
    current: 0,
    swiperList: [],
    activityList: []
  },
  onLoad: function (options) {},
  onShow: function () {
    Promise.all([this.getHost(), this.getHostbanner()])
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  centerTab(e) {
    this.setData({
      current: e.detail.current
    })
  },
  getHost() {
    app.activity.hots({page_size: 100}).then(res => {
      this.setData({
        activityList: res.data
      })
    })
  },
  getHostbanner() {
    app.activity.bannerList().then(res => {
      this.setData({
        swiperList: res.data
      })
    })
  },
  bannerGo(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item)
    if (item.is_finish) return
    let login = item.is_login > 0 ? 1 : 0
    if (item.jump_type == 1) {
      /* 外链 */
      wx.navigateTo({
        url: `/pages/education/education?type=0&url=${item.extra.url}&login=${login}`
      })
    } else if (item.jump_type == 0) {
      /* 视频 */
      wx.navigateTo({
        url: item.extra.url
      })
    } else if (item.jump_type == 3) {
      this.minigo(item.extra.url || '', item.extra.wechat_app_id)
    } else {
      /* 文章 */
      wx.navigateTo({
        url: item.extra.url
      })
    }
  },
  minigo(url, appId) {
    wx.navigateToMiniProgram({
      appId: appId,
      path: url,
      // envVersion: 'trial',
    })
  },
  onGotUserInfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.updateBase(e)
      let item = e.currentTarget.dataset.item;
      setTimeout(() => {
        wx.navigateTo({
          url: `/pages/education/education?url=${item.extra.url}&type=1`
        })
      }, 500);

    }
  },
})