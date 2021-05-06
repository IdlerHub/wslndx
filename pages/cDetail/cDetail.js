//index.js
//获取应用实例
const app = getApp()
const record = require('../../utils/record')

Page({
  data: {
    list: [],
    circle: null,
    isRefreshing: false,
    showT: false,
    showSheet: false,
    releaseParam: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: "",
      num: 0,
    },
    playVoice: {
      status: 0,
      duration: 0,
      playTimer: {
        minute: 0,
        second: 0
      },
      id: 0
    }
  },
  pageName: '圈内帖子列表',
  pageRecord: 1,
  onLoad(options) {
    this.id = options.id
    this.param = {
      fs_id: this.id,
      page: 1,
      pageSize: 10
    }
    this.getList([])
    this.getCircleInfo().then(() => {
      wx.setNavigationBarTitle({
        title: this.data.circle.title
      })
      wx.uma.trackEvent('circleClick', {
        circleName: this.data.circle.title
      });
    })
    getCurrentPages().forEach(item => {
      item.route == 'pages/post/post' ? this.postPages = item : ''
      item.route == 'pages/personPage/personPage' ? this.personPage = item : ''
    })
  },
  onShow() {
    record.initRecord(this)
    if (app.globalData.postShow) {
      app.globalData.postShow = false;
    }
    /* 从circle-->发帖 */
    setTimeout(() => {
      if (app.globalData.rlSuc) {
        this.setData({
          rlSucFlag: true
        });
      }
      if (this.data.rlSucFlag) {
        this.rlSuc();
        /* 确保动画只执行一次 */
        this.setData({
          rlSucFlag: false
        });
        app.globalData.rlSuc = false;
      }
    }, 800)
    let list = this.data.list
    list.forEach(item => {
      if (item.id == app.globalData.detail.id) {
        if (app.globalData.detail.likestatus > 0) {
          item.likes = app.globalData.detail.likes
          item.likestatus = app.globalData.detail.likestatus
        } else {
          item.likes = app.globalData.detail.likes
          item.likestatus = app.globalData.detail.likestatus
        }
      }
      this.setData({
        list
      })
    })
    if (((this.data.releaseParam.content != null && this.data.releaseParam.content != "") || this.data.releaseParam.image[0] || this.data.releaseParam.video != null) && this.data.showRelease) {
      let that = this
      wx.showModal({
        content: '保留本次编辑',
        confirmColor: '#df2020',
        cancelText: "不保留",
        confirmText: '保留',
        success(res) {
          if (res.confirm) {
            that.setData({
              showRelease: false
            })
            app.store.setState({
              releaseParam: that.data.releaseParam,
              media_type: that.data.media_type
            })
          } else if (res.cancel) {
            that.setData({
              releaseParam: null
            })
            app.store.setState({
              releaseParam: null,
              media_type: null
            })
          }
        }
      })
    }
  },
  onHide() {},
  onUnload() {
    app.backgroundAudioManager.stop()
  },
  getList: function (list) {
    this.setData({
      showLoading: true
    });
    let temp = list || this.data.list
    return app.circle.myNews(this.param).then(msg => {
      msg.data.forEach(function (item) {
        item.lw = app.util.tow(item.likes)
        item.cw = app.util.tow(item.comments)
        item.image_compress = item.images.map(i => {
          return i.image_compress
        })
        item.images = item.images.map(i => {
          return i.image
        })
        item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
        item.content = app.util.delHtmlTag(item.content)
        item.timer = {
          minute: parseInt(item.duration / 60),
          second: item.duration - (parseInt(item.duration / 60) * 60)
        }
      })
      this.setData({
        list: temp.concat(msg.data),
        showLoading: msg.data.length < 10 ? false : true
      })
    })
  },
  getCircleInfo() {
    return app.circle.fsinfo(this.param).then(msg => {
      this.setData({
        circle: msg.data
      })
    })
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let temp = this.data.list
    let param = {
      blog_id: temp[i].id
    }
    if (temp[i].likestatus) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        temp[i].likestatus = 0
        temp[i].likes--
        this.setData({
          list: temp
        })
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        temp[i].likestatus = 1
        temp[i].likes += 1
        temp[i].praising = true
        this.setData({
          list: temp
        })
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
  join() {
    let circle = this.data.circle
    let param = {
      fs_id: this.id
    }
    return app.circle.addOne(param).then(msg => {
      wx.showToast({
        title: "您已成功加入\r\n【" + circle.title + "】学友圈",
        icon: "none",
        duration: 1500
      })
      circle.joined = 1
      circle.members += 1
      this.setData({
        circle: circle
      })
      getCurrentPages().forEach(v => {
        v.pageName == "秀风采搜索" ? v.data.cList.forEach((a, b) => {
          a.id == circle.id ? v.setData({
            [`cList[${b}].is_follow`]: 1
          }) : ''
        }) : ''
      })
    })
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
  navigate(e) {
    wx.navigateTo({
      url: "/page/post/pages/pDetail/pDetail?id=" + e.currentTarget.dataset.id
    })
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
        wx.hideLoading()
        this.setData({
          isRefreshing: false
        })
        clearTimeout(timer)
      }, 500)
    })
  },
  //上拉加载
  onReachBottom() {
    this.param.page++
    this.getList()
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      let i = ops.target.dataset.index
      let article = this.data.list[i]
      let bkid = article.id
      app.circle.addForward({
        blog_id: bkid
      }).then(res => {
        let list = this.data.list
        list[i].forward += 1
        this.setData({
          list: list
        })
      })
      wx.uma.trackEvent('totalShare', {
        shareName: '秀风采分享'
      });
      return {
        title: app.util.delHtmlTag(article.content),
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/page/post/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    } else {
      wx.navigateTo({
        url: `/page/post/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&avatar=${e.currentTarget.dataset.item.avatar}`
      })
    }
  },
  showbig() {
    this.setData({
      showbig: true
    })
  },
  closeewm() {
    this.setData({
      showbig: false,
      showT: false
    })
  },
  longPress() {
    this.setData({
      showT: true
    })
  },
  closeT() {
    this.setData({
      showT: false
    })
  },
  saveImg() {
    let that = this
    wx.getImageInfo({
      src: this.data.circle.group_qrcode_image,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'none',
              duration: 1500
            })
            that.setData({
              showT: false
            })
          },
          fail() {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1500
            })
          }
        })
      }
    })
  },
  //收藏风采
  collect(e) {
    let blog_id = e.currentTarget.dataset.id,
      status = e.currentTarget.dataset.status,
      blog_index = e.currentTarget.dataset.index,
      flowId = e.currentTarget.dataset.userid,
      is_follow = e.currentTarget.dataset.follow,
      follownickname = e.currentTarget.dataset.name
    this.setData({
      blog_id,
      blog_index,
      flowId,
      is_follow,
      follownickname,
      showSheet: true,
      collectstatus: status
    })
  },
  cancelCollection() {
    let param = {
      blog_id: this.data.blog_id
    }
    app.circle.collectCancel(param).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 800
      })
      this.pagesCollect(this.data.blog_id, 0)
      this.postPages.pagesCollect(this.data.blog_id, 0)
    }).catch(res => {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png',
          duration: 800
        })
      }
    })
    this.setData({
      showSheet: false
    })
  },
  setCollect() {
    let param = {
      blog_id: this.data.blog_id
    }
    app.circle.collect(param).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 1500
      })
      this.pagesCollect(this.data.blog_id, 1)
      this.postPages.pagesCollect(this.data.blog_id, 1)
      this.closeSheet()
    }).catch(res => {
      this.closeSheet()
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png',
          duration: 1500
        })
      }
    })
  },
  closeSheet() {
    this.setData({
      showSheet: false
    })
  },
  attention(e) {
    if (e.currentTarget.dataset.name) {
      this.setData({
        blog_index: e.currentTarget.dataset.index,
        flowId: e.currentTarget.dataset.userid,
        follownickname: e.currentTarget.dataset.name,
      })
    }
    let param = {
      follower_uid: this.data.flowId
    }
    app.user.following(param).then(res => {
      wx.showToast({
        title: '您已成功关注' + this.data.follownickname,
        icon: 'none',
        duration: 1500
      })
      this.setfollow(this.data.flowId, true)
      this.postPages.setfollow(this.data.flowId, true)
      this.closeSheet()
      getCurrentPages().forEach(v => {
        v.pageName == "秀风采搜索" ? v.data.uList.forEach((a, b) => {
          a.id == this.data.flowId ? v.setData({
            [`uList[${b}].is_follow`]: 1
          }) : ''
        }) : ''
      })
    })
  },
  clsocancelFollowing() {
    let param = {
      follower_uid: this.data.flowId
    }
    app.user.cancelFollowing(param).then(res => {
      wx.showToast({
        title: '取消关注成功',
        icon: 'none',
        duration: 1500
      })
      this.setfollow(this.data.flowId)
      this.postPages.setfollow(this.data.flowId)
      this.closeSheet()
    })
  },
  pagesCollect(id, type) {
    if (type) {
      let list = this.data.list,
        flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 1 : ''
      })
      this.setData({
        list
      })
    } else {
      let list = this.data.list,
        flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 0 : ''
      })
      this.setData({
        list
      })
    }
  },
  setfollow(id, follow) {
    if (follow) {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 1 : ''
      })
      this.setData({
        list: this.data.list
      })
    } else {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 0 : ''
      })
      this.setData({
        list: this.data.list
      })
    }
  },
  //用户黑名单判断
  handleRelse(status) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理"
      });
    } else {
      if (status.currentTarget.dataset.bindtype == "reply") {
        wx.navigateTo({
          url: `/page/post/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`
        });
        wx.uma.trackEvent("post_btnClick", {
          btnName: "评论按钮"
        });
      }
    }
  },
  // 写帖成功动效
  rlSuc() {
    /* 重新到第一页 */
    this.setData({
      list: []
    });
    this.param = {
      fs_id: this.id,
      page: 1,
      pageSize: 10
    }
    this.getList([]);
    this.getCircleInfo()
    this.setData({
      rlAni: true,
      scrollTop: 0
    });
    let timer = setTimeout(() => {
      this.setData({
        rlAni: false
      });
      clearTimeout(timer);
    }, 2000);
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
})