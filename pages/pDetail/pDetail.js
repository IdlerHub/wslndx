/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 18:06:54
 */
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    nav: [{ name: "评论", class: ".comment", num: 0 }, { name: "点赞", class: ".praise", num: 0 }],
    isRefreshing: false,
    tip: true,
    delState: false
    /* rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    this.id = options.id
    this.comParam = this.praParam = { blog_id: this.id, page: 1, pageSize: 10 }
    if (options.comment) {
      this.show()
    }
    this.setData({
      detail: "",
      comment: [],
      praise: [],
      vistor: options.type == "share", //游客从分享卡片过来
      currentTab: 0,
      navScrollLeft: 0
    })

    if (this.data.vistor) {
      setTimeout(() => {
        this.setData({
          tip: false
        })
      }, 5000)
    }

    if (this.data.$state.userInfo.mobile) {
      this.getDetail().then(code => {
        if (code == 1) {
          this.getComment()
          this.getPraise()
        }
      })
    }
    
  },
  setHeight() {
    let that = this
    let nav = this.data.nav
    let currentTab = this.data.currentTab
    let query = wx.createSelectorQuery().in(this)
    query.select(nav[currentTab].class).boundingClientRect()
    query.exec(res => {
      let height = res[0].height
      that.setData({
        height: height
      })
    })
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current
    if (this.data.currentTab !== cur) {
      this.setData({
        currentTab: cur
      })
    }
    this.setHeight()
  },
  switchTab(event) {
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
    this.setHeight()
  },
  getDetail() {
    let param = { blog_id: this.id }
    return app.circle.detail(param).then(msg => {
      if (msg.code == 1) {
        let detail = msg.data[0]
        let arr = []
        detail.images.forEach(function(i) {
          arr.push(i.image)
        })
        detail.images = arr
        detail.auditing = new Date().getTime() - new Date(detail.createtime * 1000) < 7000
        detail.pause = true
        this.setData({
          detail: detail,
          "nav[0].num": app.util.tow(detail.comments) || detail.comments,
          "nav[1].num": app.util.tow(detail.likes) || detail.likes
        })
        app.globalData.detail = detail
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      }
      return msg.code
    })
  },
  praise() {
    let detail = this.data.detail
    let param = {
      blog_id: detail.id
    }
    if (detail.likestatus == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        if (msg.code == 1) {
          this.aniend()
        } else if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          })
        }
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        if (msg.code == 1) {
          /* 开启动画 */
          detail.praising = true
          app.socket.send(this.data.detail.uid)
          this.setData({ detail: detail })
        } else if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          })
        }
      })
    }
  },
  aniend() {
    /* 点赞动画结束 */
    this.getDetail().then(code => {
      if (code == 1) {
        this.praParam.page = 1
        this.getPraise([])
      }
    })
  },
  play() {
    let detail = this.data.detail
    let videoContext = wx.createVideoContext(String(detail.id))
    videoContext.play()
    this.setData({
      "detail.pause": false
    })
  },
  ended() {
    this.setData({
      "detail.pause": true
    })
  },
  show(e) {
    if (e && e.target.dataset.reply) {
      /* 回复别人的评论 或者 回复别人的回复  */
      this.replyParent = e.target.dataset.parent
      this.replyInfo = e.target.dataset.reply
    } else {
      /* 评论 */
      this.replyInfo = null
      this.replyParent = null
    }
    wx.pageScrollTo({
      scrollTop: 1000
    })
    this.setData({
      write: true
    })
  },
  hide() {
    this.setData({
      write: false,
      content: ""
    })
  },
  input(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 发布评论
  release() {
    if (!!this.data.content.trim()) {
      if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          blog_id: +this.id,
          comment_id: this.replyParent,
          reply_type: 2,
          reply_id: this.replyInfo.reply_id,
          reply_content: this.data.content,
          to_user: this.replyInfo.reply_user_id
        }
        this.reply(params)
      } else if (this.replyInfo) {
        /* 回复评论 */
        let params = {
          blog_id: +this.id,
          comment_id: this.replyInfo.id,
          reply_type: 1,
          reply_id: -1,
          reply_content: this.data.content,
          to_user: this.replyInfo.uid
        }
        this.reply(params)
      } else {
        let param = { blog_id: this.id, content: this.data.content }
        this.post(param)
      }
    }
  },
  post(param) {
    this.setData({
      write: false,
      content: ""
    })
    wx.showLoading({
      title: "发布中"
    })
    app.circle.comment(param).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        wx.showToast({
          title: "发布成功",
          icon: "none",
          duration: 1500
        })
        this.getDetail()
        this.comParam.page = 1
        app.socket.send(this.data.detail.uid)
        this.getComment([])
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      } else {
        wx.showToast({
          title: msg.msg,
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  navigator() {
    let vm = this
    this.setData({
      write: false
    })
    wx.navigateTo({
      url: "../comment/comment?content=" + (this.data.content != undefined ? this.data.content : ""),
      events: {
        commentContent: res => {
          vm.setData({
            content: res.data
          })
          vm.release()
        }
      }
    })
  },
  getComment(list) {
    let comment = list || this.data.comment
    return app.circle.getComment(this.comParam).then(msg => {
      if (msg.code == 1) {
        msg.data.forEach(function(item) {
          item.reply_array.forEach(v => {
            v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`
          })
          comment.push(item)
        })
        this.setData({
          comment: comment
        })
        this.setHeight()
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      }
    })
  },
  getPraise(list) {
    let praise = list || this.data.praise
    return app.circle.getPraise(this.praParam).then(msg => {
      if (msg.code == 1) {
        this.setData({
          praise: praise.concat(msg.data || [])
        })
        this.setHeight()
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    let currentTab = this.data.currentTab
    this.setData({
      isRefreshing: true
    })
    switch (currentTab) {
      case 0:
        this.comParam.page = 1
        this.getComment([]).then(() => {
          wx.stopPullDownRefresh()
        })
        break
      case 1:
        this.praParam.page = 1
        this.getPraise([]).then(() => {
          wx.stopPullDownRefresh()
        })
        break
    }
    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false
      })
      clearTimeout(timer)
    }, 1000)
  },
  //上拉加载
  onReachBottom() {
    let currentTab = this.data.currentTab
    switch (currentTab) {
      case 0:
        this.comParam.page++
        this.getComment()
        break
      case 1:
        this.praParam.page++
        this.getPraise()
        break
    }
  },
  //图片预览
  previewImage(e) {
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let bkid = ops.target.dataset.id
      app.circle.addForward({ blog_id: bkid }).then(() => {
        this.getDetail()
      })
      let article = this.data.detail
      return {
        title: article.content,
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  //删除评论
  delComment: function(e) {
    let param = { blog_id: e.currentTarget.dataset.item.blog_id, id: e.currentTarget.dataset.item.id }
    app.circle
      .delComment(param)
      .then(msg => {
        wx.hideLoading()
        if (msg.code == 1) {
          wx.showToast({
            title: "删除成功",
            icon: "none",
            duration: 1500
          })
          this.getDetail()
          this.comParam.page = 1
          this.getComment([])
        } else if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          })
        } else {
          wx.showToast({
            title: "删除失败，请稍后重试",
            icon: "none",
            duration: 1500
          })
        }
      })
      .finally(() => {
        console.log("hxz")
      })
  },
  /* 删除回复 */
  delReply(e) {
    let params = { blog_id: this.id, comment_id: e.currentTarget.dataset.parentid, id: e.currentTarget.dataset.item.reply_id }
    app.circle.replydel(params).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        wx.showToast({
          title: "删除成功",
          icon: "none",
          duration: 1500
        })
        this.getDetail()
        this.comParam.page = 1
        this.getComment([])
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      } else {
        wx.showToast({
          title: "删除失败，请稍后重试",
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  /* 回复评论 */
  reply(params) {
    this.setData({
      write: false,
      content: ""
    })
    wx.showLoading({
      title: "发布中"
    })
    app.circle.reply(params).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        wx.showToast({
          title: "发布成功",
          icon: "none",
          duration: 1500
        })
        this.getDetail()
        this.comParam.page = 1
        this.getComment([])
        console.log(params.to_user)
        app.socket.send(params.to_user)
      } else if (msg.code == -2) {
        /* 帖子已经删除 */
        this.setData({
          detail: "",
          delState: true
        })
      } else if (msg.code == -3) {
        /* 消息已经删除 */
        wx.showToast({
          title: "消息已删除",
          icon: "none",
          duration: 1500
        })
        this.getDetail()
        this.comParam.page = 1
        this.getComment([])
      } else {
        wx.showToast({
          title: msg.msg || "发布失败",
          icon: "none",
          duration: 1500
        })
      }
    })
  },
  tohome: function() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.uid) {
      wx.navigateTo({
        url: "/pages/user/user"
      })
    }
  },
  toCommentDetail(e) {
    let vm = this
    wx.navigateTo({
      url: "/pages/commentDetail/commentDetail?" + "blog_id=" + this.id + "&comment_id=" + e.currentTarget.dataset.parentid,
      events: {
        refreshComments: data => {
          this.comParam.page = 1
          this.getComment([])
        }
      }
    })
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    })
  }
})
