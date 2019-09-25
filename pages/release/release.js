//获取应用实例
const app = getApp()
Page({
  data: {
    param: {
      image: [],
      content: null,
      video: null,
      cover: null,
      fs_id: ""
    },
    media_type: null,
    showFlag: false
  },
  onLoad() {
    this.getCircleList()
  },
  input(e) {
    this.setData({
      "param.content": e.detail.value
    })
  },
  cancel() {
    this.setData({
      param: {
        image: [],
        content: null,
        video: null,
        cover: null,
        fs_id: ""
      },
      media_type: null
    })
    this.judge()
  },
  addImg() {
    let image = this.data.param.image
    if (this.data.media_type == 1) {
      this.uploadImg(9 - image.length)
    } else if (this.data.media_type == 2) {
      this.uploadVideo()
    } else {
      wx.showActionSheet({
        itemList: ["图片", "视频"],
        itemColor: "#000000",
        success: res => {
          switch (res.tapIndex) {
            case 0:
              this.uploadImg(9 - image.length)
              break
            case 1:
              this.uploadVideo()
              break
          }
        }
      })
    }
  },
  selectImg(e) {
    let index = e.currentTarget.dataset.index
    this.uploadImg(1, index)
  },
  //上传图片
  uploadImg(val, i) {
    wx.chooseImage({
      count: val, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        this.next(res.tempFilePaths, 1, i)
      }
    })
  },
  next(val, type, i) {
    app.circle
      .upload(val[0], type)
      .then(msg => {
        msg = JSON.parse(msg)
        if (msg.code == 1) {
          let image = this.data.param.image
          if (i != undefined) {
            image[i] = msg.data.url
          } else {
            image.push(msg.data.url)
          }
          this.setData({
            "param.image": image,
            media_type: type
          })
          this.judge()
          val.splice(0, 1)
          if (val.length > 0) {
            return this.next(val, type)
          }
        } else {
          wx.showToast({
            title: ms.msg,
            icon: "none",
            duration: 1500
          })
        }
      })
      .catch(err => {
        wx.showToast({
          title: "您的图片涉及敏感内容，未能上传成功!",
          icon: "none",
          duration: 1500
        })
      })
  },
  next2(val, type) {
    app.circle
      .upload(val.tempFilePath, type)
      .then(msg => {
        msg = JSON.parse(msg)
        console.log(msg)
        if (msg.code == 1) {
          this.setData({
            "param.video": msg.data.url,
            "param.cover": msg.data.cover,
            "param.asset_id": msg.data.asset_id,
            media_type: type
          })
          this.judge()
        } else {
          wx.showToast({
            title: ms.msg,
            icon: "none",
            duration: 1500
          })
        }
      })
      .catch(err => {
        wx.showToast({
          title: "上传失败！",
          icon: "none",
          duration: 1500
        })
      })
  },
  //上传视频
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
          })
          return
        }
        console.log(res)
        this.next2(res, 2)
      }
    })
  },
  judge() {
    this.setData({
      hide: false
    })
    let imageOver = 9 <= this.data.param.image.length && this.data.media_type == 1 /* 9张图片 */
    let videoOver = this.data.param.video && this.data.media_type == 2 /* 一个视频 */
    if (imageOver || videoOver) {
      this.setData({
        hide: true
      })
    }
  },
  delvideo() {
    this.setData({
      "param.video": null,
      "param.cover": null,
      media_type: null
    })
    this.judge()
  },
  delImg(e) {
    let index = e.currentTarget.dataset.index
    let image = this.data.param.image
    image.splice(index, 1)
    this.setData({
      "param.image": image,
      media_type: image.length > 0 ? 1 : null
    })
    this.judge()
  },
  //是否同步到圈子
  switchChange: function(e) {
    this.setData({
      showFlag: e.detail.value
    })
  },
  // 获取所有圈子信息
  getCircleList() {
    app.circle.joinedCircles().then(msg => {
      if (msg.code == 1) {
        this.setData({
          allCircle: msg.data
        })
      }
    })
  },
  //选择圈子
  selTap(e) {
    let allCircle = this.data.allCircle
    allCircle.forEach(item => {
      item.isSel = false
    })
    allCircle[e.currentTarget.dataset.index].isSel = true
    this.setData({
      allCircle: allCircle,
      selId: e.currentTarget.dataset.fsid
    })
  },
  // 发布帖子
  result() {
    let param = {
      image: this.data.media_type == 1 ? this.data.param.image.join(",") : this.data.param.cover,
      content: this.data.param.content || "",
      video: this.data.param.video,
      fs_id: this.data.showFlag && (this.data.selId || ""),
      asset_id: this.data.param.asset_id || ""
    }

    if (param.content.trim() || param.image || param.video) {
      wx.showLoading({
        title: "发布中",
        mask: true
      })
      app.circle.add(param).then(msg => {
        wx.hideLoading()
        if (msg.code == 1) {
          let pages = getCurrentPages()
          let prePage = pages[pages.length - 2]
          if (prePage.route == "pages/cDetail/cDetail") {
            wx.reLaunch({
              url: "../post/post?rlSuc"
            })
          } else {
            wx.navigateBack({
              delta: 1,
              success: function() {
                prePage.rlSuc()
              }
            })
          }
        } else {
          wx.showToast({
            title: msg.msg,
            icon: "none",
            duration: 1500,
            mask: false
          })
        }
      })
    } else {
      wx.showToast({
        title: "内容不能为空！",
        icon: "none",
        duration: 1500
      })
    }
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "发帖页" })
  }
})
