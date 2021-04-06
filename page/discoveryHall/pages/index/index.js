// page/discoveryHall/pages/index/index.js
const app = getApp()
Page({
  data: {
    showOverlay: false,
    overlayType: 0,
    stepsList: [],
    opusList: [],
    lessonList: []
  },
  onLoad: function (options) {
    Promise.all([this.getStepList(), this.hallGetOpus(), this.hallGetColumnList(), this.hallGgetContentInfo()])
    app.globalData.scorePage = true
  },
  onShow: function () {
    this.getStepList()
  },
  onUnload() {
    app.globalData.scorePage = false
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      return {
        title: '新生体验营',
        path: "/page/discoveryHall/pages/index/index?type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  // 获取优秀作品
  hallGetOpus() {
    app.activity.hallGetOpus({
      pageSize: 6,
      pageNum: 1
    }).then(res => {
      this.setData({
        opusList: res.dataList
      })
    })
  },
  // 规则显示隐藏
  onClickHid(e) {
    this.setData({
      showOverlay: !this.data.showOverlay,
      overlayType: Number(e.currentTarget.dataset.type)
    })
  },
  getStepList() {
    app.activity.hallGetTaskPointInfo().then(res => {
      var value = wx.getStorageSync('showVipBox')
      if (!value) {
        if (res.dataList[0].isCompleted && res.dataList[1].isCompleted && res.dataList[2].isCompleted) {
          wx.setStorageSync('showVipBox', 1)
          this.setData({
            showOverlay: true,
            overlayType: 1
          })
        }
      }
      this.setData({
        stepsList: res.dataList
      })
    })
  },
  hallGetColumnList() {
    app.lessonNew.hallGetColumnList({
      pageSize: 4,
      pageNum: 1
    }).then(res => {
      this.setData({
        lessonList: res.dataList
      })
    })
  },
  hallGgetContentInfo() {
    app.activity.hallGgetContentInfo().then(res => {
      this.setData({
        inro: res.data
      })
    })
  },
  getScore(e) {
    let index = e.currentTarget.dataset.index,
      url = ''
    if (this.data.stepsList[index].isCompleted) return
    switch (this.data.stepsList[index].type) {
      case 1:
        url = '/page/discoveryHall/pages/works/works'
        break;
      case 2:
        url = '/page/index/pages/charityLesson/charityLesson?name=热门'
        break;
      case 3:
        url = '/page/discoveryHall/pages/detail/detail?isOn=1'
        break;
    }
    wx.navigateTo({
      url,
    })
  },
  toLesson(e) {
    app.liveAddStatus(e.currentTarget.dataset.item.columnId, e.currentTarget.dataset.item.isCharge, e.currentTarget.dataset.item.id)
  },
  toLoade() {
    wx.navigateTo({
      url: '/pages/education/education?type=0&login=1&url=https://mp.weixin.qq.com/s/vSd8XBQDQkvqVX_kt_YyTQ',
    })
  }
})