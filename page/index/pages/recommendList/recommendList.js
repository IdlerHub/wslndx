// page/index/pages/recommendList/recommendList.js
const app = getApp()
Page({
  data: {
    lesson: []
  },
  param: {
    pageNum: 1,
    pageSize: 10,
  },
  pageName: 'recommendList',
  onLoad: function (options) {
    this.param.selectCategoryId = options.str.split(',')
    wx.setNavigationBarTitle({
      title: `${this.data.$state.userInfo.nickname || '定制您'}的专属课单`
    })
    this.getLesson()
  }, 
  getLesson(list) {
    let arr = list || this.data.lesson
    return app.liveData.selectRecommedListByCategoryIds(this.param).then(res => {
      this.setData({
        lesson: arr.concat(res.dataList)
      })
    })
  },
  addStudy(e) {
    app.liveData
      .addSubscribe({
        columnId: e.detail.columnId,
      })
      .then(() => {
        this.data.lesson.forEach((i) => {
          i.columnId == e.detail.columnId ? (i.isEnroll = 1) : "";
        });
        wx.showToast({
          title: "报名成功",
          icon: "none",
        });
        this.setData({
          lesson: this.data.lesson,
        });
        app.subscribeMessage();
      });
  },
  onReachBottom: function () {
    this.param.pageNum ++
    this.getLesson(this.data.lesson)
  }
})