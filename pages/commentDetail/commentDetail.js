/*
 * @Date: 2019-08-07 11:06:58
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-13 17:15:10
 */
// pages/commentDetail/commentDetail.js
const app = getApp()
const LiveData = require("../../data/LiveData");
const plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()
const innerAudioContext = wx.createInnerAudioContext();
const record = require('../../utils/record')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    apiList: [
      app.classroom, //课程api
      LiveData, //直播api
    ],
    detail: {},
    content: "",
    opts: {},
    contenLength: 0,
    showvoice: false,
    voicetime: 0,
    showvoiceauto: false,
    voicetextstatus: "",
    voivetext: "",
    voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
    replyshow: false,
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
  pageName: "多回复详情页",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.navParams = options;
    this.apiIndex = 0;
    if (options.lesson_id) {
      if (options.is_live) {
        this.apiIndex = 1;
        console.log("这是直播的")
      }
      this.getlesData();
    } else {
      this.getData();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initRecord();
    this.getRecordAuth();
    record.initRecord(this)
  },
  /**
   * 获取评论详情
   */
  getData() {
    return app.circle.replyDetail(this.navParams).then((res) => {
      res.data.pause = true;
      res.data.timer = {
        minute: parseInt(res.data.audio_duration / 60),
        second: res.data.audio_duration - (parseInt(res.data.audio_duration / 60) * 60)
      }
      res.data.reply_array.forEach((v) => {
        v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`;
        v.pause = true;
        v.timer = {
          minute: parseInt(v.audio_duration / 60),
          second: v.audio_duration - (parseInt(v.audio_duration / 60) * 60)
        }
        v.id = v.reply_id
      });
      this.setData({
        detail: res.data,
      });
    });
  },
  getlesData() {
    console.log(this.navParams);
    return this.data.apiList[this.apiIndex].replyList(this.navParams).then((res) => {
      res.data.reply_array.forEach((v) => {
        v.rtext = `回复<span  class="respond">${v.to_user}</span>:&nbsp;&nbsp;`;
        v.timer = {
          minute: parseInt(v.audio_duration / 60),
          second: v.audio_duration - (parseInt(v.audio_duration / 60) * 60)
        }
        v.id = v.reply_id
      });
      this.setData({
        detail: res.data,
      });
    });
  },
  showModal(e) {
    wx.showModal({
      content: "确定删除该评论?",
      confirmColor: "#df2020",
      success: (res) => {
        if (res.confirm) {
          if (e.currentTarget.dataset.item) {
            this.delReply(e);
          } else {
            this.delComment();
          }
        }
      },
    });
  },
  /**
   * 删除评论
   * */
  delComment() {
    if (this.data.detail.lesson_id) {
      let param = {
        lesson_id: this.data.detail.lesson_id,
        comment_id: this.data.detail.id,
      };
      this.data.apiList[this.apiIndex]
        .delComment(param)
        .then((msg) => {
          this.toast("删除成功");
          this.emitEvent();
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 1500);
        })
        .catch((err) => {
          if (err.code == -2) {
            /* 帖子已经删除 */
            this.setData({
              detail: {},
            });
          } else {
            this.toast("删除失败，请稍后重试");
          }
        });
    } else {
      let param = {
        blog_id: this.data.detail.blog_id,
        id: this.data.detail.id,
      };
      app.circle
        .delComment(param)
        .then((msg) => {
          this.toast("删除成功");
          this.emitEvent();
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            });
          }, 1500);
        })
        .catch((err) => {
          if (err.code == -2) {
            /* 帖子已经删除 */
            this.setData({
              detail: {},
            });
          } else {
            this.toast("删除失败，请稍后重试");
          }
        });
    }
  },
  delReply(e) {
    if (this.data.detail.lesson_id) {
      let params = {
        lesson_id: this.data.detail.lesson_id,
        comment_id: this.data.detail.id,
        id: e.currentTarget.dataset.item.reply_id,
      };
      if (this.apiIndex == 1) {
        params = {
          reply_id: e.currentTarget.dataset.item.reply_id,
        };
      }
      this.data.apiList[this.apiIndex]
        .delReply(params)
        .then((msg) => {
          this.toast("删除成功");
          this.emitEvent();
          this.getlesData();
        })
        .catch((err) => {
          if (err.code == -2) {
            /* 帖子已经删除 */
            this.setData({
              detail: {},
            });
          } else {
            this.toast("删除失败，请稍后重试");
          }
        });
    } else {
      let params = {
        blog_id: this.data.detail.blog_id,
        comment_id: this.data.detail.id,
        id: e.currentTarget.dataset.item.reply_id,
      };
      app.circle
        .replydel(params)
        .then((msg) => {
          this.toast("删除成功");
          this.emitEvent();
          this.getData();
        })
        .catch((err) => {
          if (err.code == -2) {
            /* 帖子已经删除 */
            this.setData({
              detail: {},
            });
          } else {
            this.toast("删除失败，请稍后重试");
          }
        });
    }
  },
  toast(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
      duration: 1500,
    });
  },
  /* 刷新路由中前一个页面的评论列表 */
  emitEvent() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.emit("refreshComments");
  },
  /* 打开输入框 */
  show(e) {
    this.replyInfo = e.target.dataset.reply;
    if (this.data.$state.userInfo.status !== "normal") {
      wx.showModal({
        content: "由于您近期不合规操作，您的账户已被管理员禁止发帖留言，如有疑问请在个人中心联系客服处理",
        confirmColor: "#df2020",
      });
    } else {
      if (this.replyInfo) {
        this.setData({
          write: true,
          replyplaceholder: "回复 " + e.currentTarget.dataset.reply.from_user,
          replyshow: true,
          focus: true,
        });
      } else {
        this.setData({
          write: true,
          replyplaceholder: "回复 " + e.currentTarget.dataset.detail.nickname,
          replyshow: true,
          focus: true,
        });
      }

      if (this.data.detail.lesson_id) {
        if (this.data.$state.lessDiscussion[this.data.detail.lesson_id]) {
          if (
            this.replyInfo &&
            this.data.$state.lessDiscussion[this.data.detail.lesson_id][
              "replyParent"
            ]
          ) {
            this.data.$state.lessDiscussion[this.data.detail.lesson_id][
                "replyParent"
              ][this.data.detail.id] ?
              this.setData({
                content: this.data.$state.lessDiscussion[
                  this.data.detail.lesson_id
                ]["replyParent"][this.data.detail.id],
                contenLength: this.data.$state.lessDiscussion[this.data.detail.lesson_id][
                  "replyParent"
                ][this.data.detail.id].length || 0,
              }) :
              this.setData({
                content: "",
                contenLength: 0,
              });
          } else if (
            !this.replyInfo &&
            this.data.$state.lessDiscussion[this.data.detail.lesson_id][
              "replyInfo"
            ]
          ) {
            this.data.$state.lessDiscussion[this.data.detail.lesson_id][
                "replyInfo"
              ][this.data.detail.id] ?
              this.setData({
                content: this.data.$state.lessDiscussion[
                  this.data.detail.lesson_id
                ]["replyInfo"][this.data.detail.id],
                contenLength: this.data.$state.lessDiscussion[this.data.detail.lesson_id][
                  "replyInfo"
                ][this.data.detail.id].length || 0,
              }) :
              this.setData({
                content: "",
                contenLength: 0,
              });
          } else {
            this.setData({
              content: "",
              contenLength: 0,
            });
          }
        }
      } else {}
    }
  },
  /* 关闭输出框 */
  hide() {
    this.setData({
      write: false,
      content: null,
    });
  },
  /* 输入的内容 */
  input(e) {
    this.setData({
      content: e.detail.value,
      contenLength: e.detail.value.length,
    });
    if (this.data.detail.blog_id) {
      let blogcomment = this.data.$state.blogcomment;
      blogcomment[this.data.detail.blog_id] ?
        "" :
        (blogcomment[this.data.detail.blog_id] = {});
      if (this.replyInfo) {
        blogcomment[this.data.detail.blog_id]["replyParent"] ?
          "" :
          (blogcomment[this.data.detail.blog_id]["replyParent"] = {});
        blogcomment[this.data.detail.blog_id]["replyParent"][
          this.data.detail.id
        ] = this.data.content;
      } else {
        blogcomment[this.data.detail.blog_id]["replyInfo"] ?
          "" :
          (blogcomment[this.data.detail.blog_id]["replyInfo"] = {});
        blogcomment[this.data.detail.blog_id]["replyInfo"][
          this.data.detail.id
        ] = this.data.content;
      }
      app.store.setState({
        blogcomment,
      });
    } else {
      let lessDiscussion = this.data.$state.lessDiscussion;
      lessDiscussion[this.data.detail.lesson_id] ?
        "" :
        (lessDiscussion[this.data.detail.lesson_id] = {});
      if (this.replyInfo) {
        lessDiscussion[this.data.detail.lesson_id]["replyParent"] ?
          "" :
          (lessDiscussion[this.data.detail.lesson_id]["replyParent"] = {});
        lessDiscussion[this.data.detail.lesson_id]["replyParent"][
          this.data.detail.id
        ] = this.data.content;
      } else {
        lessDiscussion[this.data.detail.lesson_id]["replyInfo"] ?
          "" :
          (lessDiscussion[this.data.detail.lesson_id]["replyInfo"] = {});
        lessDiscussion[this.data.detail.lesson_id]["replyInfo"][
          this.data.detail.id
        ] = this.data.content;
      }
      app.store.setState({
        lessDiscussion,
      });
    }
  },
  /* 发送回复 */
  release(e, params, type) {
    let param = {}
    if (this.data.detail.lesson_id) {
      param = {
        lesson_id: this.data.detail.lesson_id,
        comment_id: this.data.detail.id,
        reply_content: this.data.content,
        reply_type: this.replyInfo ? 2 : 1,
        reply_id: this.replyInfo ? this.replyInfo.reply_id : -1,
        to_user: this.replyInfo ?
          this.replyInfo.reply_user_id : this.data.detail.uid,
        type: 1
      };
    } else {
      param = {
        blog_id: this.data.detail.blog_id,
        comment_id: this.data.detail.id,
        reply_content: this.data.content,
        reply_type: this.replyInfo ? 2 : 1,
        reply_id: this.replyInfo ? this.replyInfo.reply_id : -1,
        to_user: this.replyInfo ?
          this.replyInfo.reply_user_id : this.data.detail.uid,
        type: 1
      };
    }
    params ? Object.assign(param, params) : ''
    if (e.currentTarget.dataset.type) {
      wx.navigateTo({
        url: `/page/post/pages/release/release?params=${JSON.stringify(param)}`,
      })
    } else if (!!this.data.content.trim() || !!params.reply_content.trim()) {
      /* 回复别人的回复 reply_type=2   /  回复评论主体 reply_type=1   */
      this.reply(param, type);
    }
  },
  /* 回复评论 */
  reply(params, type) {
    // this.hide()
    wx.showLoading({
      title: "发布中",
    });
    if (this.data.detail.lesson_id) {
      this.data.apiList[this.apiIndex]
        .addReply(params)
        .then(() => {
          let lessDiscussion = this.data.$state.lessDiscussion;
          if (this.replyInfo) {
            lessDiscussion[this.data.detail.lesson_id]["replyParent"][
              this.data.detail.id
            ] = "";
          } else {
            lessDiscussion[this.data.detail.lesson_id]["replyInfo"][
              this.data.detail.id
            ] = "";
          }
          app.store.setState({
            lessDiscussion,
          });
          this.toast("回复成功");
          this.emitEvent();
          this.getlesData();
          this.setData({
            content: "",
            showvoice: false,
            showvoiceauto: false,
            voicetime: 0,
            contenLength: 0,
            write: false,
          });
        })
        .catch((err) => {
          if (err.code == -2) {
            this.toast("帖子已删除,回复失败");
          } else if (err.code == -3) {
            this.toast("信息已删除,回复失败");
          } else {
            this.toast("回复失败");
          }
        });
    } else {
      app.circle
        .reply(params)
        .then(() => {
          if (type) {
            wx.navigateBack()
          } else {
            let blogcomment = this.data.$state.blogcomment;
            if (this.replyInfo) {
              blogcomment[this.data.detail.blog_id]["replyParent"][
                this.data.detail.id
              ] = "";
            } else {
              blogcomment[this.data.detail.blog_id]["replyInfo"][
                this.data.detail.id
              ] = "";
            }
            app.store.setState({
              blogcomment,
            });
          }
          this.toast("回复成功");
          this.emitEvent();
          this.getData();
          this.setData({
            content: "",
            showvoice: false,
            showvoiceauto: false,
            voicetime: 0,
            contenLength: 0,
            write: false,
          });
        })
        .catch((err) => {
          console.log(err)
          if (err.code == -2) {
            this.toast("帖子已删除,回复失败");
          } else if (err.code == -3) {
            this.toast("信息已删除,回复失败");
          } else if(err.code == 0) {
            this.toast("回复失败");
          }
        });
    }
  },
  /**
   * 页面卸载
   */
  onUnload() {
    wx.hideToast();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData().then(() => {
      wx.stopPullDownRefresh();
    });
  },
  toComment() {
    let vm = this;
    this.setData({
      write: false,
    });
    wx.navigateTo({
      url: "../comment/comment?content=" +
        (this.data.content != undefined ? this.data.content : ""),
      events: {
        commentContent: (res) => {
          vm.setData({
            content: res.data,
          });
          vm.release();
        },
      },
    });
  },
  textHeight(e) {
    this.setData({
      textHeight: e.detail.height + "px",
    });
  },
  hide() {
    this.setData({
      write: false,
    });
  },
  showWrite(e) {
    this.setData({
      write: true,
      showvoice: false,
      focus: true,
      showvoiceauto: false,
      voicetime: 0,
      contenLength: this.data.content.length || 0,
    });
  },
  // 语音
  // 权限询问
  authrecord() {
    this.setData({
      focus: false,
    });
    if (this.data.$state.authRecordfail) {
      wx.showModal({
        content: "您已拒绝授权使用麦克风录音权限，请打开获取麦克风授权！否则无法使用小程序部分功能",
        confirmText: "去授权",
        confirmColor: "#df2020",
        success: (res) => {
          if (res.confirm) {
            wx.openSetting({});
          }
        },
      });
    }
    if (!this.data.$state.authRecord) {
      wx.authorize({
        scope: "scope.record",
        success() {
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
          app.store.setState({
            authRecord: true,
          });
        },
        fail() {
          app.store.setState({
            authRecordfail: true,
          });
        },
      });
    }
  },
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        let record = res.authSetting["scope.record"];
        app.store.setState({
          authRecord: record || false,
        });
      },
    });
  },
  /**
   * 初始化语音识别回调
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      clearInterval(this.timer);
      this.setData({
        newtxt: res.result,
        voiceActon: false,
      });
    };

    // 识别结束事件
    manager.onStop = (res) => {
      clearInterval(this.timer);
      // 取出录音文件识别出来的文字信息
      if (!this.data.showvoiceauto) return;
      let text = res.result;
      text = this.data.content + text;
      // 获取音频文件临时地址
      let filePath = res.tempFilePath;
      let duration = res.duration;
      if (text == "") {
        this.setData({
          voicetextstatus: "未能识别到文字",
        });
        return;
      }
      this.setData({
        content: text,
        contentlenghth: text.length,
        voicetext: res.result,
        voicetextstatus: "",
        filePath,
        voiceActon: false,
      });
      if (this.data.detail.blog_id) {
        let blogcomment = this.data.$state.blogcomment;
        blogcomment[this.data.detail.blog_id] != undefined ?
          "" :
          (blogcomment[this.data.detail.blog_id] = {});
        if (this.replyInfo) {
          blogcomment[this.data.detail.blog_id]["replyParent"] != undefined ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyParent"] = {});
          blogcomment[this.data.detail.blog_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          blogcomment[this.data.detail.blog_id]["replyInfo"] != undefined ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyInfo"] = {});
          blogcomment[this.data.detail.blog_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          blogcomment,
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.detail.lesson_id] != undefined ?
          "" :
          (lessDiscussion[this.data.detail.lesson_id] = {});
        if (this.replyInfo) {
          lessDiscussion[this.data.detail.lesson_id]["replyParent"] != undefined ?
            "" :
            (blogcomment[this.data.detail.lesson_id]["replyParent"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"] != undefined ?
            "" :
            (lessDiscussion[this.data.detail.lesson_id]["replyInfo"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          lessDiscussion,
        });
      }
    };

    // 识别错误事件
    manager.onError = (res) => {
      clearInterval(this.timer);
      this.setData({
        recording: false,
        bottomButtonDisabled: false,
        voiceActon: false,
      });
    };
  },
  showvoice(e) {
    this.setData({
      showvoice: true,
      write: false,
    });
  },
  touchstart() {
    this.setData({
      voiceActon: true,
      voicetextstatus: "正在语音转文字…",
    });
    this.voicetime();
    manager.start({
      lang: "zh_CN",
    });
  },
  touchend() {
    manager.stop();
    if (this.data.voicetime < 1) {
      wx.showToast({
        title: "说话时间过短",
        icon: "none",
        duration: 2000,
      });
    } else {
      this.setData({
        showvoiceauto: true,
      });
    }
    this.setData({
      voiceActon: false,
    });
  },
  // 语音播放
  playvoice() {
    innerAudioContext.src = this.data.filePath;
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png",
      });
    });
    innerAudioContext.onEnded(() => {
      this.setData({
        voiceplayimg: "https://hwcdn.jinlingkeji.cn/images/pro/triangle.png",
      });
    });
  },
  relacevoice() {
    let text = "",
      voicetext = this.data.voicetext;
    if (this.replyInfo) {
      this.data.content == "" ?
        "" :
        (text = this.data.content.replace(voicetext, ""));
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: "",
      });
      if (this.data.detail.blog_id) {
        let blogcomment = this.data.$state.blogcomment;
        blogcomment[this.data.detail.blog_id] ?
          "" :
          (blogcomment[this.data.detail.blog_id] = {});
        if (this.replyInfo) {
          blogcomment[this.data.detail.blog_id]["replyParent"] ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyParent"] = {});
          blogcomment[this.data.detail.blog_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          blogcomment[this.data.detail.blog_id]["replyInfo"] ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyInfo"] = {});
          blogcomment[this.data.detail.blog_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          blogcomment,
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.detail.lesson_id] ?
          "" :
          (lessDiscussion[this.data.detail.lesson_id] = {});
        if (this.replyInfo) {
          lessDiscussion[this.data.detail.lesson_id]["replyParent"] ?
            "" :
            (lessDiscussion[this.data.detail.lesson_id]["replyParent"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"] ?
            "" :
            (lessDiscussion[this.data.detail.lesson_id]["replyInfo"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          lessDiscussion,
        });
      }
    } else {
      this.data.content == "" ?
        "" :
        (text = this.data.content.replace(voicetext, ""));
      this.setData({
        showvoiceauto: false,
        content: text,
        voicetime: 0,
        filePath: "",
      });
      if (this.data.detail.blog_id) {
        let blogcomment = this.data.$state.blogcomment;
        blogcomment[this.data.detail.blog_id] ?
          "" :
          (blogcomment[this.data.detail.blog_id] = {});
        if (this.replyInfo) {
          blogcomment[this.data.detail.blog_id]["replyParent"] ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyParent"] = {});
          blogcomment[this.data.detail.blog_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          blogcomment[this.data.detail.blog_id]["replyInfo"] ?
            "" :
            (blogcomment[this.data.detail.blog_id]["replyInfo"] = {});
          blogcomment[this.data.detail.blog_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          blogcomment,
        });
      } else {
        let lessDiscussion = this.data.$state.lessDiscussion;
        lessDiscussion[this.data.detail.lesson_id] ?
          "" :
          (lessDiscussion[this.data.detail.lesson_id] = {});
        if (this.replyInfo) {
          lessDiscussion[this.data.detail.lesson_id]["replyParent"] ?
            "" :
            (lessDiscussion[this.data.detail.lesson_id]["replyParent"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyParent"][
            this.data.detail.id
          ] = this.data.content;
        } else {
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"] ?
            "" :
            (lessDiscussion[this.data.detail.lesson_id]["replyInfo"] = {});
          lessDiscussion[this.data.detail.lesson_id]["replyInfo"][
            this.data.detail.id
          ] = this.data.content;
        }
        app.store.setState({
          lessDiscussion,
        });
      }
    }
  },
  closevoiceBox() {
    this.setData({
      showvoice: false,
      write: false,
      showvoiceauto: false,
      voicetime: 0,
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
        voicetime: time,
      });
    }, 1000);
  },
  /*长按复制内容 */
  copythat(e) {
    app.copythat(e.target.dataset.content);
  },
});