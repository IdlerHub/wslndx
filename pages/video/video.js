//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    list: [],
    tip: true,
    vid: "short-video" + Date.now(),
    top: 27,
    topT:0,
    pause:true,
    showGuide: false,
    nextRtight:1,
    currentTab:0,
    classify:[],
    autoplay: false,
    guideTxt: '下一步',
    vistor: false
    /*  rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    let systemInfo = wx.getSystemInfoSync()
    systemInfo.statusBarHeight == 20 ? '' : this.setData({
      top: 48
    })
    systemInfo.statusBarHeight == 20 ? this.setData({
      topT: 131
    }) : this.setData({
      topT: 176
    })
    this.videoContext = wx.createVideoContext(this.data.vid)
    this.getCategory()
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2]
    if (prePage && prePage.route == "pages/videoItemize/videoItemize") {
      /* 从短视频分类页面过来 */
      this.setData({
        limit: true,
        home: options.home == "true"
      })
      this.param = { type: "category", id: options.id, pageSize: 10, position: "first", include: "yes", categoryId: options.categoryId }
    } else {
      /* 短视频推荐 */
      let share = options.type == "share"
      this.setData({
        vistor: share
      })
      /* 分享卡片进来,提示持续15秒 */
      if (share) {
        setTimeout(() => {
          this.setData({
            tip: false
          })
        }, 5000)
      }
      this.param = { type: "recommend", id: options.id ? options.id : "", page: 1, pageSize: 10, last_id: "" }
    }

    if (this.data.$state.userInfo.mobile) {
      /* 已登录 */
      this.getList([]).then(() => {
        this.setData({
          cur: this.data.list[0],
          index: 0
        })
        app.addVisitedNum(`v${this.data.cur.id}`)
        app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
      })
    }
    app.aldstat.sendEvent("菜单", { name: "短视频" })
    let share = options.type == "share" 
      if (!share) {
        this.setData({
          autoplay: false,
        })
      }
      // this.setData({
      //   autoplay: true
      // })
    let ap = {
      categoryId: 10,
      page: 1,
      pageSize: 10
    }
  },
  onShow(opts){
    console.log(opts)
    if (this.data.$state.userInfo.mobile) {
      if (this.data.$state.newGuide) {
        this.data.$state.newGuide.shortvideo != 0 ?
          this.judgeWifi() : this.setData({
            showGuide: true
          })
        // this.setData({
        //   autoplay: true
        // })
      } else {
        app.getGuide().then(res => {
          if (this.data.$state.newGuide.shortvideo != 0) {
            this.judgeWifi()            
          } else {
            this.setData({
              showGuide: true
            })
          }
        })
      }
    }
  },
  judgeWifi() {
    if (!this.data.$state.flow  && this.data.currentTab == 0) {
      this.setData({
        autoplay: false
      })
      let that = this
      wx.startWifi({
        success: res => {
          wx.getConnectedWifi({
            success: res => {
              console.log(res)
              app.playVedio('wifi')
              that.videoContext.play()
              that.setData({
                autoplay: true,
                pause: false
              })
            },
            fail: res => {
              console.log(res)
              that.videoContext.pause()
              that.setData({
                autoplay: false,
                pause: true
              })
              wx.showModal({
                content: '您当前不在Wi-Fi环境，继续播放将会产生流量，是否选择继续播放?',
                confirmText: '是',
                cancelText: '否',
                confirmColor: '#DF2020',
                success(res) {
                  if (res.confirm) {
                    app.playVedio('flow')
                    that.setData({
                      autoplay: true,
                      pause: false
                    })
                    that.videoContext.play()
                  } else if (res.cancel) {
                    app.playVedio('wifi')
                    that.videoContext.pause()
                    that.setData({
                      pause: true,
                      autoplay: false
                    })
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
          wx.stopWifi({
            success: res => {
              console.log('wifi模块关闭成功')
            }
          })
        }
      })
    } else if (this.data.currentTab == 0) {
      this.setData({
        pause: false,
        autoplay: true
      })
      this.videoContext.play()
    }
  },
  getList(list) {
    let temp = list || this.data.list
    if (this.data.limit) {
      return app.video.category(this.param).then(msg => {
        this.callback(msg, temp)
        return msg
      })
    } else {
      return app.video.list(this.param).then(msg => {
        this.callback(msg, temp)
      })
    }
  },
  getCategory() {
    app.video.categoryMore().then(res =>{
      this.setData({
        classify: res.data
      })
    })
  },
  callback(msg, temp) {
    if (msg.code === 1 && msg.data && msg.data.lists) {
      msg.data.lists.forEach(function(item) {
        item.pw = app.util.tow(item.praise)
        item.fw = app.util.tow(item.forward)
      })
      this.setData({
        list: this.param.position == "end" ? (msg.data.lists || []).concat(temp) : temp.concat(msg.data.lists || [])
      })
      this.param.last_id = msg.data.last_id
    }
  },
  tap() {
    console.log(555)
    if (this.data.pause) {
      this.judgeWifi()
      this.setData({
        pause: false
      })
    } else {
      this.videoContext.pause()
      this.setData({
        pause: true
      })
    }
  },
  scrollTouchStart(e) {
    this.sy = e.touches[0].pageY
  },
  scrollTouchEnd(e) {
    console.log(e)
    let list = this.data.list
    let index = this.data.index
    this.ey = e.changedTouches[0].pageY
    if (this.ey - this.sy > 30) {
      // 下拉

      if (this.param.type == "category" && index == 0) {
        this.param.id = list[0].id
        this.param.position = "end"
        this.param.include = "no"
        this.getList().then(data => {
          if (data.data && data.data.lists) {
            if (data.data.lists.length == 0) {
              /*  已经是第一个了  */
            } else if (data.data.lists.length > 0) {
              this.setData({
                cur: this.data.list[data.data.lists.length - 1],
                index: data.data.lists.length - 1,
                pause: false
              })
            }
          }
        })
      } else {
        this.setData({
          cur: index <= 0 ? list[0] : list[index - 1],
          index: index <= 0 ? 0 : index - 1,
          pause: false
        })
      }
    } else if (this.ey - this.sy < -30) {
      // 上拉
      let temp = index >= list.length - 1 ? (this.param.type == "recommend" ? 0 : index) : index + 1
      this.setData({
        cur: list[temp],
        index: temp,
        pause: false
      })
      if (temp == list.length - 2) {
        //还剩下一个视频时,加载新数据
        if (this.param.type == "recommend") {
          this.param.page += 1
          this.param.id = ""
        } else {
          this.param.id = list[list.length - 1].id
          this.param.position = "first"
          this.param.include = "no"
        }
        this.getList()
      }
    }
    this.vedioRecordAdd()
    app.addVisitedNum(`v${this.data.cur.id}`)
    app.aldstat.sendEvent("短视频播放", { name: this.data.cur.title })
  },
  praise() {
    let list = this.data.list
    let index = this.data.index
    let param1 = {
      id: list[index].id
    }
    if (list[index].praised == 1) {
      // 取消点赞
      app.video.delPraise(param1).then(msg => {
        if (msg.code == 1) {
          list[index].praised = 0
          list[index].praise--
          this.setData({
            list: list,
            cur: list[index]
          })
        }
      })
    } else {
      // 点赞
      app.video.praise(param1).then(msg => {
        if (msg.code == 1) {
          if (msg.data.is_first == 'first') {
            wx.showToast({
              title: '完成短视频首次点赞获得50积分',
              icon: 'success',
              duration: 2000
            })
            app.store.setState({
              'taskStatus[first_shortvideo_parise_status]': 1
            })
          } else if (msg.data.is_first == 'day') {
            wx.showToast({
              title: '完成每日短视频首赞获得20积分',
              icon: 'success',
              duration: 2000
            })
            app.store.setState({
              'dayStatus[day_shortvideo_praise_status]': 1
            })
          }
          list[index].praised = 1
          list[index].praise++
          list[index].praising = true
          this.setData({
            list: list,
            cur: list[index]
          })
        }
      })
      app.aldstat.sendEvent("短视频点赞", { name: this.data.cur.title })
    }
  },
  aniend(e) {
    let list = this.data.list
    let index = this.data.index
    list[index].praising = false
    this.setData({
      list: list,
      cur: list[index]
    })
  },
  // 转发
  share() {
    console.log(share)
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let list = this.data.list
      let index = this.data.index
      let param2 = {
        id: list[index].id
      }
      app.video.share(param2).then(msg => {
        if (msg.code == 1) {
          list[index].forward += 1
          this.setData({
            list: list,
            cur: list[index]
          })
          app.aldstat.sendEvent("短视频转发", { name: this.data.cur.title })
        }
      })
      return {
        title: list[index].title,
        path: "/pages/video/video?id=" + list[index].id + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  // 首页
  tohome() {
    wx.reLaunch({ url: "/pages/index/index" })
  },
  // 短视频分类
  navigate() {
    /* 只能迭代一层 */
    if (this.data.limit) return
    wx.navigateTo({
      url: "/pages/videoItemize/videoItemize?categoryId=" + this.data.cur.category_id + "&share=" + this.data.vistor
    })
  },
  navgateto(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "/pages/videoItemize/videoItemize?categoryId=" + id + "&share=" + this.data.vistor 
    })
  },
  // 完整视频
  complete() {
    let cur = this.data.cur
    wx.navigateTo({
      url: "../detail/detail?id=" + cur.target_id
    })
  },
  // 用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "短视频页" })
  },
  //指引
  nextGuide(e){
    if (this.data.nextRtight == 1) {
      this.setData({
        nextRtight: 2
      })
    } else if (this.data.nextRtight == 2) {
      this.setData({
        nextRtight: 3
      })
    } else if (this.data.nextRtight == 3) {
      this.setData({
        nextRtight: 4,
        guideTxt: '我知道了'
      })
    } else {
      let param = {
        guide_name: 'shortvideo'
      }
      app.user.guideRecordAdd(param).then(res => {
        if (res.code == 1) {
          wx.showToast({
            title: '完成[短视频]新手指引获得45积分',
            icon: 'none',
            duration: 2000
          })
          app.store.setState({
            'taskStatus[shortvideo_guide_status]': 1
          })
          app.getGuide()
          this.judgeWifi()
          this.setData({
            nextRtight: 5
          })
        }
      })
    }
  },
  vedioRecordAdd() {
    let param = { shortvideo_id : this.data.cur.id }
    app.video.recordAdd(param).then( res => {
      if(res.code == 1 ) {
        console.log('发送成功')
      }
    })
  },
  // 获取用户的微信昵称头像
  onGotUserInfo: function(e) {
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.updateBase(e)
    }
  },
  onUnload() {
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current
    if (this.data.currentTab === cur) {
      return false
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    let cur = event.detail.current
    cur == 0 ? this.judgeWifi() : ''
    this.setData({
      currentTab: cur
    })
  },
})
