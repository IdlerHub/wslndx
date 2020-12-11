// pages/studyCenter/studyCenter.js
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
        url: '/page/index/pages/rankingList/rankingList',
        width: 50,
        height: 50
      },
      {
        id: 3,
        name: '学习历史',
        image: '/images/studyIcon/historyIcon.png',
        url: '/page/index/pages/rankingList/rankingList',
        width: 50,
        height: 50
      },
      {
        id: 4,
        name: '学院市集',
        image: '/images/studyIcon/shopIcon.png',
        url: '/page/index/pages/rankingList/rankingList',
        width: 50,
        height: 50
      },
    ],
    liveList: [],
    lessonList: []
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})