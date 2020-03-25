// pages/rankingList/rankingList.js
const app = getApp()
Page({
  data: {
    mode: 0,
    time: 0,
    rankType: '0',
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
    showToast: false
  },
  onLoad: function (options) {
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
    this.getShoollist()
    this.getRankRule()
    this.getLearnTimeRank()
  },
  onShow: function () {
    this.data.showToast ? this.closeToast() : ''
  },
  onHide: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
    if(this.data.mode) {
      this.userPage[this.data.rankType].page ++ 
      let list = this.data.userList[this.data.rankType]
      app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
        list = list.concat(res.data)
        this.setData({
          [`userList[${this.data.rankType}]`]: list
        })
      })
    } else {
      this.shoolPage[this.data.rankType].page ++ 
      let list = this.data.shoolList[this.data.rankType]
      app.user.getSchoolLessonTime(this.shoolPage[this.data.rankType]).then(res => {
        list = list.concat(res.data)
        this.setData({
          [`shoolList[${this.data.rankType}]`]: list
        })
      })
    }
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    } else if (ops.from === "button") {
      setTimeout(() => {
        this.setData({
          showToast: true
        })
      }, 1000)
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
      rankType: '0'
    })
    if(e.currentTarget.dataset.type == 1) {
      if(this.data.userList[this.data.rankType][0]) return
      this.getUserList()
      this.getLearnTimeRank()
    } else {
      if(this.data.shoolList[this.data.rankType][0]) return
      this.getShoollist()
    }
  },
  checkTop(e) {
    this.setData({
      rankType: e.currentTarget.dataset.type
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
    console.log(e)
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
      this.setData({
        [`shoolList[${txt}]`]: res.data
      })
    })
  },
  getUserList() {
    app.user.getUserLessonTime(this.userPage[this.data.rankType]).then(res => {
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
     console.log(param)
    if( this.data.mode == 0 ) {
      app.user.getSchoolLearnTimeRank(param).then(res => {
        this.setData({
          shoolRank: res.data
        })
      })
    } else {
      app.user.getUserLearnTimeRank(param).then(res => {
        this.setData({
          userRank: res.data
        })
      })
    }
  }
})