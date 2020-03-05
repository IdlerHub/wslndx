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
    showLoading: false,
    showSheet: false,
    showGuide: true,
    showSheetBox: true,
    guideNum: 1,
    guideTxt: '下一步',
    releaseParam: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: "",
      num: 0
    },
    showRelease: false,
    media_type: null,
    showintegral: false,
    top: 26,
    currentTab: 0,
    scrolltop: 0,
    showBottom: false
  },
  pageName: '秀风采页',
  guide: 0,
  onLoad(options) {
    this.param = [{ page: 1, pageSize: 10, is_follow: 0 }, { page: 1, pageSize: 10, is_follow: 1 }]
    this.setData({
      list: [],
      flowList: []
    })
    this.getList([])
    this.gettop()
    let query = wx.createSelectorQuery().in(this)
    let systemInfo = wx.getSystemInfoSync()
    query.selectAll(".tabnav").boundingClientRect()
    query.exec(res => {
      systemInfo.statusBarHeight < 30 ? this.setData({
        topT: res[0][0].height
      }) : this.setData({
        top: 48,
        topT: res[0][0].height + 23
      })
    })
    wx.uma.trackEvent('menu, ', { 'pageName': '风采展示' });
  },
  onShow: function () {
    if (app.globalData.postShow) {
      this.setData({
        list: [],
        flowList: [],
        currentTab: 0,
        showBottom: false
      })
      this.param = [{ page: 1, pageSize: 10, is_follow: 0 }, { page: 1, pageSize: 10, is_follow: 1 }]
      this.getList([]).then(() => {
      })
      this.gettop()
      app.globalData.postShow = false
    }
    /* 从cdetail-->发帖 */
    if (app.globalData.rlSuc) {
      this.setData({ rlSucFlag: true })
    }
    if (this.data.rlSucFlag) {
      this.rlSuc()
      /* 确保动画只执行一次 */
      this.setData({ rlSucFlag: false })
      app.globalData.rlSuc = false
    }
    let list = this.data.list, flowList = this.data.flowList
    list.forEach((item, index) => {
      if (item.id == app.globalData.detail.id) {
        if (app.globalData.detail.likestatus > 0) {
          this.setData({
            [`list[${index}].likestatus`]: app.globalData.detail.likestatus,
            [`list[${index}].likes`]: app.globalData.detail.likes,
            [`list[${index}].comments`]: app.globalData.detail.comments
          })
        } else {
          this.setData({
            [`list[${index}].likestatus`]: app.globalData.detail.likestatus,
            [`list[${index}].likes`]: app.globalData.detail.likes,
            [`list[${index}].comments`]: app.globalData.detail.comments
          })
        }
      }
    })
    flowList.forEach((item, index) => {
      if (item.id == app.globalData.detail.id) {
        if (app.globalData.detail.likestatus > 0) {
          this.setData({
            [`flowList[${index}].likestatus`]: app.globalData.detail.likestatus,
            [`flowList[${index}].likes`]: app.globalData.detail.likes,
            [`flowList[${index}].comments`]: app.globalData.detail.comments
          })
        } else {
          this.setData({
            [`flowList[${index}].likestatus`]: app.globalData.detail.likestatus,
            [`flowList[${index}].likes`]: app.globalData.detail.likes,
            [`flowList[${index}].comments`]: app.globalData.detail.comments
          })
        }
      }
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
  onShareAppMessage: function (ops, b) {
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
    let temp = [], currentTab = this.data.currentTab
    currentTab == 0 ? temp = list || this.data.list : temp = list || this.data.flowList
    return app.circle.news(this.param[currentTab]).then(msg => {
      if (msg.code == 1) {
        if (msg.data) {
          msg.data[0] ? '' : this.setData({
            showBottom: true
          })
          let arr = [];
          for (let i in msg.data) {
            arr.push(msg.data[i])
          }
          arr.forEach(function (item) {
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
          setTimeout(() => {
            this.setData({
              showLoading: false
            })
            if (this.data.currentTab != currentTab) return
            this.data.currentTab == 0 ? this.setData({
              list: temp
            }) : this.setData({
              flowList: temp
            })
          }, 800);
          this.setHeight()
        }
      }
    })
  },
  gettop() {
    app.circle.bokeblogTop().then(res => {
      if (res.code == 1) {
        this.setData({
          bokeTop: res.data
        })
      }
    })
    app.circle.defaultCircle().then(res => {
      if (res.code == 1) {
        this.setData({
          joinedList: res.data
        })
      }
    })
  },
  pagePraise(id) {
    let list = this.data.list, i = 0
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
  praise(e, index) {
    let i = e.currentTarget.dataset.index
    let list = this.data.list, flowList = this.data.flowList, status = 0, fi = -1
    let param = {
      blog_id: e.currentTarget.dataset.id
    }
    if (e.currentTarget.dataset.type) {
      status = list[i].likestatus
    } else {
      status = flowList[i].likestatus
    }
    if (status == 1) {
      // 取消点赞
      app.circle.delPraise(param).then(msg => {
        if (msg.code == 1) {
          if (e.currentTarget.dataset.type) {
            list[i].likes--
            flowList.forEach((item, index) => {
              if (item.id == e.currentTarget.dataset.id) {
                fi = index
                item.likes--
              }
            })
            fi > -1 ? this.setData({
              [`list[${i}].likestatus`]: 0,
              [`list[${i}].likes`]: list[i].likes,
              [`flowList[${fi}].likestatus`]: 0,
              [`flowList[${fi}].likes`]: flowList[fi].likes,
            }) : this.setData({
              [`list[${i}].likestatus`]: 0,
              [`list[${i}].likes`]: list[i].likes
            })
          } else {
            flowList[i].likes--
            list.forEach((item, index) => {
              if (item.id == e.currentTarget.dataset.id) {
                fi = index
                item.likes--
              }
            })
            fi > -1 ?
              this.setData({
                [`flowList[${i}].likestatus`]: 0,
                [`flowList[${i}].likes`]: flowList[i].likes,
                [`list[${fi}].likestatus`]: 0,
                [`list[${fi}].likes`]: list[fi].likes,
              }) :
              this.setData({
                [`flowList[${i}].likestatus`]: 0,
                [`flowList[${i}].likes`]: flowList[i].likes
              })
          }
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
          if (e.currentTarget.dataset.type) {
            list[i].likes++
            flowList.forEach((item, index) => {
              if (item.id == e.currentTarget.dataset.id) {
                fi = index
                item.likes++
              }
            })
            fi > -1 ? this.setData({
              [`flowList[${fi}].likestatus`]: 1,
              [`flowList[${fi}].likes`]: flowList[fi].likes,
              [`list[${i}].likestatus`]: 1,
              [`list[${i}].likes`]: list[i].likes,
              [`list[${i}].praising`]: true
            }) : this.setData({
              [`list[${i}].likestatus`]: 1,
              [`list[${i}].likes`]: list[i].likes,
              [`list[${i}].praising`]: true
            })
          } else {
            flowList[i].likes++
            list.forEach((item, index) => {
              if (item.id == e.currentTarget.dataset.id) {
                fi = index
                item.likes++
              }
            })
            fi > -1 ? this.setData({
              [`flowList[${i}].likestatus`]: 1,
              [`flowList[${i}].likes`]: flowList[i].likes,
              [`flowList[${i}].praising`]: true,
              [`list[${fi}].likestatus`]: 1,
              [`list[${fi}].likes`]: list[fi].likes,
            }) :
              this.setData({
                [`flowList[${i}].likestatus`]: 1,
                [`flowList[${i}].likes`]: flowList[i].likes,
                [`flowList[${i}].praising`]: true,
              })
          }
          if (msg.data.is_first == 'first') {
            this.setData({
              integral: '+50 学分',
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
            data: { uid: e.currentTarget.dataset.uid }
          })
          wx.uma.trackEvent('post_btnClick', { 'btnName': '点赞按钮' });
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
    var i = e.currentTarget.dataset.index, id = e.currentTarget.dataset.id
    var list = this.data.list, flowList = this.data.flowList
    list.forEach(item => {
      item.id == id ? item.praising = false : ''
    })
    flowList.forEach(item => {
      item.id == id ? item.praising = false : ''
    })
    this.setData({
      list,
      flowList
    })
  },
  // 写帖成功动效
  rlSuc() {
    /* 重新到第一页 */
    this.param[this.data.currentTab].page = 1
    this.getList([])
    this.setData({
      rlAni: true,
      currentTab: 0,
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
    if (this.data.isRefreshing) return
    if (this.data.scrolltop == 0) {
      var moveY = e.touches[0].clientY;
      var diffY = this.startY - moveY;
      if (diffY > -10) {
        return
      } else {
        this.param[this.data.currentTab].page = 1
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
    if (this.data.currentTab == 1 && this.data.showBottom) return
    if (this.data.showLoading) return
    this.param[this.data.currentTab].page++
    this.getList()
  },
  touchStart(e) {
    if (e.touches.length == 1) {
      this.startY = e.touches[0].clientY
    }
  },
  scrollinfo(e) {
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      })
    } else {
      wx.navigateTo({
        url: `/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&university_name=${e.currentTarget.dataset.item.university_name}&avatar=${e.currentTarget.dataset.item.avatar}&addressCity=${e.currentTarget.dataset.item.province}&follow=${e.currentTarget.dataset.item.is_follow}`
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
      currentTab: cur,
      showBottom: false
    })
    this.data.currentTab == 1 && !this.data.flowList[0] ? this.getList([]) : ''
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
      if (status.currentTarget.dataset.type == 'reply') {
        wx.navigateTo({
          url: `/pages/pDetail/pDetail?id= ${status.currentTarget.dataset.id}&comment`,
        })
        wx.uma.trackEvent('post_btnClick', { 'btnName': '评论按钮' });
      } else {
        wx.navigateTo({
          url: '/pages/release/release',
        })
        wx.uma.trackEvent('post_btnClick', { 'btnName': '发帖按钮' });
      }
    }
  },
  //收藏风采
  collect(e) {
    let blog_id = e.currentTarget.dataset.id, status = e.currentTarget.dataset.status, blog_index = e.currentTarget.dataset.index, flowId = e.currentTarget.dataset.userid, is_follow = e.currentTarget.dataset.follow, follownickname = e.currentTarget.dataset.name
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
    let param = { blog_id: this.data.blog_id }
    app.circle.collectCancel(param).then(res => {
      if (res.code == 1) {
        this.pagesCollect(this.data.blog_id, 0)
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
      if (res.code == 1) {
        this.pagesCollect(this.data.blog_id, 1)
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
  // 指引联动
  nextGuide() {
    if (this.data.guideNum == 1) {
      this.setData({
        guideNum: 2,
        guideTxt: '我知道了'
      })
    } else {
      if(this.guide) return
      this.guide = true
      let param = {
        guide_name: 'blog'
      }
      app.user.guideRecordAdd(param).then(res => {
        if (res.code == 1) {
          this.setData({
            integral: '+45 学分',
            integralContent: '完成[秀风采]新手指引',
            showintegral: true
          })
          setTimeout(() => {
            this.setData({
              showintegral: false
            })
          }, 2000)
          app.getGuide()
        }
      }).catch(() => {
        this.guide = 0
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
        if (item.height >= 120) {
          arr.push(index)
        }
      })
    })
  },
  setfollow(id, follow) {
    if (follow) {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 1 : ''
      })
      if (this.data.flowList[0]) {
        this.data.flowList.forEach(item => {
          item.uid == id ? item.is_follow = 1 : ''
        })
      }
      this.setData({
        list: this.data.list,
        flowList: this.data.flowList
      })
    } else {
      this.data.list.forEach(item => {
        item.uid == id ? item.is_follow = 0 : ''
      })
      if (this.data.flowList[0]) {
        this.data.flowList.forEach(item => {
          item.uid == id ? item.is_follow = 0 : ''
        })
      }
      this.setData({
        list: this.data.list,
        flowList: this.data.flowList
      })
    }
  },
  //点赞联动
  pagesPraise(id, type) {
    let list = this.data.list, flowList = this.data.flowList
    if (type) {
      list.forEach(item => {
        if (item.id == id) {
          item.likes
        }
      })
    }

  },
  //收藏联动
  pagesCollect(id, type) {
    if (type) {
      let list = this.data.list, flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 1 : ''
      })
      flowList.forEach(item => {
        item.id == id ? item.collectstatus = 1 : ''
      })
      this.setData({
        list,
        flowList
      })
    } else {
      let list = this.data.list, flowList = this.data.flowList
      list.forEach(item => {
        item.id == id ? item.collectstatus = 0 : ''
      })
      flowList.forEach(item => {
        item.id == id ? item.collectstatus = 0 : ''
      })
      this.setData({
        list,
        flowList
      })
    }
  },
  attention(e) {
    if (e.currentTarget.dataset.name) {
      this.setData({
        blog_index: e.currentTarget.dataset.index,
        flowId: e.currentTarget.dataset.userid,
        follownickname: e.currentTarget.dataset.name,
      })
    }
    let param = { follower_uid: this.data.flowId }
    app.user.following(param).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '您已成功关注' + this.data.follownickname,
          icon: 'none',
          duration: 1500
        })
        this.setfollow(this.data.flowId, true)
        this.closeSheet()
      }
    })
  },
  clsocancelFollowing() {
    let param = { follower_uid: this.data.flowId }
    app.user.cancelFollowing(param).then(res => {
      if (res.code == 1) {
        wx.showToast({
          title: '取消关注成功',
          icon: 'none',
          duration: 1500
        })
        this.setfollow(this.data.flowId)
        this.closeSheet()
      }
    })
  }
})
