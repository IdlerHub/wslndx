//获取应用实例
// const VodUploader = require('../../lib/vod-wx-sdk-v2.js');
const app = getApp();
Page({
  data: {
    param: {
      image: [],
      content: '',
      video: null,
      cover: null,
      fs_id: "",
      num: 0
    },
    media_type: null,
    showFlag: true,
    showintegral: false
  },
  pageName: "发帖页",
  onLoad(ops) {
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
        itemList: ["图片", "视频"],
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
        console.log(res.tempFilePaths)
        // this.obsUpload(res.tempFilePaths)
        // this.next(, 1, i, up);
      }
    });
  },
  obsUpload(medias) {
    let reqs = [];
    medias.forEach(media => {
      reqs.push(OBS("ballot/img", media, "image"));
    });
    Promise.all(reqs)
      .then(res => {
        if (res[0]) {
          console.log(res)
          // this.setData({
          //   imgList: this.data.imgList.concat(res)
          // });
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
    callback('DHy3HUBq8yp+ASG0oeqdANi0LTRzZWNyZXRJZD1BS0lEQlBsc2xOTjk2dWE2T1Znd2ZNSTBzakpnVDFJSXhvak8mY3VycmVudFRpbWVTdGFtcD0xNTk1ODE3NjIzJmV4cGlyZVRpbWU9MTU5NTk5MDQyMyZyYW5kb209NTE1MjYwODU0JnByb2NlZHVyZT1qbGtqX3ZvZF90YXNrJnRhc2tOb3RpZnlNb2RlPUZpbmlzaCZzZXNzaW9uQ29udGV4dD1odHRwczovL2dhdGV3YXkuamlubGluZ2tlamkuY24vbWFqb3IvdGVuY2VudC9ub3RpZmljYXRpb24vdm9kQ2hlY2smY2xhc3NJZD02Njc4MjEmdm9kU3ViQXBwSWQ9MTUwMDAwMTE2Ng==') 
  },
  uploadVideo() {
    wx.chooseVideo({
      compressed: true,
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        if (res.size / 1024 > 5000) {
          wx.showToast({
            title: "上传的视频不能大于5M",
            icon: "none",
            duration: 1500
          });
          return;
        }
        console.log(res)
        // let that = this
        // VodUploader.start({
        //   // 必填，把 wx.chooseVideo 回调的参数(file)传进来
        //   mediaFile: res,
        //   // 必填，获取签名的函数
        //   getSignature: that.getSignature,
        //   // 选填，视频名称，强烈推荐填写(如果不填，则默认为“来自小程序”)
        //   mediaName: '视频',
        //   // 选填，视频封面，把 wx.chooseImage 回调的参数(file)传进来
        //   coverFile: res.coverFile,
        //   // 上传中回调，获取上传进度等信息
        //   progress: function (result) {
        //     console.log('progress');
        //     console.log(result);
        //   },
        //   // 上传完成回调，获取上传后的视频 URL 等信息
        //   finish: (result) => {
        //     console.log('finish');
        //     console.log(result);
        //     wx.showModal({
        //       title: '上传成功',
        //       content: 'fileId:' + result.fileId + '\nvideoName:' + result.videoName,
        //       showCancel: false
        //     });
        //   },
        //   // 上传错误回调，处理异常
        //   error: function (result) {
        //     console.log('error');
        //     console.log(result);
        //     wx.showModal({
        //       title: '上传失败',
        //       content: JSON.stringify(result),
        //       showCancel: false
        //     });
        //   },
        // });
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
      "param.cover": null,
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
  //是否同步到圈子
  // switchChange: function(e) {
  //   this.setData({
  //     showFlag: e.detail.value
  //   });
  // },
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
        this.data.param.image.join(",") :
        this.data.param.cover,
      content: this.data.param.content || "",
      video: this.data.param.video,
      //选择展示到圈子,并且选中或者是为空
      // fs_id: this.data.showFlag && (this.data.selId || ""),
      fs_id: this.data.selId || "",
      asset_id: this.data.param.asset_id || ""
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
  //用于数据统计
  onHide() {}
});