//index.js
//获取应用实例
const app = getApp()
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    sort: 0,
    nav: [{
      name: "剧集"
    }, {
      name: "讨论"
    }, {
      name: "简介"
    }],
    height: 0,
    tip: true,
    showGuide: true,
    comment: [],
    keyheight: 0,
    write: true,
    comment: [],
    focus: false,
    sublessons: [],
    contenLength: 0,
    moreSublessons: 'moreSublessons',
    placeholder: '写评论',
    showvoice: false,
    replycomment: '欢迎发表观点',
    voicetime: 0,
    showvoiceauto: false
    /* rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    /*todo:考虑去掉that*/
    let that = this
    this.videoContext = wx.createVideoContext("myVideo")
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let system = wx.getSystemInfoSync().model.indexOf('iPhone')
    system == -1 ? this.setData({
      paddingTop: true
    }) : ''
    let query = wx.createSelectorQuery().in(this)
    query.select("#myVideo").boundingClientRect()
    query.select(".info").boundingClientRect()
    query.select(".nav").boundingClientRect()
    query.exec(res => {
      let videoHeight = res[0].height
      let infoHeight = res[1].height
      let navHeight = res[2].height + 10
      let scrollViewHeight = windowHeight - videoHeight - infoHeight - navHeight
      that.setData({
        vistor: options.type == "share", //游客从分享卡片过来
        height: scrollViewHeight,
        currentTab: 0,
        navScrollLeft: 0,
        id: options.id,
        curid: options.curid || null,
        cur: {}
      })
      if (that.data.$state.newGuide) {
        that.data.$state.newGuide.lesson == 0 ?
          this.setData({
            currentTab: 1
          }) : ''
      }
      if (that.data.vistor) {
        setTimeout(() => {
          that.setData({
            tip: false
          })
        }, 5000)
      }
      this.comParam = this.praParam = {
        lesson_id: options.id || this.data.detail.id,
        page: 1,
        pageSize: 10
      }
      wx.setNavigationBarTitle({
        title: options.name || ""
      })
      if (options.play) {
        that.setData({
          hideRecode: true
        })
        that.getDetail(function() {
          wx.nextTick(() => {
            that.recordAdd()
          })
        })
      } else if (that.data.$state.userInfo.mobile) {
        that.getDetail()
      }
    })
    this.sublessParam = {
      id: options.id || this.data.detail.id,
      page: 1,
      pageSize: 10,
      sort: this.data.sort
    }
  },
  onShow() {
    app.getGuide()
    this.initRecord()
  },
  onUnload() {
    this.data.$state.newGuide.lesson == 0 ? this.closeGuide() : ''
  },
  onGotUserInfo: function(e) {
    app.updateBase(e)
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
    this.param = {
      id: this.data.id,
      sort: this.data.sort,
      page: 1,
      pageSize: 10
    }
    return app.classroom.detail(this.param).then(msg => {
      if (msg.code === 1) {
        msg.data.sublesson.forEach(function(item) {
          item.minute = (item.film_length / 60).toFixed(0)
        })
        wx.setNavigationBarTitle({
          title: msg.data.title
        })
        this.setData({
          detail: msg.data,
          sublessons: msg.data.sublesson
        })
        this.manage()
        this.getComment()
      }
    })
  },
  getSublessons(list) {
    console.log(this.sublessParam)
    let comment = list
    app.classroom.detail(this.sublessParam).then(res => {
      res.data.sublesson.forEach(function(item) {
        item.minute = (item.film_length / 60).toFixed(0)
      })
      comment.push(...res.data.sublesson)
      this.setData({
        sublessons: comment,
        moreSublessons: 'moreSublessons'
      })
    })
  },
  moreSublessons() {
    this.setData({
      moreSublessons: ''
    })
    this.sublessParam.page++
      this.sublessParam.sort = this.data.sort
    this.getSublessons(this.data.sublessons)
  },
  ended() {
    this.setData({
      playing: false
    })
    let param = {
      lesson_id: this.data.detail.id,
      sublesson_id: this.data.cur.id
    }
    console.log(param)
    let show = true
    app.classroom.sublessonfinish(param).then(res => {
      if (res.code == 1) {
        if (res.data.is_first == 'first') {
          wx.showToast({
            title: '完成首次学习课程获得70积分',
            icon: 'none',
            duration: 2000
          })
          let taskStatus = this.data.$state.taskStatus
          taskStatus['first_learn_status'] = 1
          app.store.setState({
            taskStatus
          })
        } else if (res.data.is_first == 'finish') {
          wx.showToast({
            title: '完成学完一门新课程获得20积分',
            icon: 'none',
            duration: 2000
          })
        }
      }
      app.classroom.detail(this.param).then(msg => {
        if (msg.code === 1) {
          this.setData({
            "detail.progress": msg.data.progress
          })
        }
      })
    })
  },
  manage() {
    let detail = this.data.detail
    let sublesson = this.data.sublessons
    let current = 0,
      total = sublesson.length,
      cur = {}
    sublesson.forEach(item => {
      if (item.played == 1) {
        current++
      }
      if (item.id == detail.current_sublesson_id || item.id == this.data.curid) {
        cur = item
      }
    })
    if (detail.current_sublesson_id == 0 && !this.data.curid) {
      cur = detail.sublesson[0]
    }
    this.setData({
      // "detail.progress": parseInt((current / total) * 100 + ""),
      cur: cur
    })
  },
  // 排序
  order() {
    this.setData({
      sort: this.data.sort === 0 ? 1 : 0
    })
    this.sublessParam.page = 1
    let param = {
      id: this.data.id,
      sort: this.data.sort,
      page: 1,
      pageSize: 10
    }
    let query = wx.createSelectorQuery().in(this)
    query.selectAll("#sublessonsd").boundingClientRect()
    query.exec(res => {
      param.pageSize = res[0].length
      app.classroom.detail(param).then(msg => {
        if (msg.code === 1) {
          msg.data.sublesson.forEach(function(item) {
            item.minute = (item.film_length / 60).toFixed(0)
          })
          wx.setNavigationBarTitle({
            title: msg.data.title
          })
          this.setData({
            detail: msg.data,
            sublessons: msg.data.sublesson
          })
        }
      })
    })
    // this.getDetail()
  },
  // 收藏
  collect() {
    /*todo:考虑去掉that*/
    let that = this
    let param = {
      lesson_id: this.param.id
    }
    if (this.data.detail.collected == 1) {
      wx.showModal({
        title: "",
        content: "是否取消收藏",
        success: function(res) {
          if (res.confirm) {
            app.classroom.collectCancel(param).then(msg => {
              if (msg.code == 1) {
                that.setData({
                  "detail.collected": 0
                })
              }
            })
          } else if (res.cancel) {
            return
          }
        }
      })
    } else {
      app.classroom.collect(param).then(msg => {
        if (msg.code == 1) {
          this.setData({
            "detail.collected": 1
          })
        }
      })
      //用于数据统计
      app.aldstat.sendEvent("课程收藏", {
        name: this.data.title
      })
    }
  },
  // 选择剧集
  select(e) {
    let i = e.currentTarget.dataset.index
    let list = this.data.sublessons
    this.setData({
      cur: list[i]
    })
    wx.nextTick(() => {
      this.recordAdd()
    })
  },
  recordAdd() {
    let param = {
      lesson_id: this.param.id,
      sublesson_id: this.data.cur.id
    }
    let that = this
    if (this.data.$state.flow) {
      that.recordAddVedio(param)
    } else {
      wx.startWifi({
        success: res => {
          wx.getConnectedWifi({
            success: res => {
              console.log(res)
              app.playVedio('wifi')
              that.recordAddVedio(param)
            },
            fail: res => {
              console.log(res)
              wx.showModal({
                content: '您当前不在Wi-Fi环境，继续播放将会产生流量，是否选择继续播放?',
                confirmText: '是',
                cancelText: '否',
                confirmColor: '#DF2020',
                success(res) {
                  if (res.confirm) {
                    app.playVedio('flow')
                    that.recordAddVedio(param)
                  } else if (res.cancel) {
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
        },
      })
    }
  },
  recordAddVedio(param) {
    app.classroom.recordAdd(param).then(msg => {
      if (msg.code == 1) {
        this.getDetail().then(() => {
          this.getProgress()
          this.videoContext.play()
          this.setData({
            playing: true,
            hideRecode: true
          })
          app.addVisitedNum(`k${this.data.cur.id}`)
        })
      }
    })
  },
  // 获取讨论
  getComment(list, options) {
    let comment = list || this.data.comment
    return app.classroom.commentDetail(this.comParam).then(msg => {
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
  onReachBottom() {
    if (this.data.currentTab == 1) {
      this.comParam.page++
        this.getComment()
    }
  },
  setHeight() {
    let that = this
    if (this.data.currentTab == 1) {
      let query = wx.createSelectorQuery().in(this)
      query.select(".comment").boundingClientRect()
      query.exec(res => {
        let height = res[0].height - (-110)
        console.log(height)
        height < 100 ? that.setData({
            height: 700
          }) :
          that.setData({
            height: height
          })
        if (height == 110) {
          that.setData({
            height: 400
          })
        }
      })
    } else {
      this.setData({
        height: 306
      })
    }
  },
  getProgress() {
    var lesson = wx.getStorageSync("lessonProgress")
    if (this.data.cur.id == lesson.id) {
      this.videoContext.seek(lesson.time)
    }
    // console.log(lesson)
    // if (lesson) {
    //   for (let i in lesson) {
    //     i == this.data.cur.id ? this.videoContext.seek(lesson[this.data.cur.id].time) : ''
    //   }
    // }
  },
  timeupdate(e) {
    // let videoTime = {}
    // let that = this
    // videoTime[this.data.cur.id] = { id: this.data.cur.id, time: e.detail.currentTime}
    // let lesson = wx.getStorageSync("lessonProgress")
    // console.log(lesson)
    // if (lesson) {
    //   for (let i in lesson) {
    //     i == this.data.cur.id ? lesson[i] = videoTime[this.data.cur.id] : lesson[this.data.cur.id] = videoTime[this.data.cur.id]
    //   }
    //   wx.setStorage({
    //     key: "lessonProgress",
    //     data: lesson
    //   })
    //   console.log(lesson)
    // } else {
    //   wx.setStorage({
    //     key: "lessonProgress",
    //     data: videoTime 
    //   })
    // }

    wx.setStorage({
      key: "lessonProgress",
      data: {
        id: this.data.cur.id,
        time: e.detail.currentTime
      }
    })
  },
  // 删除讨论
  delComment: function(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: '#df2020',
      success: res => {
        if (res.confirm) {
          let param = {
            lesson_id: this.data.detail.id,
            comment_id: e.currentTarget.dataset.item.id
          }
          app.classroom
            .delComment(param)
            .then(msg => {
              wx.hideLoading()
              if (msg.code == 1) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 1500
                })
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
                  image: '/images/warn.png',
                  duration: 1500
                })
              }
            })
            .finally(() => {
              console.log("hxz")
            })
        }
      }
    })
  },
  navitor() {
    wx.navigateTo({
      url: "../certificate/certificate?name=" + this.data.detail.title
    })
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      app.classroom.share({
        lesson_id: this.data.id,
        sublesson_id: this.data.cur.id
      })
      return {
        title: this.data.detail.title,
        path: "/pages/detail/detail?id=" + this.data.id + "&curid=" + this.data.cur.id + "&type=share&uid=" + this.data.$state.userInfo.id
      }
    }
  },
  tohome: function() {
    wx.reLaunch({
      url: "/pages/index/index"
    })
  },
  // 发布评论
  release() {
    if (!!this.data.content.trim()) {
      if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          lesson_id: +this.data.detail.id,
          comment_id: this.replyParent,
          reply_type: 2,
          reply_id: this.replyInfo.reply_id,
          reply_content: this.data.content,
          to_user: this.replyInfo.reply_user_id
        }
        this.reply(params)
      } else if (this.replyInfo) {
        /* 回复评论 */
        console.log(this.replyInfo)
        let params = {
          lesson_id: +this.replyInfo.lesson_id,
          comment_id: this.replyInfo.id,
          reply_type: 1,
          reply_id: -1,
          reply_content: this.data.content,
          to_user: this.replyInfo.uid
        }
        this.reply(params)
      } else {
        let param = {
          lesson_id: this.data.detail.id,
          content: this.data.content
        }
        this.addComment(param)
      }
    }
  },
  // 增加评论
  addComment(param) {
    app.classroom.addComment(param).then(res => {
      if (res.code == 1) {
        this.setData({
          write: false,
          placeholder: '发评论'
        })
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 800
        })
        this.comParam.page = 1
        this.getComment([])
        this.setData({
          content: "",
          write: true,
          writeTow: false,
          focus: false,
          keyheight: 0,
          contenLength: 0
        })
      } else {
        wx.showToast({
          title: res.msg,
          image: '/images/warn.png',
          duration: 800
        })
      }
    })
  },
  //回复评论
  reply(params) {
    wx.showLoading({
      title: "发布中"
    })
    app.classroom.addReply(params).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        this.setData({
          write: false,
          placeholder: '发评论'
        })
        wx.showToast({
          title: "发布成功",
          icon: "success",
          duration: 1500
        })
        this.comParam.page = 1
        this.getComment([])
        this.setData({
          content: "",
          write: true,
          writeTow: false,
          focus: false,
          keyheight: 0,
          contenLength: 0
        })
        this.replyInfo = null
        this.replyParent = null
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
  /* 删除回复 */
  delReply(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: '#df2020',
      success: res => {
        if (res.confirm) {
          let params = {
            lesson_id: this.data.detail.id,
            comment_id: e.currentTarget.dataset.parentid,
            id: e.currentTarget.dataset.item.reply_id
          }
          app.classroom.delReply(params).then(msg => {
            wx.hideLoading()
            if (msg.code == 1) {
              wx.showToast({
                title: "删除成功",
                icon: "success",
                duration: 1500
              })
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
                image: '/images/warn.png',
                duration: 1500
              })
            }
          })
        }
      }
    })
  },
  input(e) {
    this.setData({
      content: e.detail.value
    })
    this.setData({
      contenLength: e.detail.value.length
    })
  },
  toCommentDetail(e) {
    let vm = this
    wx.navigateTo({
      url: "/pages/commentDetail/commentDetail?" + "lesson_id=" + this.data.detail.id + "&comment_id=" + e.currentTarget.dataset.parentid,
      events: {
        refreshComments: data => {
          this.comParam.page = 1
          this.getComment([])
        }
      }
    })
  },
  show(e) {
    console.log(e)
    if (this.data.$state.userInfo.status !== 'normal') {
      wx.showModal({
        content: '由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理'
      })
    } else {
      if (e && e.target.dataset.reply) {
        /* 回复别人的评论 或者 回复别人的回复  */
        this.replyParent = e.target.dataset.parent
        this.replyInfo = e.target.dataset.reply
        this.setData({
          placeholder: '回复 @' + e.currentTarget.dataset.reply.nickname
        })
      } else {
        /* 评论 */
        this.replyInfo = null
        this.replyParent = null
      }
      this.setData({
        write: false,
        writeTow: true,
        content: '',
        focus: true,
      })
    }
  },
  showvoice() {
    this.setData({
      showvoice: true,
      write: false
    })
  },
  showWrite() {
    let system = {}
    wx.getSystemInfo({
      success: res => {
        system = res
      }
    })
    let query = wx.createSelectorQuery().in(this)
    query.select(".container").boundingClientRect()
    query.exec(res => {
      console.log(res)
      if (res[0].top > -100) {
        if (system.screenHeight < 790) {
          wx.pageScrollTo({
            scrollTop: 232
          })
        }
      }
    })
    if (this.data.$state.userInfo.status !== 'normal') {
      wx.showModal({
        content: '由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理',
        confirmColor: '#df2020',
      })
    } else {
      this.setData({
        write: false,
        writeTow: true,
        focus: true
      })
    }
  },
  keyHeight(e) {
    console.log(e.detail.height)
    if (this.data.keyheight == 0) {
      this.setData({
        keyheight: e.detail.height,
        keyHeight: true
      })
    } else {
      e.detail.height > 0 ? this.setData({
        keyHeight: true
      }) : this.setData({
        keyHeight: false,
        keyheight: 0,
        write: true,
        writeTow: false
      })
    }
  },
  bindblur() {
    this.setData({
      keyheight: 0
    })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", {
      name: "课程详情页"
    })
  },
  closeGuide() {
    let param = {
      guide_name: 'lesson'
    }
    app.user.guideRecordAdd(param).then(res => {
      if (res.code == 1) {
        app.getGuide()
        wx.showToast({
          title: '完成[云课堂]新手指引获得45积分',
          icon: 'none',
          duration: 2000
        })
        let taskStatus = this.data.$state.taskStatus
        taskStatus['lesson_guide_status'] = 1
        app.store.setState({
          taskStatus
        })
        this.setData({
          currentTab: 0
        })
      }
    })
  },
  // 语音
  /**
   * 初始化语音识别回调
   */
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      this.setData({
        newtxt: res.result
      })
    }

    // 识别结束事件
    manager.onStop = (res) => {
      // 取出录音文件识别出来的文字信息
      let text = this.data.text + res.result.replace('。', '')
      // 获取音频文件临时地址
      let filePath = res.tempFilePath
      let duration = res.duration
      if (text == '') {
        this.showRecordEmptyTip()
        return
      }
      this.setData({
        text,
        filePath
      })
    }

    // 识别错误事件
    manager.onError = (res) => {
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })
    }
  },
  touchstart() {
    this.setData({
      voiceActon: true
    })
    this.voicetime()
    manager.start({
      lang: "zh_CN",
    })
  },
  touchend() {
    manager.stop()
    if (this.data.voicetime < 1) {
      wx.showToast({
        title: '说话时间过短',
        icon: 'none',
        duration:2000
      })
    } else {
      this.setData({
        showvoiceauto: true
      })
    }
    this.setData({
      voiceActon: false
    })
  },
  // 计时器
  voicetime() {
    let time = 0
    let it = setInterval(() => {
      time += 1
      if(!this.data.voiceActon){
        clearInterval(it)
      } else {
        this.setData({
          voicetime: time
        })
      }
    }, 1000)
  }
})