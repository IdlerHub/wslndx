// page/discoveryHall/pages/index/index.js
const app = getApp()
Page({
  data: {
    showOverlay: false,
    overlayType: 0,
    stepsList: [
      {
        taskName: '观看优秀作品',
        taskNum: 6,
        points: 10,
        completedTaskNum: 2,
        isCompleted: 1,
        type: 1
      },{
        taskName: '学习热门课程',
        taskNum: 6,
        points: 6,
        completedTaskNum: 4,
        isCompleted: 0,
        type: 2
      },{
        taskName: '查看网大介绍',
        taskNum: 6,
        points: 5,
        completedTaskNum: 3,
        isCompleted: 0,
        type: 3
      },
    ],
    opusList: []
  },
  onLoad: function (options) {
    Promise.all([this.hallGetOpus()])
  },
  onReady: function () {

  },
  onShow: function () {

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
        url = '/page/discoveryHall/pages/works/works'
        break;
        case 3:
        url = '/page/discoveryHall/pages/detail/detail?isInro=1'
        break;
    }
    wx.navigateTo({
      url,
    })
  }
})