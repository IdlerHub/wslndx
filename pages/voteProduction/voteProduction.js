// pages/voteProduction/voteProduction.js
import { wxp } from "../../utils/service";
var http = require("../../data/Vote.js");
import OBS from "../../OBS/OBSUploadFile.js";

Page({
  data: {
    productionName: "", //作品名称
    introduction: "", //作品介绍
    classifyArray: [], //作品选择分类
    classifyIndex: 0,
    modality: ["图片", "视频"],
    modalityIndex: 0,
    imgList: [],
    video: ""
  },
  changeName(e) {
    this.setData({
      productionName: e.detail.value.trim()
    });
  },
  changeIntroduction(e) {
    this.setData({
      introduction: e.detail.value.trim()
    });
  },
  classifyChange(e) {
    // 修改分类
    this.setData({
      classifyIndex: e.detail.value
    });
  },
  changeModality(e) {
    // 图片 || 视频
    this.setData({
      modalityIndex: e.currentTarget.dataset.index
    });
  },
  uploadVideo() {
    //上传视频
    wxp
      .chooseVideo({
        sourceType: ["album", "camera"],
        maxDuration: 60,
        camera: "back",
        compressed: true
      })
      .then(res => {
        if (res.duration > 60) {
          wx.showToast({
            icon: "none",
            title: "视频长度大于60s",
            duration: 1500
          });
        } else if (res.size > 200 * 1024 * 1024) {
          wx.showToast({
            icon: "none",
            title: "视频大于200M",
            duration: 1500
          });
        } else {
          this.obsUpload(res.tempFilePath);
        }
      });
  },
  delVideo() {
    //删除视频
    this.setData({
      video: ""
    });
  },
  uploadImg() {
    //上传图片
    wxp
      .chooseImage({
        count: 6 - this.data.imgList.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"]
      })
      .then(res => {
        this.obsUpload(res.tempFilePaths);
      });
  },
  obsUpload(medias) {
    wx.showLoading({
      title: "作品正在上传",
      mask: true
    });
    if (this.data.modalityIndex) {
      //视频
      OBS("ballot/video", medias, "video")
        .then(res => {
          if (res) {
            this.setData({
              video: res
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
      //图片
      let reqs = [];
      medias.forEach(media => {
        reqs.push(OBS("ballot/img", media, "image"));
      });
      Promise.all(reqs)
        .then(res => {
          if (res[0]) {
            this.setData({
              imgList: this.data.imgList.concat(res)
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
    }
  },
  delImg(e) {
    //删除图片
    let pics = this.data.imgList;
    pics.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: pics
    });
  },
  preview(e) {
    let images = this.data.imgList;
    wx.previewImage({
      current: images[e.currentTarget.dataset.index],
      urls: images
    });
  },
  submitProduction() {
    //提交作品
    let errTip;
    if (!this.data.productionName) {
      errTip = "作品名称不能为空";
    } else if (!this.data.introduction) {
      errTip = "作品介绍不能为空";
    } else if (this.data.modalityIndex == 0 && this.data.imgList.length == 0) {
      errTip = "请选上传图片";
    } else if (this.data.modalityIndex == 1 && !this.data.video) {
      errTip = "请先上传视频";
    }

    if (errTip) {
      wx.showToast({
        icon: "none",
        title: errTip,
        duration: 1500
      });
      return;
    }

    let {
      productionName,
      introduction,
      modalityIndex,
      classifyArray,
      classifyIndex,
      imgList,
      video
    } = this.data;

    let params = {
      uid: this.data.$state.userInfo.id,
      name: productionName,
      content: introduction,
      type: modalityIndex + 1,
      hoc_id: classifyArray[classifyIndex].id,
      url: modalityIndex ? [] : imgList,
      object_key: video || ""
    };

    http.uploadOpus(params).then(res => { //上传状态
      wx.redirectTo({
        url: "/pages/voteSuccess/voteSuccess"
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //上传作品需要加分类
    let params = { type: "classify" };
    http.getCategory(params).then(res => {
      this.setData({
        classifyArray: res.data
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {}
});
