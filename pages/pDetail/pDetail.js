/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 18:06:54
 */
//index.js
//获取应用实例
const app = getApp()
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    nav: [{ name: "评论", class: ".comment", num: 0 }, { name: "点赞", class: ".praise", num: 0 }],
    isRefreshing: false,
    tip: true,
    delState: false,
    contenLength: 0,
    replycontenLength: 0,
    showvoice: false,
    placeholder: '添加你的评论',
    content:'',
    replycontent:'',
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: '',
    voivetext: '',
    voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png',
    replyshow: false,
    showintegral:false
    /* rect: wx.getMenuButtonBoundingClientRect() */
  },
  onLoad(options) {
    this.id = options.id
    this.comParam = { blog_id: this.id, page: 1, pageSize: 10 }
    this.praParam = { blog_id: this.id, page: 1, pageSize: 10 }
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
          this.getComment([], options.comment)
          this.getPraise()
        }
      })
    }
    if (this.data.$state.blogcomment[options.id.trim()]) {
      this.setData({
        content: this.data.$state.blogcomment[options.id.trim()].replycontent,
        contenLength: this.data.$state.blogcomment[options.id.trim()].replycontent != '' ? this.data.$state.blogcomment[options.id.trim()].replycontent.length : 0
      })
    }
  },
  onShow() {
    this.initRecord()
    this.getRecordAuth()
  },
  onUnload() {
    wx.onMemoryWarning(function () {
      console.log('内存不足')
    })
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
      console.log(height)
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
        let arr = [] , brr = []
        detail.images.forEach(function(i) {
          arr.push(i.image)
        })
        detail.images.forEach(function (i) {
          brr.push(i.image_compress)
        })
        detail.images = arr
        detail.image_compress= brr
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
          // app.socket.send(this.data.detail.uid)
          app.socket.send({
            type: 'Bokemessage',
            data: {uid: this.data.detail.uid}
          })
          if (msg.data.is_first == 'first') {
            this.setData({
              integral: '+50 积分',
              integralContent: '完成[秀风采]首次点赞',
              showintegral: true
            })
            setTimeout(() => {
              this.setData({
                showintegral: false
              })
            }, 2000)
          }
          this.setData({ detail: detail })
          app.aldstat.sendEvent("秀风采按钮点击",{
            name:'点赞按钮'
          })
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
          replyplaceholder: e.currentTarget.dataset.reply.nickname != undefined ? '回复 ' + e.currentTarget.dataset.reply.nickname : '回复 ' + e.currentTarget.dataset.reply.from_user ,
          replyshow:true
        })
        if (this.data.$state.blogcomment[this.data.detail.id]) {
          if (this.replyParent && this.data.$state.blogcomment[this.data.detail.id]['replyParent']) {
            this.data.$state.blogcomment[this.data.detail.id]['replyParent'][this.replyParent] ?
            this.setData({
                replycontent: this.data.$state.blogcomment[this.data.detail.id]['replyParent'][this.replyParent] || '',
                replycontenLength: this.data.$state.blogcomment[this.data.detail.id]['replyParent'][this.replyParent].length || 0,
                replyshow: true
            }) : ''
          } else if (this.data.$state.blogcomment[this.data.detail.id]['replyInfo']){
            console.log(this.data.$state.blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id])
            this.setData({
              replycontent: this.data.$state.blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] != undefined? this.data.$state.blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] : '',
              replycontenLength: this.data.$state.blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] != undefined ? this.data.$state.blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id].length : 0,
              replyshow: true
            }) 
          }
        }
      } else {
        /* 评论 */
        this.replyInfo = null
        this.replyParent = null
        this.setData({
          replyplaceholder: '',
          replyshow:false
        })
        app.aldstat.sendEvent("秀风采按钮点击",{
          name:'评论按钮'
        })
      }
      // wx.pageScrollTo({
      //   scrollTop: 1000
      // })
      this.setData({
        write: true,
        focus: true
      })
    }
  },
  textHeight(e) {
    this.setData({
      textHeight: e.detail.height + 'px'
    })
  },
  touchStart() {
    setTimeout(()=> {
      this.setData({
        write: false
      })
    },200)
  },
  hide() {
    this.setData({
      write: false
    })
  },
  input(e) {
    if (this.data.replyshow) {
      this.setData({
        replycontent: e.detail.value,
        replycontenLength: e.detail.value.length
      })
      let blogcomment = this.data.$state.blogcomment
      blogcomment[this.data.detail.id] ? '' : blogcomment[this.data.detail.id] = {}
      if (this.replyParent) {
        blogcomment[this.data.detail.id]['replyParent'] ? '' : blogcomment[this.data.detail.id]['replyParent'] = {}
        blogcomment[this.data.detail.id]['replyParent'][this.replyParent] = this.data.replycontent
      } else {
        blogcomment[this.data.detail.id]['replyInfo'] ? '' : blogcomment[this.data.detail.id]['replyInfo'] = {}
        blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] = this.data.replycontent
      }
      app.store.setState({
        blogcomment
      })
    } else {
      this.setData({
        content: e.detail.value,
        contenLength: e.detail.value.length
      })
      let blogcomment = this.data.$state.blogcomment
      blogcomment[this.data.detail.id] ? '' : blogcomment[this.data.detail.id] = {}
      blogcomment[this.data.detail.id]['replycontent'] = this.data.content
      app.store.setState({
        blogcomment
      })
    }
  },
  // 发布评论
  release() {
    if (!!this.data.content.trim() || !!this.data.replycontent.trim()) {
      if (this.replyParent) {
        /* 回复别人的回复 */
        let params = {
          blog_id: +this.id,
          comment_id: this.replyParent,
          reply_type: 2,
          reply_id: this.replyInfo.reply_id,
          reply_content: this.data.replycontent,
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
          reply_content: this.data.replycontent,
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
      showvoice: false,
      voicetime:0,
      showvoiceauto: false
    })
    wx.showLoading({
      title: "发布中"
    })
    app.circle.comment(param).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        let blogcomment = this.data.$state.blogcomment 
        blogcomment[this.data.detail.id]['replycontent'] = ''
        app.store.setState({
          blogcomment
        })
        if (msg.data.is_first == 'first') {
          this.setData({
            integral: '+50 积分',
            integralContent: '完成[秀风采]首次评论',
            showintegral: true
          })
          setTimeout(() => {
            this.setData({
              showintegral: false
            })
          }, 2000)
        } else if (msg.data.is_first == 'day') {
          this.setData({
            integral: '+20 积分',
            integralContent: '完成每日[秀风采]首评评论',
            showintegral: true
          })
          setTimeout(() => {
            this.setData({
              showintegral: false
            })
          }, 2000)
        } else {
          wx.showToast({
            title: "发布成功",
            icon: "none",
            duration: 1500
          })
        }
        this.getDetail()
        this.setData({
          content: '',
          contenLength: 0
        })
        this.comParam.page = 1
        // app.socket.send(this.data.detail.uid)
        app.socket.send({
          type: 'Bokemessage',
          data: {uid: this.data.detail.uid }
        })
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
  getComment(list, options) {
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
        if (options) {
          this.data.comment.length > 0 ? this.setData({
            write: false
          }) : this.show()
        }
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
        setTimeout(() => {
          this.setData({
            praise: praise.concat(msg.data || [])
          })
        }, 500)
        setTimeout(() => {
          this.setHeight()
        }, 1000)
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
      urls: urls, // 需要预览的图片http链接列表
      complete: () => {
        console.log('关闭成功')
      }
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
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: '#df2020',
      success: res => {
        if (res.confirm) {
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
        }
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
        }
      }
    })
  },
  /* 回复评论 */
  reply(params) {
    this.setData({
      write: false,
      showvoice: false,
      voicetime: 0,
      showvoiceauto: false
    })
    wx.showLoading({
      title: "发布中"
    })
    app.circle.reply(params).then(msg => {
      wx.hideLoading()
      if (msg.code == 1) {
        if (msg.data.is_first == 'first') {
          this.setData({
            integral: '+50 积分',
            integralContent: '完成[秀风采]首次评论',
            showintegral: true
          })
          setTimeout(() => {
            this.setData({
              showintegral: false
            })
          }, 2000)
        } else if (msg.data.is_first == 'day') {
          this.setData({
            integral: '+20 积分',
            integralContent: '完成每日[秀风采]首评评论',
            showintegral: true
          })
          setTimeout(() => {
            this.setData({
              showintegral: false
            })
          }, 2000)
        } else {
          wx.showToast({
            title: "发布成功",
            icon: "none",
            duration: 1500
          })
        }
        let blogcomment = this.data.$state.blogcomment
        if(this.replyParent) {
          blogcomment[this.data.detail.id]['replyParent'][this.replyParent] = ''
          this.setData({
            replycontent: ""
          })
        } else {
          blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] = ''
          this.setData({
            replycontent: ""
          })
        }
        app.store.setState({
          blogcomment
        })
        this.getDetail()
        this.comParam.page = 1
        this.getComment([])
        console.log(params.to_user)
        // app.socket.send(params.to_user)
        app.socket.send({
          type: 'Bokemessage',
          data: {uid: params.to_user }
        })
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
      wx.switchTab({
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
  },
  showvoice(e) {
    this.setData({
      showvoice: true,
      write: false,
    }) 
  },
  showWrite(e) {
      this.setData({
        write: true,
        showvoice: false,
        writeTow: true,
        focus: true,
        showvoiceauto: false,
        voicetime: 0
      })
      if(this.replyshow) {
        this.setData({
          replycontenLength: this.data.replycontent.length || 0
        })
      } else {
        this.setData({
          contenLength: this.data.content.length || 0
        })
      }
  },
  // 语音
  // 权限询问
  authrecord() {
    this.setData({
      focus: false
    })
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content: '您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能',
        confirmText: '去授权',
        confirmColor: "#df2020",
        success: res => {
          if (res.confirm) {
            wx.openSetting({})
          }
        }
      })
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: 'scope.record',
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          console.log("succ auth")
          app.store.setState({
            authRecord: true
          })
        },
        fail() {
          console.log("fail auth")
          app.store.setState({
            authRecordfail: true
          })
        }
      })
    }
  },
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        let record = res.authSetting['scope.record']
        app.store.setState({
          authRecord: record || false,
        })
      },
      fail(res) {
        console.log("fail")
      }
    })
  },
  /**
 * 初始化语音识别回调
 */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      clearInterval(this.timer)
      this.setData({
        newtxt: res.result,
        voiceActon: false
      })
    }

    // 识别结束事件
    manager.onStop = (res) => {
      clearInterval(this.timer)
      // 取出录音文件识别出来的文字信息
      if (!this.data.showvoiceauto) return
      let text = res.result
      this.data.replyshow ? text = this.data.replycontent + text : text = this.data.content + text
      // 获取音频文件临时地址
      let filePath = res.tempFilePath
      console.log(filePath)
      let duration = res.duration
      if (res.result == '') {
        this.setData({
          voicetextstatus: '未能识别到文字'
        })
        return
      }
      this.data.replyshow ? this.setData({
        replycontent: text
      }) : this.setData({
        content: text
      })
      if (this.data.replyshow) {
        let blogcomment = this.data.$state.blogcomment
        blogcomment[this.data.detail.id] ? '' : blogcomment[this.data.detail.id] = {}
        if (this.replyParent) {
          blogcomment[this.data.detail.id]['replyParent'] ? '' : blogcomment[this.data.detail.id]['replyParent'] = {}
          blogcomment[this.data.detail.id]['replyParent'][this.replyParent] = this.data.replycontent
        } else if (this.replyInfo) {
          blogcomment[this.data.detail.id]['replyInfo'] ? '' : blogcomment[this.data.detail.id]['replyInfo'] = {}
          blogcomment[this.data.detail.id]['replyInfo'][this.replyInfo.id] = this.data.replycontent
        }
        app.store.setState({
          blogcomment
        })
      } else {
        let blogcomment = this.data.$state.blogcomment
        blogcomment[this.data.detail.id] ? '' : blogcomment[this.data.detail.id] = {}
        blogcomment[this.data.detail.id]['replycontent'] = this.data.content
        app.store.setState({
          blogcomment
        })
      }
      this.setData({
        voicetext: res.result,
        voicetextstatus: '',
        filePath,
        voiceActon: false
      })
    }

    // 识别错误事件
    manager.onError = (res) => {
      clearInterval(this.timer)
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
        voiceActon: false
      })
    }
  },
  touchstart() {
    this.setData({
      voiceActon: true,
      voicetextstatus: '正在语音转文字…'
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
        duration: 2000
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
  // 语音播放
  playvoice() {
    innerAudioContext.src = this.data.filePath;
    console.log(this.data.filePath)
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      this.setData({
        voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png'
      })
    })
    innerAudioContext.onEnded(() => {
      this.setData({
        voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png'
      })
    })
  },
  relacevoice() {
    let text = '', voicetext = this.data.voicetext, blogcomment = this.data.$state.blogcomment
    if (this.data.replyshow) {
      text = this.data.replycontent.replace(voicetext, '')
      this.setData({
        showvoiceauto: false,
        replycontent: text,
        voicetime: 0,
        filePath: ''
      })
      if (this.replyParent) {
        blogcomment[this.data.detail.id].replyParent[this.replyParent] = text
        app.store.setData({
          blogcomment
        })
      } else {
        blogcomment[this.data.detail.id].replyInfo[this.replyInfo.id] = text
        app.store.setData({
          blogcomment
        })
      }
    } else {
      text = this.data.content.replace(voicetext, '')
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: ''
      })
      blogcomment[this.data.detail.id].replycontent = text
      app.store.setData({
        blogcomment
      })
    }

  },
  closevoiceBox() {
    this.setData({
      showvoice: false,
      write: false,
      showvoiceauto:false,
      voicetime: 0
    })
  },
  // 计时器
  voicetime() {
    clearInterval(this.timer)
    let time = 0
    this.timer = setInterval(() => {
      time += 1
      if (!this.data.voiceActon) {
        clearInterval(this.timer)
        return
      }
      this.setData({
        voicetime: time
      })
    }, 1000)
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content)
  }
})
