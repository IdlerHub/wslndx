/*
 * @Author: wjl
 * @Date: 2021-01-13 18:20:33
 * @LastEditors: wjl
 * @LastEditTime: 2021-01-15 16:29:17
 * @FilePath: \wslndx\page\index\pages\hotActivity\hotActivity.js
 */
// page/index/pages/hotActivity/hotActivity.js
const app = getApp();
Page({
  data: {
    name: '',
    current: 0,
    hotLessonList: [],
    charityLessonList: [],
    params: {
      pageSize: 10,
      pageNum: 1
    }
  },
  onLoad: function (options) {
    this.setData({name: options.name})
    let reg = /ios/i
    let pt = 20 //导航状态栏上内边距
    let h = 44 //导航状态栏高度
    let systemInfo = wx.getSystemInfoSync()
    pt = systemInfo.statusBarHeight
    if (!reg.test(systemInfo.system)) {
      h = 48
    }
    systemInfo.statusBarHeight < 30 ?
    this.setData({
      topT: 70
    }) :
    this.setData({
      topT: 100
    });
  },
  onShow: function () {
    // Promise.all([this.getHost(), this.getHostbanner()]);
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  goback() {
    wx.navigateBack({ delta: 1 })
  },
  bindscrolltolower() {
    this.params.pageNum += 1
    // this.getLesson()
  },
  // getHost() {
  //   app.activity.hots({ page_size: 100 }).then((res) => {
  //     this.setData({
  //       charityLessonList: res.data,
  //     });
  //   });
  // },
  getHotLessonList() {
    app.activity.bannerList().then((res) => {
      this.setData({
        hotLessonList: res.data,
      });
    });
  },
  bannerGo(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    if (item.is_finish) return;
    let login = item.is_login > 0 ? 1 : 0;
    if (item.jump_type == 1) {
      /* 外链 */
      wx.navigateTo({
        url: `/pages/education/education?type=0&url=${item.extra.url}&login=${login}`,
      });
    } else if (item.jump_type == 0) {
      /* 视频 */
      wx.navigateTo({
        url: item.extra.url,
      });
    } else if (item.jump_type == 3) {
      this.minigo(item.extra.url || "", item.extra.wechat_app_id);
    } else {
      /* 文章 */
      wx.navigateTo({
        url: item.extra.url,
      });
    }
  },
  minigo(url, appId) {
    wx.navigateToMiniProgram({
      appId: appId,
      path: url,
      // envVersion: 'trial',
    });
  }
});
