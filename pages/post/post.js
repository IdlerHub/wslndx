/*
 * @Date: 2019-06-14 19:54:05
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 11:11:30
 */
//获取应用实例
const app = getApp();
const record = require('../../utils/record')
Page({
  data: {
    rlSucFlag: false,
    isRefreshing: false,
    showLoading: false,
    showSheet: false,
    showGuide: true,
    showSheetBox: true,
    guideNum: 1,
    guideTxt: "下一步",
    releaseParam: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: "",
      num: 0,
      aodio: null,
      duration: 0
    },
    showRelease: false,
    media_type: null,
    showintegral: false,
    top: 26,
    currentTab: 0,
    scrolltop: 0,
    playVoice: {
      status: 0,
      duration: 0,
      playTimer: {
        minute: 0,
        second: 0
      },
      id: 0
    },
    listName: 'list',
  },
  pageName: "秀风采页",
  pageRecord: 1,
  stopTap: {
    guide: 0,
    praise: 0,
  },
  param: [],
  onLoad(options) {
    this.pageInit()
    this.getList([]);
    this.gettop();
    app.getGuide()
    let query = wx.createSelectorQuery().in(this);
    let systemInfo = wx.getSystemInfoSync();
    query.selectAll(".tabnav").boundingClientRect();
    query.exec(res => {
      systemInfo.statusBarHeight < 30 ?
        this.setData({
          topT: res[0][0].height
        }) :
        this.setData({
          top: 48,
          topT: res[0][0].height + 23
        });
    });
    wx.uma.trackEvent("menu", {
      pageName: "风采展示"
    });
  },
  onShow: function () {
    record.initRecord(this)
    /* 从cdetail-->发帖 */
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
    let list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList
    list.forEach((p, i) => {
      p.forEach((item, index) => {
        if (item.id == app.globalData.detail.id) {
          this.setData({
            [`${this.data.listName}[${i}][${index}].likestatus`]: app.globalData.detail.likestatus,
            [`${this.data.listName}[${i}][${index}].likes`]: app.globalData.detail.likes,
            [`${this.data.listName}[${i}][${index}].comments`]: app.globalData.detail.comments
          });
        }
      })
    });
    if (
      ((this.data.releaseParam.content != null &&
          this.data.releaseParam.content != "") ||
        this.data.releaseParam.image[0] ||
        this.data.releaseParam.video != null) &&
      this.data.showRelease
    ) {
      let that = this;
      wx.showModal({
        content: "保留本次编辑",
        confirmColor: "#df2020",
        cancelText: "不保留",
        confirmText: "保留",
        success(res) {
          if (res.confirm) {
            that.setData({
              showRelease: false
            });
            app.store.setState({
              releaseParam: that.data.releaseParam,
              media_type: that.data.media_type
            });
          } else if (res.cancel) {
            that.setData({
              releaseParam: null
            });
            app.store.setState({
              releaseParam: null,
              media_type: null
            });
          }
        }
      });
    }
  },
  onShareAppMessage: async function (ops, b) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button");
      let i = ops.target.dataset.index,
        p = ops.target.dataset.page
      let article = this.data.currentTab == 0 ? this.data.list[p][i] : this.data.currentTab == 1 ? this.data.nowList[p][i] : this.data.flowList[p][i];
      app.circle.addForward({
        blog_id: article.id
      }).then(res => {
        this.setData({
          [`${this.data.listName}[${p}][${i}].forward`]: article.forward += 1
        })
      });
      wx.uma.trackEvent('totalShare', {
        shareName: '秀风采分享'
      });
      return {
        title: app.util.delHtmlTag(article.content),
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/page/post/pages/pDetail/pDetail?id=" +
          article.id +
          "&type=share" + ( this.data.$state.userInfo.id ? "&uid=" +
          this.data.$state.userInfo.id : null)
      };
    }
  },
  pageInit() {
    let pageFrame = {}
    for (let i = 0; i < 3; i++) {
      this.param.push({
        page: 1,
        pageSize: 10,
        is_follow: i == 2 ? 1 : 0
      })
      pageFrame[i] = []
    }
    this.setData({
      list: [],
      nowList: [],
      flowList: [],
      showBottom: {},
      pageFrame: pageFrame,
      currentPage: this.param
    })
  },
  getList: async function (list) {
    this.setData({
      [`showBottom[${this.data.currentTab}]`]: false,
      showLoading: true
    });
    let temp = [],
      currentTab = this.data.currentTab,
      msg = null
    if (currentTab == 0) {
      temp = list || this.data.list
    } else if (currentTab == 1) {
      temp = list || this.data.nowList
    } else {
      temp = list || this.data.flowList
    }
    currentTab == 0 ? msg = await app.circle.news(this.param[currentTab]) : msg = await app.circle.myNews(this.param[currentTab])
    msg.data.forEach(item => {
      item.content = app.util.delHtmlTag(item.content)
      item.timer = {
        minute: parseInt(item.duration / 60),
        second: item.duration - (parseInt(item.duration / 60) * 60)
      }
    })
    this.upList(currentTab, temp, msg)
  },
  upList(currentTab, temp, msg) {
    let arr = msg.data;
    if (!arr[0]) {
      this.param[currentTab].page--
      this.setData({
        [`currentPage${currentTab}.page`]: this.param[currentTab].page
      })
      setTimeout(() => {
        this.setData({
          showLoading: false,
          [`showBottom[${this.data.currentTab}]`]: true
        });
      }, 800)
      return
    }
    arr.forEach(function (item) {
      item.fw = app.util.tow(item.forward);
      item.cw = app.util.tow(item.comments);
      item.lw = app.util.tow(item.likes);
      item.image_compress = item.images.map(i => {
        return i.image_compress;
      });
      item.images = item.images.map(i => {
        return i.image;
      });
      item.auditing = item.check_status;
    });
    temp.push(arr);
    setTimeout(() => {
      this.setData({
        showLoading: false
      });
      if (this.data.currentTab != currentTab) return;
      if (this.data.currentTab == 0) {
        this.setData({
          [`list[${this.param[currentTab].page - 1}]`]: arr
        })
      } else if (this.data.currentTab == 1) {
        this.setData({
          [`nowList[${this.param[currentTab].page - 1}]`]: arr
        })
      } else {
        this.setData({
          [`flowList[${this.param[currentTab].page - 1}]`]: arr
        })
      }
    }, 800);
    this.setHeight();
  },
  gettop() {
    app.circle.bokeblogTop().then(res => {
      res.data.content = app.util.delHtmlTag(res.data.content)
      this.setData({
        bokeTop: res.data
      });
    });
    app.circle.defaultCircle().then(res => {
      this.setData({
        joinedList: res.data
      });
    });
  },
  //点赞联动
  pagePraise(id) {
    let list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList
    list.forEach((p, i) => {
      p.forEach((item, index) => {
        if (item.id == id) {
          list[i][index].likestatus == 1 ? this.setData({
            [`${this.data.listName}[${i}][${index}].likestatus`]: 0,
            [`${this.data.listName}[${i}][${index}].likes`]: list[i][index].likes - 1
          }) : this.setData({
            [`${this.data.listName}[${i}][${index}].likestatus`]: 1,
            [`${this.data.listName}[${i}][${index}].likes`]: list[i][index].likes += 1
          })
        }
      })
    })
  },
  praise: async function (e) {   
    console.log(e) 
    if (this.stopTap.praise) return
    this.stopTap.praise = true
    let i = e.currentTarget.dataset.index,
      p = e.currentTarget.dataset.place,
      list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList,
      param = {
        blog_id: e.currentTarget.dataset.id
      };
    let msg = list[p][i].likestatus ? (await app.circle.delPraise(param)) : (await app.circle.praise(param))
    if (msg.code == 1) {
      list[p].forEach((item, index) => {
        if (item.id == e.currentTarget.dataset.id) {
          list[p][i].likestatus ? item.likes-- : item.likes++
          this.setData({
            [`${this.data.listName}[${p}][${index}].likestatus`]: list[p][i].likestatus ? 0 : 1,
            [`${this.data.listName}[${p}][${index}].likes`]: item.likes,
            [`${this.data.listName}[${p}][${index}].praising`]: list[p][i].likestatus ? false : true
          })
        }
      })
      this.stopTap.praise = 0
      if (msg.data && msg.data.is_first == "first") {
        app.setIntegral(this, "+5 学分", "完成[秀风采]首次点赞")
      }
      wx.uma.trackEvent("post_btnClick", {
        btnName: "点赞按钮"
      });
      if (!list[p][i].likestatus) return
      app.socket.send({
        type: "Bokemessage",
        data: {
          uid: e.currentTarget.dataset.uid
        }
      });
    } else if (msg.code == -2) {
      wx.showToast({
        title: "帖子已删除",
        icon: "none",
        duration: 1500
      });
      this.stopTap.praise = 0
    }
  },
  aniend(e) {
    let id = e.currentTarget.dataset.id,
      p = e.currentTarget.dataset.page
    let list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList
    list[p].forEach((item, index) => {
      item.id == id ? this.setData({
        [`${this.data.listName}[${p}][${index}].praising`]: false
      }) : "";
    });
  },
  // 写帖成功动效
  rlSuc() {
    /* 重新到第一页 */
    this.setData({
      nowList: []
    })
    this.param[this.data.currentTab].page = 1;
    this.getList([]);
    this.setData({
      rlAni: true,
      scrollTop: 0
    });
    setTimeout(() => {
      this.setData({
        currentTab: 1
      })
    }, 800)
    let timer = setTimeout(() => {
      this.setData({
        rlAni: false
      });
      clearTimeout(timer);
    }, 2000);
  },
  //图片预览
  previewImage(e) {
    let urls = e.currentTarget.dataset.urls;
    let current = e.currentTarget.dataset.current;
    wx.previewImage({
      current: current,
      urls: urls // 需要预览的图片http链接列表
    });
  },
  navigate(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../../page/post/pages/pDetail/pDetail?id=" + id
    });
  },
  //下拉刷新
  itemtouch(e) {
    if (this.data.isRefreshing) return;
    if (this.data.scrolltop == 0) {
      var moveY = e.touches[0].clientY;
      var diffY = this.startY - moveY;
      if (diffY > -10) {
        return;
      } else {
        this.param[this.data.currentTab].page = 1;
        this.setData({
          isRefreshing: true,
          showBottom: {},
          pageFrame: {
            0: [],
            1: [],
            2: []
          },
          currentPage: this.param
        });
        this.getList([])
        let timer = setTimeout(() => {
          this.setData({
            isRefreshing: false
          });
          clearTimeout(timer);
        }, 1000);
        this.data.currentTab == 0 ? this.gettop() : '';
      }
    }
  },
  //上拉加载
  scrolltolower() {
    if (this.data.currentTab == 1 && this.data.showBottom[this.data.currentTab]) return;
    if (this.data.showLoading) return;
    let self = this;
    let currentPage = this.param[this.data.currentTab].page;
    wx.createSelectorQuery().select('#listpage-' + this.param[this.data.currentTab].page).boundingClientRect(function (rect) {
      if (currentPage > 2 && self.data.pageFrame[self.data.currentTab][currentPage - 1]) {
        rect.lastBottom = self.data.pageFrame[self.data.currentTab][currentPage - 1].height + self.data.pageFrame[self.data.currentTab][currentPage - 1].lastBottom
      } else {
        rect.lastBottom = 0;
      }
      currentPage == 2 ? rect.lastBottom = self.data.pageFrame[self.data.currentTab][currentPage - 1].height : ''
      self.setData({
        [`pageFrame[${self.data.currentTab}][${currentPage}]`]: rect
      })
    }).exec();
    this.param[this.data.currentTab].page++;
    this.setData({
      [`currentPage[${this.data.currentTab}].page`]: this.param[this.data.currentTab].page
    })
    this.getList();
  },
  touchStart(e) {
    if (e.touches.length == 1) {
      this.startY = e.touches[0].clientY;
    }
  },
  scrollinfo(e) {
    e.detail.scrollTop > 100 ? '' : this.setData({
      scrolltop: e.detail.scrollTop
    });
    if (this.inPageUpdate || this.data.isRefreshing) {
      return;
    }
    let {
      scrollTop
    } = e.detail;
    let current = this.data.currentPage[this.data.currentTab].page
    if (current - 1 > 0 && this.data.pageFrame[this.data.currentTab] && this.data.pageFrame[this.data.currentTab][current - 1]) {
      let pageFrame = this.data.pageFrame[this.data.currentTab][current - 1];
      let screenHeight = wx.getSystemInfoSync().screenHeight;
      if ((scrollTop + screenHeight) - (pageFrame.lastBottom + pageFrame.height) < -200) {
        this.inPageUpdate = true;
        current--;
        this.setData({
          [`currentPage[${this.data.currentTab}].page`]: current
        }, () => {
          this.inPageUpdate = false;
        })
      }
    }
    let currentPageFrame = this.data.pageFrame[this.data.currentTab][current];
    if (currentPageFrame) {
      if (scrollTop - (currentPageFrame.lastBottom + currentPageFrame.height) > 200) {
        this.inPageUpdate = true;
        current++;
        this.setData({
          [`currentPage[${this.data.currentTab}].page`]: current
        }, () => {
          this.inPageUpdate = false;
        })
      }
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      });
    } else {
      wx.navigateTo({
        url: `/page/post/pages/personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&university_name=${e.currentTarget.dataset.item.university_name}&avatar=${e.currentTarget.dataset.item.avatar}&addressCity=${e.currentTarget.dataset.item.province}&follow=${e.currentTarget.dataset.item.is_follow}`
      });
    }
  },
  switchTab(event) {
    let cur = event.detail.current;
    this.setData({
      currentTab: cur,
      listName: cur == 0 ? 'list' : cur == 1 ? 'nowList' : 'flowList'
    })
    app.backgroundAudioManager.stop();
    this.pageInit()
    this.getList([])
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab === cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      });
    }
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    });
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
      } else {
        wx.navigateTo({
          url: "/page/post/pages/release/release"
        });
        wx.uma.trackEvent("post_btnClick", {
          btnName: "发帖按钮"
        });
      }
    }
  },
  //收藏风采
  collect(e) {
    this.collectParam = {
      blog_id: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status,
      blog_index: e.currentTarget.dataset.index,
      flowId: e.currentTarget.dataset.userid,
      is_follow: e.currentTarget.dataset.follow,
      follownickname: e.currentTarget.dataset.name,
      page: e.currentTarget.dataset.page
    }
    this.setData({
      flowId: e.currentTarget.dataset.userid,
      follownickname: e.currentTarget.dataset.name,
      is_follow: e.currentTarget.dataset.follow,
      showSheet: true,
      collectstatus: e.currentTarget.dataset.status
    });
  },
  cancelCollection() {
    app.circle
      .collectCancel({
        blog_id: this.collectParam.blog_id
      })
      .then(res => {
        this.pagesCollect(this.collectParam.blog_id, 0);
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 800
        });
      })
      .catch(res => {
        wx.showToast({
          title: res.msg,
          image: "/images/warn.png",
          duration: 800
        });
      });
    this.setData({
      showSheet: false
    });
  },
  setCollect() {
    app.circle
      .collect({
        blog_id: this.collectParam.blog_id
      })
      .then(res => {
        this.pagesCollect(this.collectParam.blog_id, 1);
        this.closeSheet();
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 1500
        });
      })
      .catch(res => {
        this.closeSheet();
        wx.showToast({
          title: res.msg,
          image: "/images/warn.png",
          duration: 1500
        });
      });
  },
  closeSheet() {
    this.setData({
      showSheet: false
    });
  },
  // 指引联动
  nextGuide() {
    if (this.data.guideNum == 1) {
      this.setData({
        guideNum: 2,
        guideTxt: "我知道了"
      });
    } else {
      if (this.stopTap.guide) return;
      this.stopTap.guide = true;
      let param = {
        guide_name: "blog"
      };
      app.user
        .guideRecordAdd(param)
        .then(res => {
          app.setIntegral(this, "+5 学分", "完成[秀风采]新手指引")
          app.getGuide();
        })
        .catch(() => {
          this.stopTap.guide = 0;
          err.msg == '记录已增加' ? app.setState({
            'newGuide.blog': 1
          }) : ''
        });
    }
  },
  setHeight() {
    let that = this;
    let query = wx.createSelectorQuery().in(this);
    query.selectAll(".name").boundingClientRect();
    query.exec(res => {
      let arr = [];
      res[0].forEach((item, index) => {
        if (item.height >= 120) {
          arr.push(index);
        }
      });
    });
  },
  setfollow(id, follow) {
    let list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList
    list.forEach((p, i) => {
      p.forEach((item, index) => {
        if (item.uid == id) {
          follow ?
            this.setData({
              [`${this.data.listName}[${i}][${index}].is_follow`]: 1
            }) :
            this.setData({
              [`${this.data.listName}[${i}][${index}].is_follow`]: 0
            })
          this.setData({
            flowId: null
          })
        }
      })
    })
  },
  //收藏联动
  pagesCollect(id, type) {
    let list = this.data.currentTab == 0 ? this.data.list : this.data.currentTab == 1 ? this.data.nowList : this.data.flowList
    list[this.collectParam.page].forEach((item, index) => {
      if (item.id == id) {
        type ? this.setData({
            [`${this.data.listName}[${this.collectParam.page}][${index}].collectstatus`]: 1
          }) :
          this.setData({
            [`${this.data.listName}[${this.collectParam.page}][${index}].collectstatus`]: 0
          })
      }
    });
  },
  attention(e) {
    if (e.currentTarget.dataset.name) {
      this.attentionParam = {
        blog_index: e.currentTarget.dataset.index,
        flowId: e.currentTarget.dataset.userid,
        follownickname: e.currentTarget.dataset.name,
        page: e.currentTarget.dataset.page
      }
    }
    let param = {
      follower_uid: this.data.flowId || this.attentionParam.flowId
    };
    app.user.following(param).then(res => {
      wx.showToast({
        title: "您已成功关注" +  (this.data.follownickname || this.attentionParam.follownickname),
        icon: "none",
        duration: 1500
      });
      this.setfollow(this.data.flowId || this.attentionParam.flowId, true);
      this.closeSheet();
    });
  },
  clsocancelFollowing() {
    let param = {
      follower_uid: this.data.flowId
    };
    app.user.cancelFollowing(param).then(res => {
      wx.showToast({
        title: "取消关注成功",
        icon: "none",
        duration: 1500
      });
      this.setfollow(this.data.flowId);
      this.closeSheet();
    });
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
});