// pages/search/search.js
const app = getApp();
Page({
  data: {
    isSearch: 0,
    focus: true,
    text: "",
    lessonList: [],
    liveList: [],
    searchInfo: {
      historyList: [],
      hostList: []
    },
    isEnd: {
      live: 0,
      lesson: 0
    },
    current: 0
  },
  pagename: "课程搜索",
  isLogin: 1,
  onLoad: function (options) {
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
  onShow() {
    this.getHotSearchLabel()
  },
  onReachBottom: function () {
    this.lesssearch(true);
  },
  getHotSearchLabel() {
    app.lessonNew.getHotSearchLabel().then(res => {
      this.setData({
        'searchInfo.hostList': res.dataList
      })
    })
  },
  detailTap: function (e) {
    let item = e.currentTarget.dataset.item,
      type = e.currentTarget.dataset.type
    if (type == 1) {
      if (!this.data.$state.userInfo.id) {
        wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.id}`,
        })
        return
      }
      app.liveData.getLiveBySpecialColumnId({
        specialColumnId: item.id
      }).then(res => {
        !res.data.isAddSubscribe ? wx.navigateTo({
          url: `/page/live/pages/tableDetail/tableDetail?specialColumnId=${item.id}`,
        }) : wx.navigateTo({
          url: `/page/live/pages/liveDetail/liveDetail?specialColumnId=${item.id}`,
        })
      })
    } else {
      if (!this.data.$state.userInfo.id) {
        getApp().changeLoginstatus()
        getApp().checknextTap(e)
        return
      }
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
    e.detail.value.length < 1 ?
      this.setData({
        lessonList: [],
        liveList: [],
        isSearch: 0,
        current: 0
      }) :
      ''
  },
  cleartxt() {
    this.setData({
      text: "",
      focus: false,
      isSearch: 0,
      lessonList: [],
      liveList: [],
      current: 0
    });
    this.setData({
      focus: true
    });
  },
  searchlesss(e) {
    this.param = {
      page_size: 10,
      type: 0,
      pageNum: 1
    };
    this.liveParams = {
      page_size: 10,
      type: 1,
      pageNum: 1
    };
    this.lessonParams = {
      page_size: 10,
      type: 2,
      pageNum: 1
    }
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
  lesssearch() {
    this.param["keyword"] = this.data.text;
    let historyList = [...this.data.searchInfo.historyList]
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
    app.lessonNew.searchLessonAndColumn(this.param).then(res => {
      let liveList = res.data.columnInfo.list,
        lessonList = res.data.lessonInfo.list
      liveList.forEach(item => {
        item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
            .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
             + "</span>" )}</p>`;
        item.bw = app.util.tow(item.browse);
      });
      lessonList.forEach(item => {
        item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
            .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
             + "</span>" )}</p>`;
        item.bw = app.util.tow(item.browse);
      });
      this.setData({
        liveList,
        lessonList,
        isSearch: 1,
        'isEnd.live': liveList.length < 10 ? 1 : 0,
        'isEnd.lesson': lessonList.length < 10 ? 1 : 0,
      });
    });
    app.lessonNew.addSearchLabel({
      type: 2,
      keyword: this.data.text
    })
  },
  liveTolower() {
    if (this.data.isEnd.live) return
    this.liveParams.pageNum += 1
    app.lessonNew.searchLessonAndColumn(this.liveParams).then(res => {
      let liveList = this.data.liveList
      res.data.columnInfo.list.forEach(item => {
        item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
            .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
             + "</span>" )}</p>`;
        item.bw = app.util.tow(item.browse);
      });
      liveList = liveList.push(...res.data.columnInfo.list)
      this.setData({
        liveList,
        'isEnd.live': res.data.columnInfo.list < 10 ? 1 : 0,
      });
    });
  },
  lessonTolower() {
    if (this.data.isEnd.lesson) return
    this.lessonParams.pageNum += 1
    app.lessonNew.searchLessonAndColumn(this.lessonParams).then(res => {
      let lessonList = this.data.lessonList
      res.data.lessonInfo.list.forEach(item => {
        item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
            .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
             + "</span>" )}</p>`;
        item.bw = app.util.tow(item.browse);
      });
      lessonList = lessonList.push(...res.data.lessonInfo.list)
      this.setData({
        lessonList,
        'isEnd.live': res.data.columnInfo.list < 10 ? 1 : 0,
      });
    });
  },
  // 课程完成状态
  doneless(id) {
    this.data.lessonList.forEach(item => {
      item.id == id ? (item.is_finish = 1) : "";
    });
    this.setData({
      lessonList: this.data.lessonList
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
  },
  bindanimationfinish(e) {
    this.setData({
      current: e.detail.current
    })
  }
});