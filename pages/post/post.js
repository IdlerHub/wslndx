/*
 * @Date: 2019-06-14 19:54:05
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 16:27:52
 */
//获取应用实例
const app = getApp()
Page({
  data: {
    rlSucFlag: false,
    isRefreshing: false,
    showLoading:false,
    showSheet: false,
    showGuide:true,
    showSheetBox: true,
    guideNum:1,
    guideTxt:'下一步',
    releaseParam: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: "",
      num: 0
    },
    showRelease: false,
    media_type:null,
    showintegral: false,
    top: 20,
    currentTab:0,
    scrolltop: 0
  },
  onLoad(options) {
    this.param = { page: 1, pageSize: 10 }
    this.setData({
      list: []
    })
    this.getList([])
    this.gettop()
    let that = this
    let query = wx.createSelectorQuery().in(this)
    let systemInfo = wx.getSystemInfoSync()
    query.selectAll(".tabnav").boundingClientRect()
      query.exec(res => {
        console.log(res[0][0])
        systemInfo.statusBarHeight < 30 ? this.setData({
          topT: res[0][0].height + 10
        }) : this.setData({
          top: 48,
          topT: res[0][0].height + 28
        }) 
      })
    app.aldstat.sendEvent("菜单", { name: "风采展示" })
  },
  onShow: function() {
    if (app.globalData.postShow) {
      this.setData({
        list:[]
      })
      this.param.page = 1
      this.getList([]).then(() => {
      })
      this.gettop()
      app.globalData.postShow = false
      let joinedList =  [
        {
          "id": 16,
          "title": "艺术书画",
          "image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/15f9b176a7a5136f34e6b0cd009aaddc.png",
          "bimage": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/414bf9f4b62b5cf45a36af612dbec095.png",
          "admin_name": "廖老师说艺术",
          "admin_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/2621dc5d6de8710c8704fbe60cb08c27.png",
          "admin_qrcode_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/b724a4f28fd4779804f7678cc9ea8773.png",
          "members": 39,
          "createtime": 1552742048,
          "weigh": 16,
          "status": 1
        },
        {
          "id": 15,
          "title": "舞蹈健身",
          "image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/baec05d0aca4fd5712e15db2333edd9f.png",
          "bimage": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/22a2f0c273baf9b81bf4f1e442641d61.png",
          "admin_name": "何老师教健身",
          "admin_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/4b50b28a6d3132464a80db63ee4ccc18.png",
          "admin_qrcode_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/a2935916fa958c775eedac667d11832c.png",
          "members": 34,
          "createtime": 1552741973,
          "weigh": 15,
          "status": 1
        },
        {
          "id": 14,
          "title": "音乐汇",
          "image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/1be98bda104e0eeeba7553414aa83bb5.png",
          "bimage": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/0640bc07d1165b75f09d81550633bcf1.png",
          "admin_name": "林老师赏音乐",
          "admin_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/9092adf399a0995b1cc0a8c7ed2b307e.png",
          "admin_qrcode_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/6686f7dd0590088dafb6f997c484f67f.png",
          "members": 14,
          "createtime": 1552741915,
          "weigh": 14,
          "status": 1
        },
        {
          "id": 12,
          "title": "健康养生",
          "image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/8069f0a0fe1c9e0a515fb4012a54d41a.png",
          "bimage": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/c5921126a28ee385a4f5591cbb56d6ef.png",
          "admin_name": "许老师谈养生",
          "admin_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/c0406fd88359fc55439b199c253ec0e6.png",
          "admin_qrcode_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/c2e90c2688bbaeace015ee01cb6f659b.png",
          "members": 9,
          "createtime": 1552741759,
          "weigh": 12,
          "status": 1
        },
        {
          "id": 11,
          "title": "爱旅行",
          "image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/4667972a6f081bc70ce736b1a927e852.png",
          "bimage": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/41caa13fc13f0c1d2591a6b023a928e8.png",
          "admin_name": "邱老师爱旅行",
          "admin_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/246e5d280a732f5cb9e37cc8de5b3d8a.png",
          "admin_qrcode_image": "https:\/\/jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443\/\/uploads\/images\/aa70847df9325acb06baf45030a6ab4f.png",
          "members": 20,
          "createtime": 1552741707,
          "weigh": 11,
          "status": 1
        }
      ]
      this.setData({
        joinedList
      })
    }
    /* 从cdetail-->发帖 */
    if (app.globalData.rlSuc) {
      this.setData({ rlSucFlag: true})
    }
    if (this.data.rlSucFlag) {
      this.rlSuc()
      /* 确保动画只执行一次 */
      this.setData({ rlSucFlag: false })
      app.globalData.rlSuc = false
    }
    let list = this.data.list
    list.forEach(item => {
      if(item.id == app.globalData.detail.id) {
        if(app.globalData.detail.likestatus > 0) {
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
        cancelText:"不保留",
        confirmText: '保留',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
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
  onShareAppMessage: function(ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare()
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button")
      let i = ops.target.dataset.index
      let article = this.data.list[i]
      let bkid = article.id
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
          title: article.content,
          imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
          path: "/pages/pDetail/pDetail?id=" + bkid + "&type=share&uid=" + this.data.$state.userInfo.id
        }
    }
  },
  getList(list) {
    this.setData({
      showLoading: true
    })
    let temp = list || this.data.list
    return app.circle.news(this.param).then(msg => {
      if (msg.code == 1) {
        if (msg.data) {
          let arr = [];
          for (let i in msg.data) {
            arr.push(msg.data[i])
          }
          arr.forEach(function(item) {
            item.fw = app.util.tow(item.forward)
            item.cw = app.util.tow(item.comments)
            item.lw = app.util.tow(item.likes)
            item.image_compress = item.images.map(i => {
              return i.image_compress
            })
            item.images = item.images.map(i => {
              return i.image
            })
            item.auditing = item.check_status
          })
          temp.push(...arr)
          this.setData({
            list: temp
          })
          this.setHeight()
        }
        this.setData({
          showLoading: false
        })
      }
    })
  },
  gettop() {
    return app.circle.bokeblogTop().then(res => {
      if(res.code == 1 ) {
        this.setData({
          bokeTop: res.data
        })
      }
    })
  },
  pagePraise(id) {
    let list = this.data.list , i = 0
    list.forEach((item, index) => {
      item.id == id ? i = index : ''
    })
    if (list[i].likestatus == 1) {
      list[i].likestatus = 0
      list[i].likes--
      this.setData({
        list: list
      })
    } else {
      list[i].likestatus = 1
      list[i].likes++
      this.setData({
        list: list
      })
    }
  },
  praise(e,index) {
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
        } else if (msg.code == -2) {
          wx.showToast({
            title: "帖子已删除",
            icon: "none",
            duration: 1500
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
          // app.socket.send(list[i].uid)
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
          app.socket.send({
            type: 'Bokemessage',
            data: {uid:list[i].uid}
          })
          this.setData({
            list: list
          })
          app.aldstat.sendEvent("秀风采按钮点击",{
            name:'点赞按钮'
          })
        } else if (msg.code == -2) {
          wx.showToast({
            title: "帖子已删除",
            icon: "none",
            duration: 1500
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
  // 写帖成功动效
  rlSuc() {
    /* 重新到第一页 */
    // console.log('adfasdsad')
    this.param.page = 1
    this.getList([])
    this.setData({
      rlAni: true,
      currentTab:0,
      scrollTop: 0
    })
    let timer = setTimeout(() => {
      this.setData({
        rlAni: false
      })
      clearTimeout(timer)
    }, 2000)
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
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../pDetail/pDetail?id=" + id
    })
  },
  //下拉刷新
  itemtouch(e) {
    if(this.data.scrolltop == 0) {
      var moveY= e.touches[0].clientY;
      var diffY = this.startY - moveY;
      console.log(diffY)
      if(diffY> -10 ) {
        return
      } else {
        this.param.page = 1
      this.setData({
        isRefreshing: true
      })
      this.getList([]).then(() => {
        wx.stopPullDownRefresh()
        let timer = setTimeout(() => {
          this.setData({
            isRefreshing: false
          })
          clearTimeout(timer)
        }, 1000)
      })
      this.gettop()
      }
    }
  },
  //上拉加载
  scrolltolower() {
    this.param.page++
    this.getList()
  },
  touchStart(e) {
    if (e.touches.length == 1) {
        this.startY=e.touches[0].clientY
    }
  },
  scrollinfo(e) {
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  toUser(e) {
    // console.log(e)
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    } else {
      wx.navigateTo({
        url: `/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&university_name=${e.currentTarget.dataset.item.university_name}&avatar=${e.currentTarget.dataset.item.avatar}&addressCity=${e.currentTarget.dataset.item.province}`
      })
    }
  },
  toMessage() {
    wx.navigateTo({
      url: "/pages/message/message"
    })
  },
  switchTab(event) {
    let cur = event.detail.current
    this.setData({
      currentTab: cur
    })
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
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "秀风采页" })
  },
  onUnload() {
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    })
  },
  //用户黑名单判断
  handleRelse(status) {
    if (this.data.$state.userInfo.status !== 'normal') {
      wx.showModal({
        content: '由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理'
      })
    } else {
      if(status.currentTarget.dataset.type == 'reply' ) {
        wx.navigateTo({
          url: `/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`,
        })
        app.aldstat.sendEvent("秀风采按钮点击",{
          name:'评论按钮'
        })
      } else {
        wx.navigateTo({
          url: '/pages/release/release',
        })
        app.aldstat.sendEvent("秀风采按钮点击",{
          name:'发帖按钮'
        })
      }
    }
  },
  //收藏风采
  collect(e){
    let blog_id = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    // console.log(status)
    let blog_index = e.currentTarget.dataset.index
    this.setData({
      blog_id,
      blog_index
    })
    status == 0 ? this.setData({
      showSheet: true,
      showSheetBox: true
    }) : this.setData({
      showSheet: true,
      showSheetBox: false
    })
  },
  cancelCollection() {
    let param = { blog_id: this.data.blog_id }
    app.circle.collectCancel(param).then(res => {
      if (res.code == 1) {
        let list = this.data.list
        list[this.data.blog_index].collectstatus = 0
        this.setData({
          list
        })
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 800
        })
      } else {
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
      if(res.code == 1) {
        let list = this.data.list
        list[this.data.blog_index].collectstatus = 1
        this.setData({
          list
        })
        this.closeSheet()
        wx.showToast({
          title: res.msg,
          icon: 'success',
          duration: 1500
        })
      } else {
        this.closeSheet()
        wx.showToast({
          title: res.msg,
          image:'/images/warn.png',
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
  // 指引联动
  nextGuide() {
    if(this.data.guideNum == 1 ) {
      this.setData({
        guideNum: 2,
        guideTxt:'我知道了'
      })
    } else {
      let param = {
        guide_name: 'blog'
      }
      app.user.guideRecordAdd(param).then(res => {
        if (res.code == 1) {
          this.setData({
            integral: '+45 积分',
            integralContent: '完成[秀风采]新手指引',
            showintegral: true
          })
          setTimeout(()=> {
            this.setData({
              showintegral: false
            })
          }, 2000)
          app.getGuide()
        }
      })
    }
  },
  setHeight() {
    let that = this
    let query = wx.createSelectorQuery().in(this)
    query.selectAll(".name").boundingClientRect()
      query.exec(res => {
        let arr = []
        res[0].forEach((item, index) => {
          // console.log(item)
          if (item.height >= 120) {
            arr.push(index)
          }
        })
      })
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content)
  }
})
