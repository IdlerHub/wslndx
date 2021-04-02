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
  },
  onShow: function () {
    this.getStepList()
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
    app.activity.hallGetOpus({ pageSize: 6, pageNum: 1 }).then(res => {
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
      this.setData({
        stepsList: res.dataList
      })
    })
  },
  hallGetColumnList() {
    app.lessonNew.hallGetColumnList({ pageSize: 4, pageNum: 1 }).then(res => {
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
  toLesson(e) {
    app.liveAddStatus(e.currentTarget.dataset.item.id)
  },
  getScore(e) {
    let index = e.currentTarget.dataset.index, url = ''
    if(this.data.stepsList[index].isCompleted) return
    switch(this.data.stepsList[index].type) {
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
    app.liveAddStatus(e.currentTarget.dataset.item.columnId, e.currentTarget.dataset.item.isCharge)
  }
})