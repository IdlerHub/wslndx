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
    hot_total: 0,
    charity_total: 0,
    mpurl: '',
    charity: {},
    nomore: 0,
    pagecount: 1,
    isLoadInterface: false,
    showTopTitle: false
  },
  common: {
    scrollTop_1: 190, //热门
    scrollTop_2: 170 //公益
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
      topT: 30
    }) :
    this.setData({
      topT: 50
    });
    this.params = {
      pageSize: 10,
      pageNum: 1,
      id: ''
    }
    options.str ? this.setData({
      charity: JSON.parse(options.str)
    }): ''
    this.params.id = options.str ? JSON.parse(options.str).id : ''
  },
  onShow: function () {
    let req = Promise.all([this.getNextIssueNotice(), this.getCharityLessonList()]);
    this.data.name=='热门'? this.getHotLessonList(): req
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {
    if (!this.data.isLoadInterface) { //防止在接口未执行完再次调用接口
      console.log(this.params.pageNum * 1 + 1)
      if (this.params.pageNum * 1 + 1 <= this.data.pagecount) {
        this.setData({
          isLoadInterface: true
        })
        this.params.pageNum = this.params.pageNum * 1 + 1
        this.data.name=='热门'? this.getHotLessonList():this.getCharityLessonList();
      } else {
        //如果大于总页数停止请求数据
        this.setData({
          nomore: 1
        })
      }
    }
  },
  onPageScroll: function(e) {
    if (this.data.name == '热门') {
      e.scrollTop >= this.common.scrollTop_1? this.setData({showTopTitle:true}):this.setData({showTopTitle:false})
    } else {
      e.scrollTop >= this.common.scrollTop_2? this.setData({showTopTitle:true}):this.setData({showTopTitle:false})
    }
  },
  goback() {
    wx.navigateBack({ delta: 1 })
  },
  // bindscrolltolower(e) {
    // this.params.pageNum += 1
    // this.data.name=='热门'? this.getHotLessonList():this.getCharityLessonList()
  // },
  goEducation() {
    if (this.data.mpurl) {
      wx.navigateTo({
        url: `/pages/education/education?type=1&url=${this.data.mpurl}`
      })
    } else {
      wx.showToast({
        title: "暂无下期预告",
        icon: "none",
        duration: 2000,
      });
    }
  },
  getCharityLessonList() {
    app.lessonNew.semesterColumnList(this.params).then((res) => {
      this.setData({
        charity_total: res.total,
        pagecount: Math.ceil(res.total / 10)
      });
      if (this.params.pageNum == 1) {
        this.setData({
          charityLessonList: res.dataList,
          isLoadInterface: false
        })
      } else {
        this.setData({
          charityLessonList: [...this.data.charityLessonList, ...res.dataList],
          isLoadInterface: false
        })
      }
    });
  },
  getNextIssueNotice() {
    app.lessonNew.getNextIssueNotice().then(res => {
      res.data && res.data.value ? this.setData({ mpurl: res.data.value }) : ''
    })
  },
  goAllLesson() {
    wx.navigateTo({
      url: '../allLesson/allLesson'
    })
  },
  getHotLessonList() {
    app.lessonNew.hallGetColumnList(this.params).then((res) => {
      this.setData({
        hot_total: res.total,
        pagecount: Math.ceil(res.total / 10)
      });
      if (this.params.pageNum == 1) {
        this.setData({
          hotLessonList: res.dataList,
          isLoadInterface: false
        })
      } else {
        this.setData({
          hotLessonList: [...this.data.hotLessonList, ...res.dataList],
          isLoadInterface: false
        })
      }
    });
  },
  bannerGo(e) {
    let item = e.currentTarget.dataset.item;
    console.log(item);
    this.data.name=='热门'? 
    app.liveAddStatus(item.columnId, item.isCharge, item.id):
    app.liveAddStatus(item.id, item.isCharge)
    // if (item.is_finish) return;
    // let login = item.is_login > 0 ? 1 : 0;
    // if (item.jump_type == 1) {
    //   /* 外链 */
    //   wx.navigateTo({
    //     url: `/pages/education/education?type=0&url=${item.extra.url}&login=${login}`,
    //   });
    // } else if (item.jump_type == 0) {
    //   /* 视频 */
    //   wx.navigateTo({
    //     url: item.extra.url,
    //   });
    // } else if (item.jump_type == 3) {
    //   this.minigo(item.extra.url || "", item.extra.wechat_app_id);
    // } else {
    //   /* 文章 */
    //   wx.navigateTo({
    //     url: item.extra.url,
    //   });
    // }
  },
  minigo(url, appId) {
    wx.navigateToMiniProgram({
      appId: appId,
      path: url,
      // envVersion: 'trial',
    });
  }
});
