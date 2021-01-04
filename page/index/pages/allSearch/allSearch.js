// page/index/pages/allSearch/allSearch.js
Page({
  data: {
    text: '',
    list: [],
    historyList: [],
    isSearch: 0
  },
  isAllsearch: 1,
  onLoad: function (ops) {
    this.setData({
      isLesson: ops.isLesson == 'true',
      isSchool: ops.isSchool == 'true',
      universityId: ops.universityId
    })
    wx.setNavigationBarTitle({
      title: ops.isSchool == 'true' ? '搜索高校' : ops.islesson ? '搜索课程' : '搜索讲师'
    })
    let that = this
    ops.isSchool == 'true' ? wx.getStorage({
      key: 'universityHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    }) : ops.islesson ?  wx.getStorage({
      key: 'lessonHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    }) : wx.getStorage({
      key: 'teachHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    })
  },
  searchlesss(e) {
    this.selectComponent('#searchTop').setData({
      text: e.currentTarget.dataset.text
    },() => {
      this.selectComponent('#searchTop').searchlesss()
    })
  },
  toSchool(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/page/index/pages/allSchoollesson/allSchoollesson?id=${item.id}&title=${item.title}`,
    })
  },
  clearHistory() {
    this.setData({
      historyList: []
    }, () => {
      this.data.isSchool ? wx.setStorage({
        key: "universityHistory",
        data: this.data.historyList
      }) : wx.setStorage({
        key: "lessonHistory",
        data: this.data.historyList
      })
    })
  },
  onReachBottom: function () {

  },
  detailTap(e) {
    let item = e.currentTarget.dataset.item
    if(!this.data.$state.userInfo.id) {
      getApp().changeLoginstatus()
      getApp().checknextTap(e)
      return
    }
    wx.navigateTo({
      url: '/page/index/pages/detail/detail?id=' + item.id,
    })
  },
  checkAttention(e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index
    if (!item.isFollowing) {
      app.liveData.follow({
        followerUid: item.uid
      }).then(res => {
        wx.showToast({
          icon: 'none',
          title: '关注成功'
        })
        this.setData({
          [`list[${index}].isFollowing`]: 1
        })
      })

    } else {
      wx.navigateTo({
        url: '/page/index/pages/tearcherDetail/tearcherDetail?id=' + item.uid,
      })
    }
  },
})