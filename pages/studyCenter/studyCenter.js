// pages/studyCenter/studyCenter.js
const app = getApp()
Page({
  data: {
    iconList: [],
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
    this.setIcon()
    this.getDetail()
    this.getMylesson()
    if (!this.data.$state.userInfo.id) return
    this.getMylive()
  },
  setIcon() {
    this.setData({
      iconList: [{
          id: 1,
          name: '学习榜',
          image: `${this.data.$state.imgHost}/studyIcon/rankListIcon.png`,
          url: '/page/index/pages/rankingList/rankingList',
          width: 48,
          height: 48
        },
        {
          id: 2,
          name: '结课证书',
          image: `${this.data.$state.imgHost}/studyIcon/overIcon.png`,
          url: '/page/study/pages/certificate/certificate',
          width: 50,
          height: 50
        },
        {
          id: 3,
          name: '学习历史',
          image: `${this.data.$state.imgHost}/studyIcon/historyIcon.png`,
          url: '/page/study/pages/history/history',
          width: 50,
          height: 50
        },
        {
          id: 4,
          name: '网大商城',
          image: `${this.data.$state.imgHost}/studyIcon/shopIcon1.png`,
          url: '',
          width: 50,
          height: 50,
          toMiniprogram: 1,
          appId: 'wx11cabfef2ec771b3'
        },
      ]
    })
  },
  onReachBottom: function () {
    // if (this.data.lessonList.length < (this.lessonParams.pageNum * 10)) return
    this.lessonParams.pageNum += 1
    this.getMylesson(this.data.lessonList.length > 0 ? this.data.lessonList : this.data.recommenList)
  },
  iconBind(e) {
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
        'detail.studyDay': res.data.studyDay,
        'detail.studyTime': res.data.studyTime
      })
    })
  },
  getMylive() {
    app.study.centerLive(this.liveParams).then(res => {
      res.dataList.forEach(item => {
        item.studydate = app.util.formatTime(new Date(item.startTime * 1000)).substring(0, 10) == app.util.formatTime(new Date()).substring(0, 10) ? '今天' + app.util.formatTime(new Date(item.startTime * 1000)).substring(10) : app.util.formatTime(new Date(item.startTime * 1000), 1)
      })
      this.setData({
        liveList: res.dataList,
        'detail.liveTotal': res.total
      })
    })
  },
  getMylesson: async function (list) {
    let arr = list || []
    let res = this.data.$state.userInfo.id ? (await app.study.centerSpecial(this.lessonParams)) : null
    if (!this.data.$state.userInfo.id || (this.data.lessonList.length == 0 && res.dataList.length == 0) || (list && this.data.lessonList.length == 0)) {
      let msg = await app.liveData.selectRecommedListByCategoryIds(this.lessonParams)
      msg.dataList.forEach(item => {
        item.studydate = app.util.dateUnit(item.studydate)
      })
      arr.push(...msg.dataList)
      this.setData({
        recommenList: arr
      })
    } else {
      res.dataList.forEach(item => {
        item.studydate = app.util.dateUnit(item.studydate)
      })
      arr.push(...res.dataList)
      this.setData({
        lessonList: arr,
        'detail.lessonTotal': res.total
      })
    }
  },
  topDetail(e) {
    if (this.data.lessonList[0] || e.currentTarget.dataset.item.isEnroll) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/page/live/pages/liveDetail/liveDetail?specialColumnId=' + item.columnId,
      })
    } else {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/page/live/pages/tableDetail/tableDetail?specialColumnId=' + item.columnId,
      })
    }

  },
  add(e) {
    app.liveData
    .addSubscribe({
      columnId: e.currentTarget.dataset.item.columnId,
    })
    .then(() => {
      this.data.recommenList.forEach((i) => {
        i.columnId == e.currentTarget.dataset.item.columnId ? (i.isEnroll = 1) : "";
      });
      wx.showToast({
        title: "报名成功",
        icon: "none",
      });
      this.setData({
        recommenList: this.data.recommenList,
      });
    });
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
})