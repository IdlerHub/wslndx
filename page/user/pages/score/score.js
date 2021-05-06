  /*
   * @Date: 2019-05-28 09:50:08
   * @LastEditors: hxz
   * @LastEditTime: 2020-03-06 11:22:49
   */
  const app = getApp();
  //Page Object
  Page({
    data: {
      getAddress: false, //兑换地址卡片展示
      showModelCard: false, //奖品规格兑换卡片
      skuId: 0, //兑换礼品规格的id
      giftInfo: {}, //兑换礼品信息
      currentTab: '1',
      scrollStatus: false,
      paylist: [],
      details: [],
      singnow: false,
      singafter: false,
      isRefreshing: false,
      showHome: false,
      showSignbox: false,
      sign_days: 0,
      paddingAdd: false,
      bannerList: [{
        img: "https://hwcdn.jinlingkeji.cn/images/pro/withdrawBanner3.png",
        clickUrl: "/page/user/pages/makeMoney/makeMoney"
      }, {
        img: "../../images/tiyan.png",
        clickUrl: "/page/discoveryHall/pages/index/index"
      }],
      swiperHeight: {},
      showAddScore: false,
      addNum: 0
    },
    pageName: "学分兑换页",
    common: {
      scrollTop: 175
    },
    //options(Object)
    onLoad: function (options) {
      options.type !== "index" ?
        this.setData({
          showHome: true
        }) :
        this.setData({
          showHome: false
        });
      options.curren ?
        this.setData({
          currentTab: options.curren
        }) :
        "";
      this.setHeight()
      this.getSigns()
      options.name == 'home' ? this.setData({
        showAddScore: true
      }) : this.setData({
        showAddScore: false
      })
      this.setData({
        addNum: options.num
      })
    },
    onShow: function () {
      let sources = [{
          title: "邀请好友注册",
          score: 25,
          status: false,
          page: "/page/user/pages/invitation/invitation",
          authorization: false,
          showStatus: {
            name: "",
            status: false
          }
        },
        {
          title: "学完一门新课程",
          score: 5,
          status: false,
          page: "/pages/index/index?tabs=1",
          authorization: false,
          total: 3,
          showStatus: {
            name: "",
            status: false
          }
        },
        {
          title: "每日短视频首次点赞",
          score: 2,
          status: false,
          page: "/pages/video/video",
          authorization: false,
          showStatus: {
            name: "day_shortvideo_praise_status",
            status: false
          },
          isNotab: 1
        },
        {
          title: "每日看完十个短视频",
          score: 2,
          status: false,
          page: "/pages/video/video",
          authorization: true,
          showStatus: {
            name: "day_shortvideo_read_10_status",
            status: false
          },
          isNotab: 1
        },
        {
          title: "每日秀风采首次发帖",
          score: 2,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: "day_add_boke_status",
            status: false
          }
        },
        {
          title: "每日秀风采首次评论",
          score: 2,
          status: false,
          page: "/pages/post/post",
          authorization: true,
          showStatus: {
            name: "day_boke_comment_status",
            status: false
          }
        },
        {
          title: "每日课程首次讨论",
          score: 2,
          status: false,
          page: "/pages/index/index",
          authorization: true,
          showStatus: {
            name: "day_lesson_comment_status",
            status: false
          }
        }
      ]
      this.setData({
        sources
      });
      this.params = {
        page: 1,
        pageSize: 10
      };
      app.getTaskStatus();
      Promise.all([
        this.init(),
        this.getGift(),
        this.getlessonFinishStatus()
      ]).then(value => {
        let arr = [],
          crr = []
        if (this.data.$state.authUserInfo) {
          this.data.sources.forEach((item, index) => {
            if (this.data.$state.dayStatus[item.showStatus.name]) {
              item.status = true;
            }
            item.status ? arr.push(this.data.sources[index]) : "";
            !item.status ? crr.push(this.data.sources[index]) : "";
            item.authorization = false;
          });
        } else {
          this.data.sources.forEach((item, index) => {
            item.status ? arr.push(this.data.sources[index]) : "";
            !item.status ? crr.push(this.data.sources[index]) : "";
          });
        }
        arr = crr.concat(arr);
        this.setData({
          sources: arr,
        });
      });
      this.setHeight()
    },
    getSigns() {
      app.user.signed().then((res) => {
        let sign = res.data && res.data.signed;
        app.store.setState({
          signdays: res.data.sign_days == 1 && !res.data.signed ? 0 : res.data.sign_days,
        });
        app.setSignIn({
            status: sign,
            count: sign ? 1 : this.data.$state.signStatus.count,
          },
          true
        );
      });
    },
    init() {
      if (this.params.end) return Promise.resolve();
      return app.user.pointsinfo(this.params).then(res => {
        res.data.lists.forEach(v => {
          v.time = app.util.formatTime(new Date(v.createtime * 1000));
        });
        if (this.params.page == 1) {
          /* 每天分享课程最多3次获取学分 */
          // let shareCount = res.data.lists.filter(item => {
          //   return item.type == "SHARE_LESSON" && item.createtime * 1000 > new Date(new Date().toLocaleDateString()).getTime()
          // }).length
          // let remain = 3 - shareCount
          // let sources = this.data.sources
          // sources.forEach((item, index) => {
          //   if (item.title == '分享课程') {
          //     item.times = remain > 0 ? remain : 0
          //     item.status = remain <= 0
          //   }
          // })
          this.setData({
            totalPoints: res.data.mypoints,
            details: res.data.lists
          });
        } else {
          if (res.data.lists.length < this.params.pageSize)
            this.params.end = true;
          this.setData({
            details: this.data.details.concat(res.data.lists)
          });
        }
      });
    },
    getlessonFinishStatus() {
      return app.user.lessonFinishStatus().then(res => {
        if (res.data.finish_status) {
          this.data.sources.forEach(item => {
            if (item.title == "学完一门新课程") {
              item.status = true;
              item.total = res.data.today_remain_count;
            }
          });
        } else {
          this.data.sources.forEach(item => {
            if (item.title == "学完一门新课程") {
              item.total = res.data.today_remain_count;
            }
          });
        }
        this.setData({
          sources: this.data.sources,
          lessonFinishStatus: res.data
        });
      });
    },
    getGift() {
      app.user.gift().then(res => {
        res.data.forEach(item => {
          item.largePoint =
            item.need_points >= 10000 ?
            (item.need_points / 10000).toFixed(2) + "w" :
            null;
        });
        let sources = this.data.sources;
        let arr = [];
        sources.forEach((item, index) => {
          item.title == "每日签到" ?
            (item.status = this.data.$state.signStatus.status) :
            "";
        });
        this.setData({
          paylist: res.data,
          sources /* 用户签到状态 */
        });
      });
    },
    onHide: function () {},
    onPullDownRefresh: function () {
      this.setData({
        isRefreshing: true
      });
      this.params = {
        page: 1,
        pageSize: 10
      };
      this.init().then(() => {
        wx.stopPullDownRefresh();
        this.setData({
          isRefreshing: false
        });
      });
    },
    onReachBottom: function () {
      this.setData({
        scrollStatus: true,
        paddingAdd: true
      });
      this.data.currentTab == 3 ? this.lower() : ''
    },
    onPageScroll: function (e) {
      if (e.scrollTop < this.common.scrollTop) {
        this.data.scrollStatus &&
          this.setData({
            scrollStatus: false,
            paddingAdd: false
          });
      }
    },
    lower() {
      this.params.page += 1;
      this.init();
      this.setHeight()
    },
    switchTap(e) {
      let id = e.currentTarget.dataset.index;
      if (id != this.data.currentTab) {
        this.setData({
          currentTab: id
        });
      }
    },
    swiperChange(e) {
      let id = e.detail.currentItemId;
      if (id != this.data.currentTab) {
        this.setData({
          currentTab: id
        });
      }
      id == 2 ?
        wx.uma.trackEvent("integral_btnClick", {
          btnName: "学分兑换"
        }) :
        "";
      this.setHeight()
    },
    gift(e) { //兑换
      let item = e.currentTarget.dataset.item
      if (!item.stock) {
        wx.showToast({
          title: "已经没货啦～",
          icon: "none",
          duration: 1500
        });
      } else {
        if (this.data.totalPoints >= item.need_points) {
          if (item.is_new == 1) { //新用户
            wx.showModal({
              content: "新手专享只能兑换一次，是否选择该商品？",
              showCancel: true,
              cancelText: "取消",
              cancelColor: "#999",
              confirmText: "确认",
              confirmColor: "#df2020",
              success: res => {
                if (res.confirm) { //确认,如果是带规格的,则先展示规格选项
                  if (item.is_sku == 1) { //有配置规格
                    this.setData({
                      showModelCard: true,
                      giftInfo: item //礼品详情
                    })
                  } else {
                    this.setData({
                      getAddress: true,
                      giftInfo: item
                    })
                  }
                }
              }
            });
          } else { //老用户
            wx.showModal({
              title: "兑换提示",
              content: "确定要兑换该物品吗?",
              showCancel: true,
              cancelText: "取消",
              cancelColor: "#000000",
              confirmText: "确定兑换",
              confirmColor: "#df2020",
              success: res => {
                if (res.confirm) { //确认,如果是带规格的,则先展示规格选项
                  if (item.is_sku == 1) { //有配置规格
                    this.setData({
                      showModelCard: true,
                      giftInfo: item
                    })
                  } else {
                    this.setData({
                      getAddress: true,
                      giftInfo: item
                    })
                  }
                }
              }
            });
          }
        } else {
          wx.showToast({
            title: "您的学分不够兑换!",
            icon: "none",
            duration: 1500
          });
        }
      }
    },
    setSkuId(e) { //关闭规格卡片,展示地址填写卡片
      //关闭当前卡片,显示地址卡片
      this.setData({
        showModelCard: false,
        getAddress: true,
        giftInfo: e.detail
      })
    },
    nav(e) {
      let i = e.currentTarget.dataset.index;
      if (i != 0 && !this.data.sources[i].isNotab) {
        app.globalData.currentTab = 1;
        wx.switchTab({
          url: this.data.sources[i].page
        });
      } else {
        wx.navigateTo({
          url: this.data.sources[i].page
        });
      }
    },
    sign() {
      /* 签到状态 */
      app.setSignIn({
          status: true,
          count: 1
        },
        true
      );
      app.user.sign().then(res => {
        app.store.setState({
          signdays: res.data.sign_days
        });
        this.params.page = 1;
        this.init();
      });
    },
    tabnav(e) {
      let i = e.currentTarget.dataset.index;
      let name = e.currentTarget.dataset.title;
      if (name == "完善资料" || this.data.newbie[i].isNotab) {
        wx.navigateTo({
          url: this.data.newbie[i].page
        });
      } else {
        wx.switchTab({
          url: this.data.newbie[i].page
        });
      }
    },
    toDraw() {
      wx.navigateTo({
        url: "/page/user/pages/drawPage/drawPage"
      });
      wx.uma.trackEvent("integral_btnClick", {
        btnName: "学分抽奖"
      });
    },
    onGotUserInfo(e) {
      wx.getUserProfile({
        desc: '请授权您的个人信息便于更新资料',
        success: (res) => {
          app.updateBase(res)
          wx.switchTab({
            url: "/pages/post/post"
          });
        }
      })
    },
    // 弹出签到框
    showSingbox() {
      this.setData({
        showSignbox: true,
        singnow: false,
        singafter: true
      });
    },
    closesignBox() {
      this.setData({
        showSignbox: false
      });
    },
    toMessage(e) {
      let item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: "/page/user/pages/giftMessage/giftMessage?totalPoints=" + this.data.totalPoints,
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit("acceptDataFromOpenerPage", {
            data: item
          });
        }
      });
    },
    setHeight() {
      let query = wx.createSelectorQuery().in(this)
      let that = this,
        height = 0
      switch (this.data.currentTab) {
        case '1':
          setTimeout(() => {
            query.select('.scroll_containerOne').boundingClientRect()
            query.exec(res => {
              height = res[0].height
              that.setData({
                'swiperHeight[1]': height
              })
            })
          }, 500)
          break;
        case '2':
          query.select('.scroll_containertwo').boundingClientRect()
          query.exec(res => {
            height = res[0].height
            that.setData({
              'swiperHeight[2]': height
            })
          })
          break;
        case '3':
          setTimeout(() => {
            query.select('.scroll_containerThree').boundingClientRect()
            query.exec(res => {
              height = res[0].height
              that.setData({
                'swiperHeight[3]': height
              })
            })
          }, 500);
          break;
      }
    },
    stockChange(e) {
      this.data.paylist.forEach((item, index) => {
        item.id == e.detail ? [item.stock--, this.setData({
          [`paylist[${index}].stock`]: this.data.paylist[index].stock
        })] : ''
      })
    }
  });