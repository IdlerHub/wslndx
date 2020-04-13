// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: '1',
    list:[],
    showRule: false,
    shoolList: {
      0:[],
      1:[],
      2:[]
    },
    userList: {
      0:[],
      1:[],
      2:[]
    },
    showToast: false,
    scollTop: 0
  },
  page: false,
  pageName: "学习排行榜",
  onLoad: function (ops) {
    ops.mode ? this.setData({
      mode: ops.mode
    }): ''
    this.shoolPage = {
      0: {
        page:1, pageSize: 10, type: 'day'
      },
      1: {
        page:1, pageSize: 10, type: 'week'
      },
      2: {
        page:1, pageSize: 10, type: 'month'
      },
    }
    this.userPage = {
      0: {
        page:1, pageSize: 10, type: 'day'
      },
      1: {
        page:1, pageSize: 10, type: 'week'
      },
      2: {
        page:1, pageSize: 10, type: 'month'
      },
    }
    let time = new Date()
    time =  app.util.formatTime(time).slice(0,10)
    this.setData({
      time
    })
    this.getLearnTimeProportion().then(() => {
      ops.mode == 1 ? this.getUserList() : this.getShoollist() 
      this.getLearnTimeRank()
    })
    this.getRankRule()
  },
  onShow: function () {
    this.data.showToast ? this.closeToast() : ''
  },
  onHide: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
  },
  pageMore() {
    if(this.page) return
    if(this.data.mode == 1) {
      this.page = true
      this.userPage[this.data.rankType].page ++ 
      let list = this.data.userList[this.data.rankType]
      app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
        !res.data[0] ? this.userPage[this.data.rankType].page -- : ''
        res.data.forEach(item => {
          item.lesson_time = (item.lesson_time * this.data.proportion).toFixed(0)
          item.times = app.util.qian(item.lesson_time)
        });
        list = list.concat(res.data)
        this.setData({
          [`userList[${this.data.rankType}]`]: list
        })
        this.page = false
      })
    } else {
      this.page = true
      this.shoolPage[this.data.rankType].page ++ 
      let list = this.data.shoolList[this.data.rankType]
      app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
        !res.data[0] ? this.shoolPage[this.data.rankType].page -- : ''
        res.data.forEach(item => {
          item.lesson_time = (item.lesson_time * this.data.proportion).toFixed(0)
          item.times = app.util.qian(item.lesson_time)
        });
        list = list.concat(res.data)
        this.setData({
          [`shoolList[${this.data.rankType}]`]: list
        })
      })
      this.page = false
    }
  },
  onShareAppMessage: function(ops) {
    if(this.data.mode == 1){
      return {
        title: '老年大学学员PK学习榜，快来看看您的学习排第几！',
        path: `pages/rankingList/rankingList?type=share&uid=${this.data.$state.userInfo.id}&mode=1`,
        imageUrl: this.data.$state.imgHost + '/rankingShareimg3.png'
      };
      wx.uma.trackEvent("rankingShare, ", { name: "个人榜分享" });
    } else {
      return {
        title: '老年大学PK学习榜，快来看看您的学校排第几!',
        path: `pages/rankingList/rankingList?type=share&uid=${this.data.$state.userInfo.id}&mode=0`,
        imageUrl: this.data.$state.imgHost + '/rankingShareimg2.png'
      };
      wx.uma.trackEvent("rankingShare, ", { name: "学校榜分享" });
    }
  },
  getRankRule(){
    app.user.rankRule().then(res => {
      this.setData({
        rankRule: res.data
      })
    })
  },
  check(e) {
    this.setData({
      mode: e.currentTarget.dataset.type,
      rankType: '1',
      scollTop: 0
    })
    this.getLearnTimeRank()
    if(e.currentTarget.dataset.type == 1) {
      if(this.data.userList[this.data.rankType][0]) return
      this.getUserList()
    } else {
      if(this.data.shoolList[this.data.rankType][0]) return
      this.getShoollist()
    }
  },
  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type,
      scollTop: 0
    })
    this.getLearnTimeRank()
    if(this.data.mode == '1') {
      if(this.data.userList[this.data.rankType]) return
      this.getUserList()
    } else {
      if(this.data.shoolList[this.data.rankType]) return
      this.getShoollist()
    }
  },
  openRule(e) {
    e.currentTarget.dataset.type ? this.setData({
      showRule: true
    }) :
    this.setData({
      showRule: false
    })
  },
  getShoollist() {
    let txt = this.data.rankType
    app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
      res.data.forEach(item => {
        item.lesson_time = (item.lesson_time * this.data.proportion).toFixed(0)
        item.times = app.util.qian(item.lesson_time)
      });
      this.setData({
        [`shoolList[${txt}]`]: res.data
      })
    })
  },
  getUserList() {
    app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
      res.data.forEach(item => {
        item.lesson_time = (item.lesson_time * this.data.proportion).toFixed(0)
        item.times = app.util.qian(item.lesson_time)
      });
      this.setData({
        [`userList[${this.data.rankType}]`]: res.data
      })
    })
  },
  closeToast() {
    this.Toastimer = setTimeout(() => {
       this.setData({
         showToast: false
       })
       clearTimeout(this.Toastimer)
     }, 1500)
   },
  getLearnTimeRank() {
    let param  = { type: ''}, n = this.data.rankType
    switch(n) {
      case '0':
        param.type = "day"
        break;
      case '1':
        param.type = "week"
        break;
      case '2': 
        param.type = "month"
        break;
    }
    if( this.data.mode == 0 ) {
      app.user.getSchoolLearnTimeRank(param).then(res => {
        res.data.score = (res.data.score * this.data.proportion).toFixed(0)
        res.data.time = app.util.qian(res.data.score)
        this.setData({
          shoolRank: res.data
        })
      })
    } else {
      app.user.getUserLearnTimeRank(param).then(res => {
        res.data.score = (res.data.score * this.data.proportion).toFixed(0)
        res.data.time = app.util.qian(res.data.score)
        this.setData({
          userRank: res.data
        })
      })
    }
  },
  getLearnTimeProportion() {
    return app.user.getLearnTimeProportion().then(res => {
      this.setData({
        proportion: res.data.proportion
      })
    })
  }
})