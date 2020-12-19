// pages/search/search.js
const app = getApp();
Page({
  data: {
    voiceImg: "https://hwcdn.jinlingkeji.cn/images/pro/voicebtn2.png",
    voiceActon: false,
    voiceheight: "",
    focus: true,
    text: "1",
    lessList: [{
        "id": 533,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/a03b93cf2e29dfbf23d80eaefd3253e3.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 28345,
        "lessonCount": 10
      },
      {
        "id": 534,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/59c1e19d64da1a13c87b21328376e3b6.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 31483,
        "lessonCount": 6
      },
      {
        "id": 135,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/30a0c84371797312607f41d578939649.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 8990,
        "lessonCount": 5
      },
      {
        "id": 291,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/797cc4cfc73f3ca71164d92ac268a15d.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 29691,
        "lessonCount": 12
      },
      {
        "id": 80,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/07df1ccaffa6006de7b11431e93b4d5e.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 14222,
        "lessonCount": 5
      },
      {
        "id": 145,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/65318a673b50153ad785cb7b1208aadc.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 9998,
        "lessonCount": 4
      },
      {
        "id": 136,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/32498ed103db6c3a46b9cc8602c93824.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 8302,
        "lessonCount": 5
      },
      {
        "id": 288,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/f7a4d14bd7eba0d4ef0d5d81e8a8097f.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 19188,
        "lessonCount": 12
      },
      {
        "id": 183,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/436c4cd882ba55aa37d14a6f9a985832.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 11201,
        "lessonCount": 8
      },
      {
        "id": 98,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/4fa6ecd32bad58fb0e734903c42149fd.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 4551,
        "lessonCount": 4
      },
      {
        "id": 112,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/6bfd6aa36dc2828cbf4b72abb33733ac.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 5652,
        "lessonCount": 5
      },
      {
        "id": 290,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/9dd423694b26e39b7fa635a01d3eab64.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 12320,
        "lessonCount": 12
      },
      {
        "id": 289,
        "type": 2,
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/16a7ce73770ee596f2de8f16dd9d75eb.jpg",
        "title": "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        "tags": [],
        "browse": 10997,
        "lessonCount": 10
      }
    ],
    liveList: [{
        columnId: 855,
        dayTime: "12月19日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/aba9522ca7833d964db860b181ca170e.png",
        isExperience: 0,
        liveId: 8544,
        liveName: "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        startTime: "09:00",
        status: 0,
        tags: [{
          columnId: 855,
          tagName: "戏曲文化"
        }],
        universityName: "网上老年大学",
        viewNum: 184,
      },
      {
        columnId: 855,
        dayTime: "12月19日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/aba9522ca7833d964db860b181ca170e.png",
        isExperience: 0,
        liveId: 8544,
        liveName: "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        startTime: "09:00",
        status: 0,
        tags: [{
          columnId: 855,
          tagName: "戏曲文化"
        }],
        universityName: "网上老年大学",
        viewNum: 184,
      }, {
        columnId: 855,
        dayTime: "12月19日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/aba9522ca7833d964db860b181ca170e.png",
        isExperience: 0,
        liveId: 8544,
        liveName: "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        startTime: "09:00",
        status: 0,
        tags: [{
          columnId: 855,
          tagName: "戏曲文化"
        }],
        universityName: "网上老年大学",
        viewNum: 184,
      }, {
        columnId: 855,
        dayTime: "12月19日",
        indexCover: "https://hwcdn.jinlingkeji.cn/uploads/images/aba9522ca7833d964db860b181ca170e.png",
        isExperience: 0,
        liveId: 8544,
        liveName: "<p style='width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'>识别和保护我们的发声器官1</p>",
        startTime: "09:00",
        status: 0,
        tags: [{
          columnId: 855,
          tagName: "戏曲文化"
        }],
        universityName: "网上老年大学",
        viewNum: 184,
      },
    ],
    showvioce: true,
    searchInfo: {
      historyList: [],
      hostList: []
    },
    current: 0
  },
  pagename: "课程搜索",
  isLogin: 1,
  onLoad: function (options) {
    this.param = {
      page_size: 10
    };
    let that = this
    wx.getStorage({
      key: 'seachHistory',
      success(res) {
        that.setData({
          'searchInfo.historyList': res.data
        })
      }
    })
    wx.uma.trackEvent('index_btnClick', {
      btnName: '课程搜索'
    });
  },
  onShow() {},
  onReachBottom: function () {
    this.lesssearch(true);
  },
  detailTap: function (e) {
    let item = e.currentTarget.dataset.item
    if (item.columnId) {
      app.liveData.getLiveBySpecialColumnId({
        specialColumnId: item.columnId
      }).then(res => {
        !res.data.isAddSubscribe ? wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.columnId}`,
        }) : wx.navigateTo({
          url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${item.columnId}`,
        })
      })
    } else {
      wx.navigateTo({
        url: `../detail/detail?id=${e.currentTarget.dataset.item.id}`
      });
    }
    //用于数据统计
    wx.uma.trackEvent("searchLessons", {
      lessonsName: e.currentTarget.dataset.item.name
    });
  },
  backhome() {
    wx.navigateBack();
  },
  txtchange(e) {
    this.setData({
      text: e.detail.value
    });
    this.param = {
      page_size: 10
    };
    e.detail.value.length < 1 ?
      this.setData({
        lessList: [],
        showvioce: true,
      }) :
      ''
  },
  cleartxt() {
    this.setData({
      text: "",
      focus: false,
      lessList: [],
    });
    this.setData({
      focus: true
    });
  },
  searchlesss(e) {
    this.param = {
      page_size: 10
    };
    if (e.currentTarget.dataset.text) {
      this.setData({
        text: e.currentTarget.dataset.text
      }, () => {
        this.lesssearch();
      })
    } else {
      this.lesssearch();
    }
  },
  lesssearch(list) {
    this.param["keyword"] = this.data.text;
    let lesslist = [],
      historyList = [...this.data.searchInfo.historyList]
    list ? (lesslist = this.data.lessList) : "";
    historyList.forEach((item, index) => {
      item == this.data.text ? historyList.splice(index, 1) : ''
    })
    historyList.unshift(this.data.text)
    this.setData({
      'searchInfo.historyList': historyList
    }, () => {
      wx.setStorage({
        key: "seachHistory",
        data: this.data.searchInfo.historyList
      })
    })
    app.classroom.lessSearch(this.param).then(res => {
      if (!res.data.data) {
        this.setData({
          showvioce: false,
          voiceActon: false
        });
        return;
      }
      let lessList = res.data.data;
      (this.param["scroll_id"] = res.data.scroll_id),
      lessList.forEach(item => {
        item.name = item.title
          .replace(/<highlight>/g, "")
          .replace(/<\/highlight>/g, "");
        item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
            .replace(/<highlight>/g, '<span style="color:#DF2020">')
            .replace(/<\/highlight>/g, "</span>")}</p>`;
        item.subtitle = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.subtitle
            .replace(/<highlight>/g, '<span style="color:#DF2020">')
            .replace(/<\/highlight>/g, "</span>")}</p>`;
        item.bw = app.util.tow(item.browse);
      });
      lesslist.push(...lessList);
      this.setData({
        showvioce: false,
        lessList: lesslist,
        voiceActon: false
      });
    });
  },
  // 课程完成状态
  doneless(id) {
    this.data.lessList.forEach(item => {
      item.id == id ? (item.is_finish = 1) : "";
    });
    this.setData({
      lessList: this.data.lessList
    });
  },
  checknextTap(e) {
    app.checknextTap(e)
  },
  clearHistory() {
    this.setData({
      'searchInfo.historyList': []
    }, () => {
      wx.setStorage({
        key: "seachHistory",
        data: this.data.searchInfo.historyList
      })
    })
  },
  checkTab(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    })
  }
});