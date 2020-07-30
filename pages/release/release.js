//获取应用实例
const VodUploader = require('../../vod/vodsdk.js');
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext();
import OBS from "../../OBS/OBSUploadFile.js";
const app = getApp();
Page({
  data: {
    param: {
      image: [],
      content: '',
      video: null,
      cover: null,
      audio: null,
      fs_id: "",
      num: 0,
      fileId: null,
      duration: null
    },
    media_type: null,
    showFlag: true,
    showintegral: false,
    showVoiceBox: 0,
    recordAction: 0,
    recordStatus: 1,
    playRecord: 0,
    timer: {
      second: 0,
      minute: 0
    },
    playTiemr: {
      second: 0,
      minute: 0
    },
    voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png'
  },
  pageName: "发帖页",
  timer: null,
  playTiemr: '',
  onLoad(ops) {
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    ops.type ? this.circle = true : ''
    if (ops.title) {
      this.getCircleList().then(() => {
        let allCircle = this.data.allCircle;
        let showFlag = true;
        let id = "";
        allCircle.forEach(item => {
          if (item.title == ops.title) {
            item.isSel = true;
            showFlag = false;
            id = ops.id
          }
        });
        this.setData({
          allCircle: allCircle,
          selId: id,
          showFlag: showFlag,
          circleId: ops.id,
          circleTitle: ops.title
        })
      });
    } else {
      this.getCircleList();
    }
  },
  onShow() {
    recorderManager.stop()
    this.getRecordAuth();
    this.initRecord();
    if (this.data.$state.releaseParam != null) {
      this.setData({
        param: this.data.$state.releaseParam,
        media_type: this.data.$state.media_type
      });
    }
  },
  onUnload() {
    let pages = getCurrentPages();
    let prePage = [];
    pages.forEach(item => {
      if (item.route == "pages/myCircle/myCircle") {
        prePage = item;
      } else if (item.route == "pages/cDetail/cDetail") {
        prePage = item;
      } else if (item.route == "pages/post/post") {
        prePage = item;
      }
    });
    if (prePage == []) return
    prePage.setData({
      releaseParam: this.data.param,
      media_type: this.data.media_type,
      showRelease: true
    });
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
  },
  input(e) {
    this.setData({
      "param.content": e.detail.value
    });
  },
  cancel() {
    // this.setData({
    //   param: {
    //     image: [],
    //     content: null,
    //     video: null,
    //     cover: null,
    //     fs_id: "",
    //     num: 0
    //   },
    //   media_type: null
    // });
    // this.judge();
    wx.navigateBack()
  },
  addImg() {
    let image = this.data.param.image;
    if (this.data.media_type == 1) {
      this.uploadImg(9 - image.length);
    } else if (this.data.media_type == 2) {
      this.uploadVideo();
    } else {
      wx.showActionSheet({
        itemList: this.data.param.audio ? ["图片"] : ["图片", "视频"],
        itemColor: "#000000",
        success: res => {
          switch (res.tapIndex) {
            case 0:
              this.uploadImg(9 - image.length);
              break;
            case 1:
              this.uploadVideo();
              break;
          }
        }
      });
    }
  },
  selectImg(e) {
    let up = true;
    let index = e.currentTarget.dataset.index;
    this.uploadImg(1, index, up);
  },
  //上传图片
  uploadImg(val, i, up) {
    wx.chooseImage({
      count: val, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showLoading({
          title: "上传中"
        });
        this.obsUpload(res.tempFilePaths, 1, i, up)
        // this.next(res.tempFilePaths, 1, i, up);
      }
    });
  },
  next(val, type, i, up, url) {
    app.circle
      .upload(val[0], type)
      .then(msg => {
        msg = JSON.parse(msg);
        if (msg.code == 1) {
          let image = this.data.param.image;
          if (i != undefined) {
            image[i] = msg.data.url;
          } else {
            image.push(msg.data.url);
          }
          this.setData({
            "param.image": image,
            media_type: type
          });
          this.judge();
        } else {
          wx.showToast({
            title: ms.msg,
            icon: "none",
            duration: 1500
          });
        }

        val.splice(0, 1);
        if (val.length > 0) {
          return this.next(val, type);
        }
      })
      .catch(err => {
        let image = this.data.param.image;
        if (!up) {
          image.push("../../images/sensitivity.png");
          this.setData({
            "param.image": image
          });
        } else {
          image[i] = "../../images/sensitivity.png";
          this.setData({
            "param.image": image
          });
        }
        val.splice(0, 1);
        if (val.length > 0) {
          return this.next(val, type);
        }
      });
  },
  next2(val, type) {
    app.circle
      .upload(val.tempFilePath, type)
      .then(msg => {
        msg = JSON.parse(msg);
        if (msg.code == 1) {
          this.setData({
            "param.video": msg.data.url,
            "param.cover": msg.data.cover,
            "param.asset_id": msg.data.asset_id,
            media_type: type
          });
          this.judge();
        } else {
          wx.showToast({
            title: ms.msg,
            icon: "none",
            duration: 1500
          });
        }
      })
      .catch(err => {
        wx.showToast({
          title: "上传失败！",
          icon: "none",
          duration: 1500
        });
      });
  },
  //上传视频
  getSignature(callback) {
    app.circle.getSignature({}).then(res => {
      callback(res.data)
    })
  },
  uploadVideo() {
    wx.chooseVideo({
      compressed: true,
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        if (res.size / 1024 > 300000) {
          wx.showToast({
            title: "上传的视频不能大于300M",
            icon: "none",
            duration: 1500
          });
          return;
        }
        wx.showLoading({
          title: '正在上传中'
        })
        let that = this
        VodUploader.start({
          // 必填，把 wx.chooseVideo 回调的参数(file)传进来
          mediaFile: res,
          // 必填，获取签名的函数
          getSignature: that.getSignature,
          // 选填，视频名称，强烈推荐填写(如果不填，则默认为“来自小程序”)
          mediaName: '视频',
          // 选填，视频封面，把 wx.chooseImage 回调的参数(file)传进来
          coverFile: res.coverFile,
          // 上传中回调，获取上传进度等信息
          progress: function (result) {
          },
          // 上传完成回调，获取上传后的视频 URL 等信息
          finish: (result) => {
            wx.hideLoading()
            this.setData({
              "param.video": result.videoUrl,
              "param.fileId": result.fileId,
              media_type: 2
            });
            this.judge();
            this.delRecord()
          },
          // 上传错误回调，处理异常
          error: function (result) {
            wx.showToast({
              title: '上传失败'
            })
          },
        });
        // this.next2(res, 2);
      }
    });
  },
  judge() {
    this.setData({
      hide: false
    });
    let imageOver =
      9 <= this.data.param.image.length &&
      this.data.media_type == 1; /* 9张图片 */
    let videoOver =
      this.data.param.video && this.data.media_type == 2; /* 一个视频 */
    if (imageOver || videoOver) {
      this.setData({
        hide: true
      });
    }
  },
  delvideo() {
    this.setData({
      "param.video": null,
      "param.fileId": null,
      media_type: null
    });
    this.judge();
  },
  delImg(e) {
    let index = e.currentTarget.dataset.index;
    let image = this.data.param.image;
    image.splice(index, 1);
    this.setData({
      "param.image": image,
      media_type: image.length > 0 ? 1 : null
    });
    this.judge();
    this.setData({
      num: (this.data.param.num -= 1)
    });
  },
  // 获取所有圈子信息
  getCircleList() {
    return app.circle.joinedCircles().then(msg => {
      this.setData({
        allCircle: msg.data
      });
    });
  },
  //选择圈子
  selTap(e) {
    let allCircle = this.data.allCircle;
    allCircle.forEach(item => {
      item.isSel = false;
    });
    if (e.currentTarget.dataset.other) {
      this.setData({
        allCircle: allCircle,
        selId: '',
        showFlag: true
      })
    } else {
      allCircle[e.currentTarget.dataset.index].isSel = true;
      this.setData({
        allCircle: allCircle,
        selId: e.currentTarget.dataset.fsid,
        showFlag: false
      });
    }
  },
  // 未加圈子判断
  judgeCircle() {
    if (this.circle && !(this.data.selId > 0)) {
      let type = 0,
        that = this,
        image =
        this.data.media_type == 1 ?
        this.data.param.image.join(",") :
        this.data.param.cover
      this.data.allCircle.forEach(item => {
        item.id == this.data.circleId ? type = 1 : ''
      })
      if (!type) {
        if (this.data.param.content.trim() || image || this.data.param.video) {
          wx.showModal({
            content: `是否发布并加入【${this.data.circleTitle}】圈子`,
            confirmColor: '#DF2020',
            cancelColor: '#999999',
            success(res) {
              if (res.confirm) {
                let param = {
                  fs_id: that.data.circleId
                }
                app.circle.addOne(param).then(msg => {
                  that.setData({
                    selId: that.data.circleId
                  })
                  wx.nextTick(
                    () => {
                      that.result()
                    }
                  )
                })
              } else if (res.cancel) {
                that.result()
              }
            }
          })
        } else {
          wx.showToast({
            title: "内容不能为空！",
            icon: "none",
            duration: 1500
          });
        }
      } else {
        this.result()
      }
    } else {
      this.result()
    }
  },
  // 发布帖子
  result() {
    let param = {
      image: this.data.media_type == 1 ?
        this.data.param.image.join(",") : this.data.param.cover,
      content: this.data.param.content || "",
      video: this.data.param.video,
      //选择展示到圈子,并且选中或者是为空
      // fs_id: this.data.showFlag && (this.data.selId || ""),
      fs_id: this.data.selId || "",
      asset_id: this.data.param.asset_id || "",
      fileId: this.data.param.fileId || "",
      audio: this.data.param.audio || "",
      duration: this.data.param.duration || ""
    };
    let num = this.data.param.num;
    let next = true;
    this.data.param.image.forEach(item => {
      item == "../../images/sensitivity.png" ? (next = false) : "";
    });
    if (next) {
      if (param.content.trim() || param.image || param.video) {
        wx.showLoading({
          title: "发布中",
          mask: true
        });
        app.circle
          .add(param)
          .then(msg => {
            wx.hideLoading();
            let paramInit = {
                image: [],
                content: null,
                video: null,
                cover: null,
                fs_id: "",
                num: 0
              },
              integral = "";
            this.setData({
              param: paramInit
            });
            if (msg.data.is_first == "first") {
              this.setData({
                integral: "+50 学分",
                integralContent: "完成首次发帖",
                showintegral: true
              });
              integral = "first";
            } else if (msg.data.is_first == "day") {
              this.setData({
                integral: "+20 学分",
                integralContent: "完成每日[秀风采]首次发帖",
                showintegral: true
              });
              integral = "day";
            }
            app.store.setState({
              releaseParam: null,
              media_type: null
            });
            app.globalData.rlSuc = true;
            if (integral == "first" || integral == "day") {
              setTimeout(() => {
                if (this.circle && this.data.selId == this.data.circleId) {
                  wx.navigateBack()
                } else if (this.circle && this.data.selId != this.data.circleId && this.data.selId > 0) {
                  wx.redirectTo({
                    url: '/pages/cDetail/cDetail?id=' + this.data.selId,
                  })
                } else {
                  wx.switchTab({
                    url: "/pages/post/post"
                  });
                }
              }, 2000);
            } else {
              if (this.circle && this.data.selId == this.data.circleId) {
                wx.navigateBack()
              } else if (this.circle && this.data.selId != this.data.circleId && this.data.selId > 0) {
                wx.redirectTo({
                  url: '/pages/cDetail/cDetail?id=' + this.data.selId,
                })
              } else {
                wx.switchTab({
                  url: "/pages/post/post"
                });
              }
            }
          })
          .catch(msg => {
            wx.showToast({
              title: msg.msg,
              icon: "none",
              duration: 1500,
              mask: false
            });
          });
      } else {
        wx.showToast({
          title: "内容不能为空！",
          icon: "none",
          duration: 1500
        });
      }
    } else {
      wx.showToast({
        title: "您的帖子涉及敏感内容，请修改后重新发布！",
        icon: "none",
        duration: 1500
      });
    }
  },
  // 权限询问
  authrecord() {
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
  getRecordAuth() {
    wx.getSetting({
      success(res) {
        let record = res.authSetting["scope.record"];
        app.store.setState({
          authRecord: record || false
        });
      },
      fail(res) {}
    });
  },
  getSystemInfo() {
    let system =  wx.getSystemInfoSync()
    return system.microphoneAuthorized
  },
  /**
   * 初始化语音识别回调 && 语音播放
   */
  initRecord() {
    recorderManager.onStart(() => {
      this.interval()
    })

    recorderManager.onStop(res => {
      this.filePath = res.tempFilePath;
      let duration = res.duration;
        this.setData({
          recordStatus: 3
        })
        this.timer ? [clearInterval(this.timer), this.timer = null] : ''
      console.log(res.tempFilePath, res.duration)
    })

    innerAudioContext.onPlay(() => {
      this.setData({
        'playTiemr.minute': 0,
        'playTiemr.second': 0
      })
      this.playTiemr ? clearInterval(this.playTiemr) : ''
      this.playTiemr = setInterval(() => {
        if (this.data.playTiemr.minute == this.data.timer.minute && this.data.playTiemr.second == this.data.timer.second) {
          innerAudioContext.stop()
          return
        }
        let num = this.data.playTiemr.second
        num += 1
        num > 60 ? this.setData({
          'playTiemr.minute': this.data.playTiemr.minute += 1,
          'playTiemr.second': 0
        }) : this.setData({
          'playTiemr.second': num
        })
      }, 1000)
    })

    innerAudioContext.onStop(() => {
      this.playTiemr ? clearInterval(this.playTiemr) : ''
      this.setData({
        playRecord: 0,
        voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png'
      })
    })
  },
  showRecorBox() {
    this.setData({
      showVoiceBox: 1
    })
  },
  recordStart(e) {
    let type = e.currentTarget.dataset.starus,
      remake = e.currentTarget.dataset.remake,
      that = this
    switch (type) {
      case '1': {
         wx.showModal({
            content: '重录会删除这条录音，确定重录',
            confirmColor: '#DF2020',
            success(res) {
              if (res.confirm) {
                that.setData({
                  recordStatus: type,
                  'timer.minute': 0,
                  'timer.second': 0
                })
              }
            }
          })
          break;
      }
      case '2':
         if (this.data.$state.authRecord) {
          if(this.getSystemInfo()) {
            that.setData({
              recordStatus: type
            })
            recorderManager.start({
              duration: 300000,
              format: 'mp3'
            })
          } else {  
            recorderManager.start()
            wx.nextTick(() =>{
              recorderManager.stop()
            })
          }
        } else {
          this.authrecord()
        }
        break;
      case '3':
        recorderManager.stop()
        if(!this.data.timer.minute && !this.data.timer.second){
          wx.showToast({
            title: '录音时间过短',
            icon: 'none'
          })
          this.setData({
            recordStatus: 1,
            'timer.minute': 0,
            'timer.second': 0
          })
          return
        }
        break;
    }
  },
  interval() {
      this.setData({
        'timer.minute': 0,
        'timer.second': 0
      })
      this.timer ? [clearInterval(this.timer), this.timer = null] : ''
      this.timer = setInterval(() => {
        let num = this.data.timer.second
        num += 1
        num > 60 ? this.setData({
          'timer.minute': this.data.timer.minute += 1,
          'timer.second': 0
        }) : this.setData({
          'timer.second': num
        })
        if (this.data.timer.minute >= 5) {
          clearInterval(this.timer)
          this.timer = null
          this.setData({
            recordStatus: 3
          })
        }
      }, 1000)
  },
  playVoice() {
    if (!this.data.playRecord) {
      this.setData({
        playRecord: 1,
        voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/voicepause.png'
      })
      innerAudioContext.src = this.filePath;
      innerAudioContext.play();
    } else {
      this.setData({
        playRecord: 0
      })
      innerAudioContext.stop();
    }

  },
  uprecorde(i, up) {
    innerAudioContext.stop()
    wx.showToast({
      title: '正在压缩',
      icon: 'none',
      duration: 600000
    })
    this.obsUpload(this.filePath);
  },
  delRecord() {
    this.setData({
      'param.audio': null,
      'param.duration': null,
      timer: {
        second: 0,
        minute: 0
      },
      playTiemr: {
        second: 0,
        minute: 0
      },
      playRecord: 0,
      voiceplayimg: 'https://hwcdn.jinlingkeji.cn/images/pro/triangle.png',
      showVoiceBox: 0,
      recordStatus: 1
    });
    innerAudioContext.stop();
    this.filePath = null
  },
  //用于数据统计
  onHide() {
    this.getSystemInfo() ? this.data.recordStatus == 2 && this.setData({
      recordStatus: 3
    }) : ''
    recorderManager.stop()
    this.timer ? [clearInterval(this.timer), this.timer = null] : ''
  },
  obsUpload(medias, type, i, up) {
    let reqs = [];
    if (type) {
      let reqs = [];
      medias.forEach(media => {
        reqs.push(OBS("ballot/img", media, "image"));
      });
      Promise.all(reqs)
        .then(res => {
          console.log(res)
          if (res[0]) {
            i >= 0 && up ? this.setData({
              [`param.image[${i}]`]: res,
              media_type: 1
            }) :  this.setData({
              'param.image': this.data.param.image.concat(res),
              media_type: 1
            });
            wx.hideLoading();
          } else {
            wx.showToast({
              icon: "none",
              title: "上传失败"
            });
          }
        })
        .catch(err => {
          if (err != "type") {
            wx.showToast({
              icon: "none",
              title: (err.data && err.data.msg) || "上传失败"
            });
          }
        });
    } else {
      OBS("ballot/audio", medias, "audio")
        .then(res => {
          if (res) {
            this.setData({
              'param.audio': res,
              'param.duration': (this.data.timer.minute * 60) + this.data.timer.second,
              recordStatus: 1,
              showVoiceBox: 0
            });
            console.log(this.data.param)
            wx.hideToast();
          } else {
            wx.hideToast();
            wx.showToast({
              icon: "none",
              title: "上传失败"
            });
          }
        })
        .catch(err => {
          console.log(err)
          if (err != "type") {
            wx.showToast({
              icon: "none",
              title: (err.data && err.data.msg) || "上传失败"
            });
          }
        });
    }
  },
});