// page/study/pages/history/history.js
Page({
  data: {
    current: 0,
    liveList: [{
      id: 1,
      name: '音乐鉴赏之古典音乐音音乐鉴赏之古典(第一课时)十点十分啊实打',
      image: 'https://hwcdn.jinlingkeji.cn/uploads/images/3c6c1a814c2733f5c0e9a30765c0c175.png',
      time: '2020年03月06日'
    }, {
      id: 1,
      name: '老年权益维护',
      image: 'https://hwcdn.jinlingkeji.cn/uploads/images/3c6c1a814c2733f5c0e9a30765c0c175.png',
      time: '2020年03月06日'
    }],
    lessonList: [ 
      {
        time: '03月06日',
        list: [
          {
            id: 1,
            name: '音乐鉴赏之古典音乐音音乐鉴赏之古典(第一课时)十点十分啊实打',
            image: 'https://hwcdn.jinlingkeji.cn/uploads/images/3c6c1a814c2733f5c0e9a30765c0c175.png',
            count: 10,
            studyNum: 8
          }, {
            id: 1,
            name: '老年权益维护',
            image: 'https://hwcdn.jinlingkeji.cn/uploads/images/3c6c1a814c2733f5c0e9a30765c0c175.png',
            count: 10,
            studyNum: 1
          },
          {
            id: 1,
            name: '老年权益维护',
            image: 'https://hwcdn.jinlingkeji.cn/uploads/images/3c6c1a814c2733f5c0e9a30765c0c175.png',
            count: 10,
            studyNum: 10
          }
        ]
      }
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  init() {

  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.current ||  e.detail.current
    })
  },
})