// page/index/pages/allSearch/allSearch.js
const app = getApp()
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
      universityId: ops.universityId,
      type: getCurrentPages()[getCurrentPages().length - 2].type
    })
    this.params = {
      pageSize: 10,
      pageNum: 1,
      keyword: ''
    }
    wx.setNavigationBarTitle({
      title: ops.isSchool == 'true' ? '搜索高校' : ops.isLesson == 'true' ? '搜索课程' : '搜索讲师'
    })
    let that = this
    ops.isSchool == 'true' ? wx.getStorage({
      key: 'universityHistory',
      success(res) {
        that.setData({
          'historyList': res.data
        })
      }
    }) : ops.isLesson == 'true' ? wx.getStorage({
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
    }, () => {
      this.selectComponent('#searchTop').searchlesss()
    })
  },
  toSchool(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/page/index/pages/schoolDetail/schoolDetail?id=${item.id}&title=${item.title}`,
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
    this.params.pageNum += 1
    if (this.data.universityId != 'null') this.params['universityId'] = this.data.universityId
    let arr = this.data.list
    if (this.data.isSchool) {
      this.params.keyword = this.data.text
      app.lessonNew.universitySearchList(this.params).then(res => {
        res.dataList.forEach(item => {
          item.title = item.name
          item.name = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.name
                .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                 + "</span>" )}</p>`;
          item.bw = app.util.tow(item.browse);
        });
        arr.push(...res.dataList)
        this.setData({
          list: arr,
          text: this.data.text,
        })
      })
    } else if (this.data.isLesson) {
      this.params.keyword = this.data.text
      if (this.data.type == 1) {
        this.params.type = 3
        app.liveData.chargeList(this.params).then(res => {
          res.dataList.forEach(item => {
            item.name = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.name
                  .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                   + "</span>" )}</p>`;
            item.bw = app.util.tow(item.browse);
          });
          arr.push(...res.dataList)
          this.setData({
            list: arr,
            text: this.data.text,
          })
        })
      } else {
        app.lessonNew.searchLessonList(this.params).then(res => {
          res.dataList.forEach(item => {
            item.name = item.title
            item.title = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.title
                  .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                   + "</span>" )}</p>`;
            item.bw = app.util.tow(item.browse);
          });
          arr.push(...res.dataList)
          this.setData({
            list: arr,
            text: this.data.text,
          })
        })
      }
    } else {
      this.params['nickName'] = this.data.text
      app.lessonNew.lecturerList(this.params).then(res => {
        res.dataList.forEach(item => {
          item.title = item.name
          item.nickname = `<p style="width:410rpx;display: block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${item.nickname
                .replace(this.data.text, '<span style="color:#DF2020">' + this.data.text
                 + "</span>" )}</p>`;
        });
        arr.push(...res.dataList)
        pages.setData({
          list: arr,
          text: this.data.text,
        })
      })
    }
  },
  detailTap(e) {
    let item = e.currentTarget.dataset.item
    if (!this.data.$state.userInfo.id) {
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
  onShareAppMessage(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      let id = ops.target.dataset.id
      return {
        title: "一起来学习网上老年大学讲师的课程吧!",
        imageUrl: this.data.$state.shareImgurl || "/images/sharemessage.jpg",
        path: "/page/index/pages/tearcherDetail/tearcherDetail?id=" +
          id +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  }
})