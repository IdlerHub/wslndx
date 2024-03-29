/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2020-03-06 10:50:11
 */
//index.js
//获取应用实例
const app = getApp();
const plugin = requirePlugin("WechatSI");
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext();
const record = require('../../../../utils/record')

Page({
  data: {
    nav: [{
        name: "评论",
        class: ".comment",
        num: 0
      },
      {
        name: "点赞",
        class: ".praise",
        num: 0
      }
    ],
    isRefreshing: false,
    tip: true,
    delState: false,
    contenLength: 0,
    replycontenLength: 0,
    showvoice: false,
    placeholder: "请输入200字以内的评论哦~",
    content: "",
    replycontent: "",
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: "",
    voivetext: "",
    voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
    replyshow: false,
    showintegral: false,
    showSheet: false,
    /* rect: wx.getMenuButtonBoundingClientRect() */
    playVoice: {
      status: 0,
      duration: 0,
      voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png',
      playTimer: {
        minute: 0,
        second: 0
      },
      id: 0
    }
  },
  pageName: "博客详情（秀风采正文）",
  pageRecord: 1,
  textHeight: 0,
  onLoad(options) {
    this.id = options.id;
    this.comParam = {
      blog_id: this.id,
      page: 1,
      pageSize: 10
    };
    this.praParam = {
      blog_id: this.id,
      page: 1,
      pageSize: 10
    };
    this.setData({
      detail: "",
      comment: [],
      praise: [],
      vistor: options.type == "share", //游客从分享卡片过来
      currentTab: 0,
      navScrollLeft: 0
    });

    if (this.data.vistor) {
      setTimeout(() => {
        this.setData({
          tip: false
        });
      }, 5000);
    }
    this.getDetail().then(() => {
      this.getComment([], options.comment);
      this.getPraise();
    });
    if (this.data.$state.blogcomment[options.id.trim()]) {
      this.setData({
        content: this.data.$state.blogcomment[options.id.trim()].replycontent,
        contenLength: this.data.$state.blogcomment[options.id.trim()].replycontent != "" ?
          this.data.$state.blogcomment[options.id.trim()].replycontent
          .length : 0
      });
    }
    getCurrentPages().forEach(item => {
      item.route == "pages/post/post" ? (this.postPages = item) : "";
    });
  },
  onShow() {
    this.initRecord();
    this.getRecordAuth();
    record.initRecord(this)
    wx.onKeyboardHeightChange(res => {
      this.setData({
        textHeight: res.height,
        write: true
      }, () => {
        console.log(this.data.textHeight - this.textHeight >= 0)
        this.data.textHeight - this.textHeight >= 0 ? '' : this.setData({
          write: false,
          focus: false
        });
        this.textHeight = res.height
      });
    });
  },
  onUnload() {
    wx.onMemoryWarning(function () {
      console.log("内存不足");
    });
    innerAudioContext.stop()
    app.backgroundAudioManager.stop()
  },
  onHide() {
    innerAudioContext.stop()
  },
  setHeight() {
    let that = this;
    let nav = this.data.nav;
    let currentTab = this.data.currentTab;
    let query = wx.createSelectorQuery().in(this);
    query.select(nav[currentTab].class).boundingClientRect();
    query.exec(res => {
      let height = res[0].height;
      that.setData({
        height: height
      });
    });
  },
  switchNav(event) {
    let cur = event.currentTarget.dataset.current;
    if (this.data.currentTab !== cur) {
      this.setData({
        currentTab: cur
      });
    }
    this.setHeight();
  },
  switchTab(event) {
    let cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
    this.setHeight();
  },
  getDetail() {
    return app.circle
      .detail({
        blog_id: this.id
      })
      .then(msg => {
        let detail = msg.data[0];
        detail.image_compress = detail.images.map((i) => {
          return i.image_compress
        })
        detail.images = detail.images.map((i) => {
          return i.image
        })
        detail.content = app.util.delHtmlTag(detail.content)
        this.detailContent = detail.content;
        detail.auditing =
          new Date().getTime() - new Date(detail.createtime * 1000) < 7000;
        detail.pause = true;
        detail.timer = {
          minute: parseInt(detail.duration / 60),
          second: detail.duration - (parseInt(detail.duration / 60) * 60)
        }
        this.setData({
          detail: detail,
          "nav[0].num": app.util.tow(detail.comments) || detail.comments,
          "nav[1].num": app.util.tow(detail.likes) || detail.likes
        });
        app.globalData.detail = detail;
        return msg.code;
      })
      .catch(err => {
        if (err.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          });
        }
      });
  },
  praise: async function () {
    let detail = this.data.detail,
      msg = null;
    detail.likestatus == 1 ? msg = await app.circle.delPraise({
      blog_id: detail.id
    }) : msg = await app.circle.praise({
      blog_id: detail.id
    })
    if (msg.code == 1) {
      if (detail.likestatus == 1) {
        // 取消点赞
        this.aniend();
      } else {
        // 点赞
        /* 开启动画 */
        detail.praising = true;
        app.socket.send({
          type: "Bokemessage",
          data: {
            uid: this.data.detail.uid
          }
        });
        if (msg.data.is_first == "first") app.setIntegral(this, "+5 学分", "完成[秀风采]首次点赞")
        this.setData({
          detail: detail
        });
        wx.uma.trackEvent("post_btnClick", {
          btnName: "点赞按钮"
        });
      }
    } else if (msg.code == -2) {
      /* 帖子已经删除 */
      this.setData({
        detail: "",
        delState: true
      });
    }
  },
  aniend() {
    /* 点赞动画结束 */
    this.getDetail().then(() => {
      this.praParam.page = 1;
      this.getPraise([]);
    });
  },
  play() {
    let detail = this.data.detail;
    let videoContext = wx.createVideoContext(String(detail.id));
    videoContext.play();
    this.setData({
      "detail.pause": false
    });
  },
  ended() {
    this.setData({
      "detail.pause": true
    });
  },
  show(e) {
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理"
      });
    } else {
      if (e && e.target.dataset.reply) {
        /* 回复别人的评论 或者 回复别人的回复  */
        this.replyParent = e.target.dataset.parent;
        this.replyInfo = e.target.dataset.reply;
        this.setData({
          replyplaceholder: e.currentTarget.dataset.reply.nickname != undefined ?
            "回复 " + e.currentTarget.dataset.reply.nickname : "回复 " + e.currentTarget.dataset.reply.from_user,
          replyshow: true
        });
        if (this.data.$state.blogcomment[this.data.detail.id]) {
          if (
            this.replyParent &&
            this.data.$state.blogcomment[this.data.detail.id]["replyParent"]
          ) {
            this.data.$state.blogcomment[this.data.detail.id]["replyParent"][
                this.replyParent
              ] ?
              this.setData({
                replycontent: this.data.$state.blogcomment[this.data.detail.id][
                  "replyParent"
                ][this.replyParent] || "",
                replycontenLength: this.data.$state.blogcomment[this.data.detail.id][
                  "replyParent"
                ][this.replyParent] ? this.data.$state.blogcomment[this.data.detail.id][
                  "replyParent"
                ][this.replyParent].length : 0,
                replyshow: true
              }) :
              "";
          } else if (
            this.data.$state.blogcomment[this.data.detail.id]["replyInfo"]
          ) {
            this.setData({
              replycontent: this.data.$state.blogcomment[this.data.detail.id]["replyInfo"][
                  this.replyInfo.id
                ] != undefined ?
                this.data.$state.blogcomment[this.data.detail.id][
                  "replyInfo"
                ][this.replyInfo.id] : "",
              replycontenLength: this.data.$state.blogcomment[this.data.detail.id]["replyInfo"][
                  this.replyInfo.id
                ] != undefined ?
                this.data.$state.blogcomment[this.data.detail.id][
                  "replyInfo"
                ][this.replyInfo.id].length : 0,
              replyshow: true
            });
          }
        }
      } else {
        /* 评论 */
        this.replyInfo = null;
        this.replyParent = null;
        this.setData({
          replyplaceholder: "",
          replyshow: false
        });
        wx.uma.trackEvent("post_btnClick", {
          btnName: "评论按钮"
        });
      }
      this.setData({
        write: true,
        focus: true
      });
    }
  },
  touchStart() {
    setTimeout(() => {
      this.setData({
        write: false,
        focus: false
      });
    }, 200);
  },
  hide() {
    this.setData({
      write: false,
      focus: false
    });
  },
  input(e) {
    if (this.data.replyshow) {
      this.setData({
        replycontent: e.detail.value,
        replycontenLength: e.detail.value.length
      });
      let blogcomment = this.data.$state.blogcomment;
      blogcomment[this.data.detail.id] ?
        "" :
        (blogcomment[this.data.detail.id] = {});
      if (this.replyParent) {
        blogcomment[this.data.detail.id]["replyParent"] ?
          "" :
          (blogcomment[this.data.detail.id]["replyParent"] = {});
        blogcomment[this.data.detail.id]["replyParent"][
          this.replyParent
        ] = this.data.replycontent;
      } else {
        blogcomment[this.data.detail.id]["replyInfo"] ?
          "" :
          (blogcomment[this.data.detail.id]["replyInfo"] = {});
        blogcomment[this.data.detail.id]["replyInfo"][
          this.replyInfo.id
        ] = this.data.replycontent;
      }
      app.store.setState({
        blogcomment
      });
    } else {
      this.setData({
        content: e.detail.value,
        contenLength: e.detail.value.length
      });
      let blogcomment = this.data.$state.blogcomment;
      blogcomment[this.data.detail.id] ?
        "" :
        (blogcomment[this.data.detail.id] = {});
      blogcomment[this.data.detail.id]["replycontent"] = this.data.content;
      app.store.setState({
        blogcomment
      });
    }
    e.detail.value.length >= 200 ? wx.showToast({
      title: "评论字数不能超过200字哦！",
      icon: "none",
      duration: 1500
    }) : ''
  },
  // 发布评论e
  release(e, params, type) {
    console.log(e, params, type)
    let param = {},
      replyType = 0
    if (this.replyParent) {
      /* 回复别人的回复 */
      param = {
        blog_id: +this.id,
        comment_id: this.replyParent,
        reply_type: 2,
        reply_id: this.replyInfo.reply_id,
        reply_content: this.data.replycontent,
        to_user: this.replyInfo.reply_user_id,
        type: 1
      };
      replyType = 1
    } else if (this.replyInfo) {
      /* 回复评论 */
      param = {
        blog_id: +this.id,
        comment_id: this.replyInfo.id,
        reply_type: 1,
        reply_id: -1,
        reply_content: this.data.replycontent,
        to_user: this.replyInfo.uid,
        type: 1
      };
      replyType = 1
    } else {
      param = {
        blog_id: this.id,
        content: this.data.content,
        type: 1
      };
    }
    params ? Object.assign(param, params) : ''
    if (e.currentTarget.dataset.type) {
      this.setData({
        write: false,
        focus: false
      })
      wx.navigateTo({
        url: `/page/post/pages/release/release?params=${JSON.stringify(param)}`,
      })
    } else if (!!this.data.content.trim() || !!this.data.replycontent.trim() || !!params.content.trim() || !!params.reply_content.trim()) {
      replyType ? this.reply(param, type) : this.post(param, type)
    }
  },
  post(param, type) {
    this.setData({
      write: false,
      focus: false,
      showvoice: false,
      voicetime: 0,
      showvoiceauto: false
    });
    wx.showLoading({
      title: "发布中"
    });
    app.circle
      .comment(param)
      .then(msg => {
        wx.hideLoading();
        if (type) {
          wx.navigateBack()
        } else {
          let blogcomment = this.data.$state.blogcomment;
          blogcomment[this.data.detail.id]["replycontent"] = "";
          app.store.setState({
            blogcomment
          });
        }
        if (msg.data.is_first == "first") {
          app.setIntegral(this, "+5 学分", "完成[秀风采]首次评论")
        } else if (msg.data.is_first == "day") {
          app.setIntegral(this, "+2 学分", "完成每日[秀风采]首评评论")
        } else {
          wx.showToast({
            title: "发布成功",
            icon: "none",
            duration: 1500
          });
        }
        this.getDetail();
        this.setData({
          content: "",
          contenLength: 0
        });
        this.comParam.page = 1;
        app.socket.send({
          type: "Bokemessage",
          data: {
            uid: this.data.detail.uid
          }
        });
        this.getComment([]);
      })
      .catch(msg => {
        console.log(msg)
        if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          });
        } else if (msg.code == 0) {
          wx.showToast({
            title: msg.msg,
            icon: "none",
            duration: 1500
          });
        }
      });
  },
  getComment(list, options) {
    let comment = list || this.data.comment;
    return app.circle
      .getComment(this.comParam)
      .then(msg => {
        msg.data.forEach(function (item) {
          item.reply_array.forEach(v => {
            v.id = v.reply_id
            v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`;
            v.pause = true;
            v.timer = {
              minute: parseInt(v.audio_duration / 60),
              second: v.audio_duration - (parseInt(v.audio_duration / 60) * 60)
            }
          });
          item.pause = true;
          item.timer = {
            minute: parseInt(item.audio_duration / 60),
            second: item.audio_duration - (parseInt(item.audio_duration / 60) * 60)
          }
          comment.push(item);
        });
        this.comment = JSON.parse(JSON.stringify(comment));
        this.setData({
          comment: comment
        });
        this.setHeight();
        if (options) {
          this.data.comment.length > 0 ?
            this.setData({
              write: false,
              focus: false
            }) :
            this.show();
        }
      })
      .catch(msg => {
        if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          });
        }
      });
  },
  getPraise(list) {
    let praise = list || this.data.praise;
    return app.circle
      .getPraise(this.praParam)
      .then(msg => {
        setTimeout(() => {
          this.setData({
            praise: praise.concat(msg.data || [])
          });
        }, 500);
        setTimeout(() => {
          this.setHeight();
        }, 1000);
      })
      .catch(msg => {
        if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          });
        }
      });
  },
  //下拉刷新
  onPullDownRefresh() {
    let currentTab = this.data.currentTab;
    this.setData({
      isRefreshing: true
    });
    switch (currentTab) {
      case 0:
        this.comParam.page = 1;
        this.getComment([])
          .then(() => {
            wx.stopPullDownRefresh();
          })
          .catch(() => {
            wx.stopPullDownRefresh();
          });
        break;
      case 1:
        this.praParam.page = 1;
        this.getPraise([])
          .then(() => {
            wx.stopPullDownRefresh();
          })
          .catch(() => {
            wx.stopPullDownRefresh();
          });
        break;
    }
    let timer = setTimeout(() => {
      this.setData({
        isRefreshing: false
      });
      clearTimeout(timer);
    }, 1000);
  },
  //上拉加载
  onReachBottom() {
    let currentTab = this.data.currentTab;
    switch (currentTab) {
      case 0:
        this.comParam.page++;
        this.getComment();
        break;
      case 1:
        this.praParam.page++;
        this.getPraise();
        break;
    }
  },
  //图片预览
  previewImage(e) {
    let urls = e.currentTarget.dataset.urls;
    let current = e.currentTarget.dataset.current;
    wx.previewImage({
      current: current,
      urls: urls, // 需要预览的图片http链接列表
      complete: () => {}
    });
  },
  onShareAppMessage: function (ops) {
    if (ops.from === "menu") {
      return this.menuAppShare();
    }
    if (ops.from === "button") {
      console.log("ShareAppMessage  button");
      let bkid = ops.target.dataset.id;
      app.circle.addForward({
        blog_id: bkid
      }).then(() => {
        this.getDetail();
      });
      let article = this.data.detail;
      return {
        title: article.content,
        imageUrl: article.image || article.images[0] || "../../images/sharemessage.jpg",
        path: "/page/post/pages/pDetail/pDetail?id=" +
          bkid +
          "&type=share&uid=" +
          this.data.$state.userInfo.id
      };
    }
  },
  //删除评论
  delComment: function (e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: res => {
        if (res.confirm) {
          let param = {
            blog_id: e.currentTarget.dataset.item.blog_id,
            id: e.currentTarget.dataset.item.id
          };
          app.backgroundAudioManager.stop()
          app.circle
            .delComment(param)
            .then(msg => {
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500
              });
              this.getDetail();
              this.comParam.page = 1;
              this.getComment([]);
            })
            .catch(msg => {
              if (msg.code == -2) {
                /* 帖子已经删除 */
                this.setData({
                  detail: "",
                  delState: true
                });
              } else {
                wx.showToast({
                  title: "删除失败，请稍后重试",
                  icon: "none",
                  duration: 1500
                });
              }
            });
        }
      }
    });
  },
  /* 删除回复 */
  delReply(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: res => {
        if (res.confirm) {
          let params = {
            blog_id: this.id,
            comment_id: e.currentTarget.dataset.parentid,
            id: e.currentTarget.dataset.item.reply_id
          };
          app.circle
            .replydel(params)
            .then(msg => {
              wx.hideLoading();
              wx.showToast({
                title: "删除成功",
                icon: "none",
                duration: 1500
              });
              this.getDetail();
              this.comParam.page = 1;
              this.getComment([]);
            })
            .catch(msg => {
              if (msg.code == -2) {
                /* 帖子已经删除 */
                this.setData({
                  detail: "",
                  delState: true
                });
              } else {
                wx.showToast({
                  title: "删除失败，请稍后重试",
                  icon: "none",
                  duration: 1500
                });
              }
            });
        }
      }
    });
  },
  /* 回复评论 */
  reply(params, type) {
    this.setData({
      write: false,
      focus: false,
      showvoice: false,
      voicetime: 0,
      showvoiceauto: false
    });
    wx.showLoading({
      title: "发布中"
    });
    app.circle
      .reply(params)
      .then(msg => {
        wx.hideLoading();
        if (msg.data.is_first == "first") {
          app.setIntegral(this, "+5 学分", "完成[秀风采]首次评论")
        } else if (msg.data.is_first == "day") {
          app.setIntegral(this, "+2 学分", "完成每日[秀风采]首评评论")
        } else {
          wx.showToast({
            title: "发布成功",
            icon: "none",
            duration: 1500
          });
        }
        if (type) {
          wx.navigateBack()
        } else {
          let blogcomment = this.data.$state.blogcomment;
          if (this.replyParent) {
            blogcomment[this.data.detail.id]["replyParent"][this.replyParent] =
              "";
            this.setData({
              replycontent: ""
            });
          } else {
            blogcomment[this.data.detail.id]["replyInfo"][this.replyInfo.id] = "";
            this.setData({
              replycontent: ""
            });
          }
          app.store.setState({
            blogcomment
          });
        }
        this.getDetail();
        this.comParam.page = 1;
        this.getComment([]);
        app.socket.send({
          type: "Bokemessage",
          data: {
            uid: params.to_user
          }
        });
      })
      .catch(msg => {
        if (msg.code == -2) {
          /* 帖子已经删除 */
          this.setData({
            detail: "",
            delState: true
          });
        } else if (msg.code == -3) {
          /* 消息已经删除 */
          wx.showToast({
            title: "消息已删除",
            icon: "none",
            duration: 1500
          });
          this.getDetail();
          this.comParam.page = 1;
          this.getComment([]);
        } else if (msg.code == 0) {
          wx.showToast({
            title: msg.msg || "发布失败",
            icon: "none",
            duration: 1500
          });
        }
      });
  },
  tohome: function () {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },
  toCommentDetail(e) {
    let vm = this;
    wx.navigateTo({
      url: "/pages/commentDetail/commentDetail?" +
        "blog_id=" +
        this.id +
        "&comment_id=" +
        e.currentTarget.dataset.parentid,
      events: {
        refreshComments: data => {
          this.comParam.page = 1;
          this.getComment([]);
        }
      }
    });
  },
  unShare() {
    wx.showToast({
      title: "非常抱歉，不能分享这个内容！",
      icon: "none",
      duration: 1500
    });
  },
  showvoice(e) {
    wx.uma.trackEvent("post_btnClick", {
      btnName: "语音评论按钮"
    });
    this.setData({
      showvoice: true,
      focus: false,
      write: false,
      focus: false
    });
  },
  showWrite(e) {
    this.setData({
      write: true,
      showvoice: false,
      writeTow: true,
      focus: true,
      showvoiceauto: false,
      voicetime: 0
    });
    if (this.replyshow) {
      this.setData({
        replycontenLength: this.data.replycontent.length || 0
      });
    } else {
      this.setData({
        contenLength: this.data.content.length || 0
      });
    }
  },
  // 语音
  // 权限询问
  authrecord() {
    this.setData({
      focus: false
    });
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content: "您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能",
        confirmText: "去授权",
        confirmColor: "#df2020",
        success: res => {
          if (res.confirm) {
            wx.openSetting({});
          }
        }
      });
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: "scope.record",
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          app.store.setState({
            authRecord: true
          });
        },
        fail() {
          app.store.setState({
            authRecordfail: true
          });
        }
      });
    }
  },
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        let record = res.authSetting["scope.record"];
        app.store.setState({
          authRecord: record || false
        });
      },
      fail(res) {
        console.log("fail");
      }
    });
  },
  /**
   * 初始化语音识别回调
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = res => {
      clearInterval(this.timer);
      this.setData({
        newtxt: res.result,
        voiceActon: false
      });
    };
    // 识别结束事件
    manager.onStop = res => {
      clearInterval(this.timer);
      // 取出录音文件识别出来的文字信息
      if (!this.data.showvoiceauto) return;
      let text = res.result;
      console.log(text)

      this.data.replyshow ?
        (text = this.data.replycontent + text) :
        (text = this.data.content + text);
      // 获取音频文件临时地址
      let filePath = res.tempFilePath;
      let duration = res.duration;
      if (res.result == "") {
        this.setData({
          voicetextstatus: "未能识别到文字"
        });
        return;
      }
      if (this.data.replycontent.length >= 200 || this.data.content.length >= 200) {
        wx.showToast({
          title: '评论字数不能超过200字哦！',
          icon: 'none'
        })
        this.setData({
          voicetextstatus: "",
          filePath,
          voiceActon: false
        })
        return
      }
      this.data.replyshow ?
        this.setData({
          replycontent: text
        }) :
        this.setData({
          content: text
        });
      if (this.data.replyshow) {
        let blogcomment = this.data.$state.blogcomment;
        blogcomment[this.data.detail.id] ?
          "" :
          (blogcomment[this.data.detail.id] = {});
        if (this.replyParent) {
          blogcomment[this.data.detail.id]["replyParent"] ?
            "" :
            (blogcomment[this.data.detail.id]["replyParent"] = {});
          blogcomment[this.data.detail.id]["replyParent"][
            this.replyParent
          ] = this.data.replycontent;
        } else if (this.replyInfo) {
          blogcomment[this.data.detail.id]["replyInfo"] ?
            "" :
            (blogcomment[this.data.detail.id]["replyInfo"] = {});
          blogcomment[this.data.detail.id]["replyInfo"][
            this.replyInfo.id
          ] = this.data.replycontent;
        }
        app.store.setState({
          blogcomment
        });
      } else {
        let blogcomment = this.data.$state.blogcomment;
        blogcomment[this.data.detail.id] ?
          "" :
          (blogcomment[this.data.detail.id] = {});
        blogcomment[this.data.detail.id]["replycontent"] = this.data.content;
        app.store.setState({
          blogcomment
        });
      }
      this.setData({
        voicetext: res.result,
        voicetextstatus: "",
        filePath,
        voiceActon: false
      });
    };
    // 识别错误事件
    manager.onError = res => {
      clearInterval(this.timer);
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
        voiceActon: false
      });
    };
  },
  touchstart() {
    this.setData({
      voiceActon: true,
      voicetextstatus: "正在语音转文字…"
    });
    this.voicetime();
    innerAudioContext.stop()
    manager.start({
      lang: "zh_CN"
    });
  },
  touchend() {
    manager.stop();
    if (this.data.voicetime < 1) {
      wx.showToast({
        title: "说话时间过短",
        icon: "none",
        duration: 2000
      });
    } else {
      this.setData({
        showvoiceauto: true
      });
    }
    this.setData({
      voiceActon: false
    });
  },
  // 语音播放
  playvoice() {
    innerAudioContext.src = this.data.filePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png"
      });
    });
    innerAudioContext.onEnded(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png"
      });
    });
  },
  relacevoice() {
    let text = "",
      voicetext = this.data.voicetext,
      blogcomment = this.data.$state.blogcomment;
    if (this.data.replyshow) {
      text = this.data.replycontent.replace(voicetext, "");
      this.setData({
        showvoiceauto: false,
        replycontent: text,
        voicetime: 0,
        filePath: ""
      });
      if (this.replyParent) {
        blogcomment[this.data.detail.id].replyParent[this.replyParent] = text;
        app.store.setData({
          blogcomment
        });
      } else {
        blogcomment[this.data.detail.id].replyInfo[this.replyInfo.id] = text;
        app.store.setData({
          blogcomment
        });
      }
    } else {
      text = this.data.content.replace(voicetext, "");
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: ""
      });
      blogcomment[this.data.detail.id].replycontent = text;
      app.store.setData({
        blogcomment
      });
    }
  },
  closevoiceBox() {
    this.setData({
      showvoice: false,
      write: false,
      focus: false,
      showvoiceauto: false,
      voicetime: 0
    });
  },
  // 计时器
  voicetime() {
    clearInterval(this.timer);
    let time = 0;
    this.timer = setInterval(() => {
      time += 1;
      if (!this.data.voiceActon) {
        clearInterval(this.timer);
        return;
      }
      this.setData({
        voicetime: time
      });
    }, 1000);
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content);
    if (e.target.dataset.type == "content") {
      this.setData({
        "detail.content": "<span style='background:#f6eeee'>" +
          this.data.detail.content +
          "</span>"
      });
      setTimeout(() => {
        this.setData({
          "detail.content": this.detailContent
        });
      }, 2500);
    } else if (e.target.dataset.type == "reply") {
      this.data.comment[e.target.dataset.index].content =
        "<span style='background:#f6eeee'>" +
        this.data.comment[e.target.dataset.index].content +
        "</span>";
      this.setData({
        comment: this.data.comment
      });
      setTimeout(() => {
        this.data.comment[e.target.dataset.index].content = this.comment[
          e.target.dataset.index
        ].content;
        this.setData({
          comment: this.data.comment
        });
      }, 2500);
    } else {
      this.data.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chiindex
        ].reply_content =
        "<span style='background:#f6eeee'>" +
        this.data.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chiindex
        ].reply_content +
        "</span>";
      this.setData({
        comment: this.data.comment
      });
      setTimeout(() => {
        this.data.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chiindex
        ].reply_content = this.comment[e.target.dataset.index].reply_array[
          e.target.dataset.chiindex
        ].reply_content;
        this.setData({
          comment: this.data.comment
        });
      }, 2500);
    }
  },
  tocdetai() {
    let pages = getCurrentPages(),
      jump = false;
    pages.forEach(item => {
      item.route == "pages/cDetail/cDetail" ? (jump = true) : "";
    });
    if (jump) {
      wx.navigateBack();
    } else {
      wx.navigateTo({
        url: "/pages/cDetail/cDetail?id=" + this.data.detail.fs_id
      });
    }
  },
  toUser(e) {
    if (this.data.$state.userInfo.id == e.currentTarget.dataset.item.uid) {
      wx.switchTab({
        url: "/pages/user/user"
      });
    } else {
      wx.navigateTo({
        url: `../personPage/personPage?uid=${e.currentTarget.dataset.item.uid}&nickname=${e.currentTarget.dataset.item.nickname}&avatar=${e.currentTarget.dataset.item.avatar}`
      });
    }
  },
  collect() {
    this.data.showSheet ?
      this.setData({
        showSheet: false
      }) :
      this.setData({
        showSheet: true
      });
  },
  attention() {
    let param = {
      follower_uid: this.data.detail.uid
    };
    app.user.following(param).then(res => {
      this.setData({
        showSheet: false,
        ["detail.is_follow"]: 1
      });
      wx.showToast({
        title: "您已成功关注" + this.data.detail.nickname,
        icon: "none",
        duration: 1500
      });
      this.postPages.setfollow(this.data.detail.uid, true);
    });
  },
  clsocancelFollowing() {
    let param = {
      follower_uid: this.data.detail.uid
    };
    app.user.cancelFollowing(param).then(res => {
      this.setData({
        showSheet: false,
        ["detail.is_follow"]: 0
      });
      wx.showToast({
        title: "取消关注成功",
        icon: "none",
        duration: 1500
      });
      this.postPages.setfollow(this.data.detail.uid);
    });
  },
  cancelCollection() {
    let param = {
      blog_id: this.data.detail.id
    };
    app.circle
      .collectCancel(param)
      .then(res => {
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 800
        });
        this.setData({
          showSheet: false,
          ["detail.collectstatus"]: 0
        });
        this.postPages.pagesCollect(this.data.detail.id, 0);
      })
  },
  setCollect() {
    let param = {
      blog_id: this.data.detail.id
    };
    app.circle
      .collect(param)
      .then(res => {
        wx.showToast({
          title: res.msg,
          icon: "success",
          duration: 1500
        });
        this.setData({
          showSheet: false,
          ["detail.collectstatus"]: 1
        });
        this.postPages.pagesCollect(this.data.detail.id, 1);
      })
  },
  closeSheet() {
    this.setData({
      showSheet: false
    });
  },
  checknextTap(e) {
    app.checknextTap(e);
  },
  // 授权个人信息
  onGotUserInfo(e) {
    wx.getUserProfile({
      desc: '请授权您的个人信息便于更新资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.updateBase(res)
        this.release(e)
      },
      fail: () => {
        this.release(e)
      }
    })
  },
});