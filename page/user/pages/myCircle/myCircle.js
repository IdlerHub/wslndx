/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 14:32:02
 */
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext();
const record = require('../../../../utils/record')

//Page Object
Page({
  data: {
    circle: [],
    isRefreshing: false,
    releaseParam: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: "",
      num: 0
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
  pageName: '风采展示（风采展示）',
  //options(Object)
  onLoad: function (options) {
    this.circleParam = { page: 1, pageSize: 10, }
    this.getCircle([])
  },
  onReady: function () { },
  onShow: function () {
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
    record.initRecord(this)
    this.initRecord()
  },
  onHide: function () { 
    innerAudioContext.stop()
    app.backgroundAudioManager.stop()
  },
  onUnload: function () {
    innerAudioContext.stop()
    app.backgroundAudioManager.stop()
  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    })
    this.circleParam.page = 1
    this.getCircle([]).then(() => {
      wx.stopPullDownRefresh()
      this.setData({
        isRefreshing: false
      })
    })
  },
  onReachBottom: function () {
    this.circleParam.page++
    this.getCircle()
  },
  getCircle(list) {
    let circle = list || this.data.circle
    this.circleParam.us_id = 0
    return app.circle.myNews(this.circleParam).then(msg => {
      if (msg.data) {
        msg.data.forEach(function (item) {
          item.fw = app.util.tow(item.forward)
          item.cw = app.util.tow(item.comments)
          item.lw = app.util.tow(item.likes)
          item.image_compress = item.images.map(i => {
            return i.image_compress
          })
          item.images = item.images.map(i => {
            return i.image
          })
          item.auditing = new Date().getTime() - new Date(item.createtime * 1000) < 7000
          item.timer = {
            minute: parseInt(item.duration / 60),
            second: item.duration - (parseInt(item.duration / 60) * 60)
          }
          circle.push(item)
        })
      }
      this.setData({
        circle: circle
      })
    }).catch(err => {
      if (err.code == -2) {
        this.setData({
          circle: []
        })
      }
    })
  },
  //图片预览
  previewImage(e) {
    let that = this
    let urls = e.currentTarget.dataset.urls
    let current = e.currentTarget.dataset.current
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    })
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/page/post/pages/pDetail/pDetail?id=" + id
    })
  },
  del(e) {
    let i = e.currentTarget.dataset.index
    let circle = this.data.circle
    let param = {
      blog_id: circle[i].id
    }
    wx.showModal({
      title: "",
      content: "是否删除帖子",
      success: res => {
        if (res.confirm) {
          app.circle.delPost(param).then(msg => {
            circle.splice(i, 1)
            this.setData({
              circle: circle
            })
          })
        } else {
          return
        }
      }
    })
  },
  // 写帖成功动效
  rlSuc() {
    this.setData({
      rlAni: true
    })
    let timer = setTimeout(() => {
      this.setData({
        rlAni: false
      })
      clearTimeout(timer)
    }, 2000)
    this.circleParam.page = 1
    this.getCircle([])
  },
  onShareAppMessage: function (ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      let i = ops.target.dataset.index
      let article = this.data.circle[i]
      let bkid = article.id
      app.circle.addForward({ blog_id: bkid }).then(res => {
        let list = this.data.circle
        list[i].forward += 1
        this.setData({
          circle: list
        })
      })
      return {
        title: app.util.delHtmlTag(article.content),
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  praise(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.circle
    let param = {
      blog_id: list[i].id
    }
    if (list[i].likestatus == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        list[i].likestatus = 0
        list[i].likes--
        this.setData({
          circle: list
        })
      })
    } else {
      // 点赞
      app.circle.praise(param).then(msg => {
        list[i].likestatus = 1
        list[i].likes++
        list[i].praising = true
        this.setData({
          circle: list
        })
      })
    }
  },
  aniend(e) {
    var i = e.currentTarget.dataset.index
    var list = this.data.circle
    list[i].praising = false
    this.setData({
      list: list
    })
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    })
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content)
  },
  initRecord() {
    innerAudioContext.onPlay(() => {
      this.playTiemr ? [clearInterval(this.playTiemr), this.playTiemr= null ] : ''
      this.playTiemr = setInterval(() => {
        if (this.data.playVoice.playTiemr.minute == this.itemTimer.minute && this.data.playVoice.playTiemr.second == this.itemTimer.second) {
          innerAudioContext.stop()
          this.setData({
            'playVoice.status': 0,
            'playVoice.id': 0,
          })
          return
        }
        let num = this.data.playVoice.playTiemr.second
        num += 1
        num > 60 ? this.setData({
          'playVoice.playTiemr.minute': this.data.playVoice.playTiemr.minute += 1,
          'playVoice.playTiemr.second': 0
        }) : this.setData({
          'playVoice.playTiemr.second': num
        })
      }, 1000)
    })

    innerAudioContext.onStop(() => {
      this.playTiemr ? [clearInterval(this.playTiemr), this.playTiemr= null]  : ''
      this.setData({
        'playVoice.status': 0,
        'playVoice.id': 0,
      })
    })
  },
  checkRecord(e) {
    let duration = e.currentTarget.dataset.duration,
      recordUrl = e.currentTarget.dataset.record,
      id = e.currentTarget.dataset.id
    this.itemTimer = e.currentTarget.dataset.timer
    if (this.data.playVoice.status && recordUrl == this.recordUrl) {
      this.setData({
        'playVoice.status': 0,
      })
      innerAudioContext.stop();
    } else {
      this.recordUrl = recordUrl

      this.setData({
        'playVoice.status': 1,
        'playVoice.id': id,
        'playVoice.playTiemr.minute': 0,
        'playVoice.playTiemr.second': 0
      })
      innerAudioContext.src = recordUrl;
      innerAudioContext.play();
    }
  }
})
