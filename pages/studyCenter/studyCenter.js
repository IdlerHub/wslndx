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
    liveList: [{
        columnId: 810,
        dayTime: "12月11日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/fe39ce58b0be811ac576ddbbeb513b63.png",
        isExperience: 0,
        liveId: 7881,
        liveName: "小儿推拿直播课-第二课时",
        startTime: "14:00",
        status: 0,
        tags: [{
          columnId: 810,
          tagName: "疏通筋骨"
        }],
        universityName: "网上老年大学",
        viewNum: 213,
      },
      {
        columnId: 809,
        dayTime: "12月11日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/6db77e80c26368a31ff1f495a4e635bf.png",
        isExperience: 0,
        liveId: 7869,
        liveName: "生活中的中药学直播课-第二课时",
        startTime: "14:00",
        status: 0,
        tags: [{
          columnId: 809,
          tagName: "修身养性"
        }],
        universityName: "网上老年大学",
        viewNum: 262
      },
      {
        columnId: 817,
        dayTime: "12月11日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/a3246a90c427ab85df79c38d8cdf4fa9.jpg",
        isExperience: 0,
        liveId: 7984,
        liveName: "网上老年大学交流会",
        startTime: "15:00",
        status: 1,
        universityName: "网上老年大学",
        viewNum: 184
      }
    ],
    lessonList: [{
        id: 1,
        name: '老年权益维护老年权益维护老年权益维护老年权士大夫但是看',
        liveCount: 18,
        studyNum: 8,
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/fe39ce58b0be811ac576ddbbeb513b63.png",
      },
      {
        id: 1,
        name: '音乐鉴赏之古典音乐',
        liveCount: 18,
        studyNum: 0,
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/fe39ce58b0be811ac576ddbbeb513b63.png",
      }, {
        id: 1,
        name: '音乐鉴赏之古典音乐',
        liveCount: 18,
        studyNum: 18,
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/fe39ce58b0be811ac576ddbbeb513b63.png",
      },{
        id: 1,
        name: '音乐鉴赏之古典音乐',
        liveCount: 18,
        studyNum: 18,
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/fe39ce58b0be811ac576ddbbeb513b63.png",
        isOver: 1
      },
    ],
    detail: {}
  },
  liveParams: {
    pageNum: 1,
    pageSize: 10,
  },
  lessonParams: {
    pageNum: 1,
    pageSize: 10,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getDetail()
    this.getMylive()
    this.getMylesson()
  },
  onReachBottom: function () {

  },
  iconBind(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    if(item.toMiniprogram) {
      wx.navigateToMiniProgram({
        appId: item.appId,
        path: 'page/index/index'
      })
    } else {
      wx.navigateTo({
        url: item.url,
      })
    }
  },
  getDetail() {
    app.study.centerDuration().then(res => {
      this.setData({
        detail: res.data
      })
    })
  },
  getMylive() {
    app.study.centerLive(this.liveParams).then(res => {
      this.setData({
        liveList: res.dataList
      })
    })
  },
  getMylesson() {
    app.study.centerHistoryLesson(this.lessonParams).then(res => {
      this.setData({
        lessonList: res.dataList
      })
    })
  }
})