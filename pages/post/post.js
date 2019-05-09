//获取应用实例
const app = getApp()
Page({
  data: {
    IMG_URL: app.IMG_URL,
    rlSucFlag: false,
    isRefreshing: false
  },
  onLoad(options) {
    this.param = { page: 1, pageSize: 10 }
    this.setData({
      list: [],
      userInfo: wx.getStorageSync("userInfo")
    })
    /* 从cdetail-->发帖 */
    if (options.rlSuc) {
      this.setData({ rlSucFlag: true })
    }
    this.getList([])
    app.aldstat.sendEvent("菜单", { name: "学有圈" })
  },

  onShow: function() {
    if (this.data.rlSucFlag) {
      this.rlSuc()
      /* 确保动画只执行一次 */
      this.setData({ rlSucFlag: false })
    }
  },
  onShareAppMessage: function(e) {
    let i = e.target.dataset.index
    let bkid = this.data.list[i].id
    app.circle.addForward({ blog_id: bkid }).then(res => {
      if (res.code == 1) {
        let list = this.data.list
        list[i].forward += 1
        this.setData({
          list: list
        })
      }
    })
    return {
      title: "网上老年大学",
      imageUrl: this.data.img,
      path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share"
    }
  },
  getList(list) {
    let temp = list || this.data.list
    return app.circle.news(this.param).then(msg => {
      if (msg.code == 1) {
        if (msg.data) {
          msg.data.forEach(function(item) {
            let arr = []
            item.fw = app.util.tow(item.forward)
            item.cw = app.util.tow(item.comments)
            item.lw = app.util.tow(item.likes)
            item.images.forEach(function(i) {
              arr.push(i.image)
            })
            item.images = arr
            item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000 ? true : false
            item.pause = true
            temp.push(item)
          })
          this.setData({
            list: temp
          })
        }
      }
    })
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.list
    let param = {
      blog_id: list[i].id
    }
    if (list[i].likestatus == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        if (msg.code == 1) {
          list[i].likestatus = 0
          list[i].likes--
          this.setData({
            list: list
          })
        }
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        if (msg.code == 1) {
          list[i].likestatus = 1
          list[i].likes++
          list[i].praising = true
          this.setData({
            list: list
          })
        }
      })
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.list
    list[i].praising = false
    this.setData({
      list: list
    })
  },
  // 加圈
  result(id, data) {
    let param = {
      fs_id: id
    }
    app.circle.join(param).then(msg => {
      if (msg.code == 1) {
        data.forEach(function(item, index) {
          setTimeout(() => {
            wx.showToast({
              title: "    您已成功加入\r\n【" + item.title + "】学友圈",
              icon: "none",
              duration: 1000
            })
          }, index * 1000 + 500)
        })
      }
    })
  },
  // 写帖成功动效
  rlSuc() {
    this.setData({
      rlAni: true
    })
    let timer = setTimeout(() => {
      this.setData(
        {
          rlAni: false
        },
        () => {
          clearTimeout(timer)
        }
      )
    }, 2000)
    /* 重新到第一页 */
    this.param.page = 1
    this.getList([]).then(() => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    })
  },
  //图片预览
  previewImage(e) {
    /*todo:考虑去掉that*/
    let that = this
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    this.setData({
      preview: true
    })
    wx.previewImage({
      current: current,
      urls: urls, // 需要预览的图片http链接列表
      complete: function() {
        that.setData({
          preview: false
        })
      }
    })
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    if (!this.data.preview) {
      wx.navigateTo({
        url: "../pDetail/pDetail?id=" + id
      })
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.param.page = 1
    this.setData({
      isRefreshing: true
    })
    this.getList([]).then(() => {
      wx.stopPullDownRefresh()
      let timer = setTimeout(() => {
        this.setData(
          {
            isRefreshing: false
          },
          () => {
            clearTimeout(timer)
          }
        )
      }, 1000)
    })
  },
  //上拉加载
  onReachBottom() {
    this.param.page++
    this.getList()
  },
  toUser(e) {
    if (this.data.userInfo.id == e.currentTarget.dataset.uid) {
      wx.navigateTo({
        url: "/pages/user/user"
      })
    }
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "学友圈页" })
  }
})
