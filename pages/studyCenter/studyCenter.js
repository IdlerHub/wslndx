// pages/studyCenter/studyCenter.js
const app = getApp()
Page({
  data: {
    iconList: [{
        id: 1,
        name: '学习榜',
        image: '/images/studyIcon/rankListIcon.png',
        url: '/page/index/pages/rankingList/rankingList',
        width: 48,
        height: 48
      },
      {
        id: 2,
        name: '结课证书',
        image: '/images/studyIcon/overIcon.png',
        url: '/page/study/pages/certificate/certificate',
        width: 50,
        height: 50
      },
      {
        id: 3,
        name: '学习历史',
        image: '/images/studyIcon/historyIcon.png',
        url: '/page/study/pages/history/history',
        width: 50,
        height: 50
      },
      {
        id: 4,
        name: '学院市集',
        image: '/images/studyIcon/shopIcon.png',
        url: '',
        width: 50,
        height: 50,
        toMiniprogram: 1,
        appId: 'wx11cabfef2ec771b3'
      },
    ],
    liveList: [],
    lessonList: [],
    detail: {}
  },
  liveParams: {
    pageNum: 1,
    pageSize: 10,
  },
  onLoad: function (options) {},
  onShow: function () {
    this.lessonParams = {
      pageNum: 1,
      pageSize: 10,
    }
    this.getDetail()
    this.getMylive()
    this.getMylesson()
  },
  onReachBottom: function () {
    if (this.data.lessonList.length < (this.lessonParams.pageNum * 10)) return
    this.lessonParams.pageNum += 1
    this.getMylesson(this.data.lessonList)
  },
  iconBind(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    if (item.toMiniprogram) {
      wx.navigateToMiniProgram({
        appId: item.appId,
        path: ''
      })
    } else {
      wx.navigateTo({
        url: item.url,
      })
    }
  },
  getDetail() {
    app.study.centerDuration().then(res => {
      res.data.studyTime = (res.data.studyTime / 60).toFixed(0)
      this.setData({
        detail: res.data
      })
    })
  },
  getMylive() {
    app.study.centerLive(this.liveParams).then(res => {
      res.dataList.forEach(item => {
        item.studydate = app.util.formatTime(new Date(item.startTime * 1000), 1)
      })
      this.setData({
        liveList: res.dataList
      })
    })
  },
  getMylesson(list) {
    let arr = list || []
    app.study.centerSpecial(this.lessonParams).then(res => {
      res.dataList.forEach(item => {
        item.studydate = app.util.dateUnit(item.studydate)
      })
      arr.push(...res.dataList)
      this.setData({
        lessonList: arr
      })
    })
  },
  topDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + item.columnId,
    })
  }
})