// pages/voteProduction/voteProduction.js
import { wxp } from "../../utils/service";
var http = require("../../data/Vote.js");
import OBS from "../../OBS/OBSUploadFile.js";
Page({
  data: {
    uploadShow: '',
    disabled: false,  //禁止点击
    productionName: "",  //作品名称
    introduction: "",   //作品介绍
    select: false,
    school: "",        //学校
    addressArray: [], //学校选择分类
    addressIndex: [0,0],
    schoolArray: [], //学校选择分类
    schoolIndex: 0,
    classifyArray: [], //作品选择分类
    classifyIndex: 0,
    selectType: 1,    //当前选中类型
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
    let index = e.detail.value;
    let classifyArray = this.data.classifyArray
    this.setData({
      classifyIndex: index,
      selectType: classifyArray[index].type
    });
  },
  addressChange(e){
    let index = e.detail.value;
    this.getSchool(index[1]).then(res=>{
      this.setData({
        schoolArray: res.data,
        addressIndex: index
      })
    })
  },
  addressColumnChange(e){
    let index = e.detail.value;
    let addressArray = this.data.addressArray;
    let addressIndex = this.data.addressIndex;
    if (e.detail.column == 0){  //第一列改变
      this.getCity(addressArray[0][index].id).then(res=>{
        addressArray[1] = res.data
        addressIndex = [index,0]
        this.setData({
          addressArray: addressArray,
          addressIndex: addressIndex
        })
        this.getSchool(0).then(res => {
          this.setData({
            schoolArray: res.data
          })
        })
      })
    } else {  //第二列改变
      addressIndex[1] = index
      this.getSchool(index).then(res => {
        this.setData({
          schoolArray: res.data,
          addressIndex: addressIndex
        })
      })
    }
    
  },
  schoolChange(e){
    this.setData({
      schoolIndex: e.detail.value
    })
  },
  selectCity(){
    this.getSchool(0).then(res=>{
      this.setData({
        select: true,
        schoolArray: res.data
      })
    })
  },
  tipSchool(){
    if(!this.data.schoolArray.length){
      wx.showToast({
        title: "请先选择地区",
        icon: "none",
        duration: 1500,
        mask: false
      })
    }
  },
  getAllProvince(){  //获取省份
    let that = this;
    let addressArray = []
    return http.getAllProvince().then(res=>{
      addressArray[0] = res.data
      that.getCity(res.data[0].id).then(res=>{
        addressArray[1] = res.data
        this.setData({
          addressArray: addressArray
        })
      })
    });
  },
  getCity(province_id){
    let params = { province_id }
    return http.getCity(params);
  },
  getSchool(index){  //获取学校
    let addressArray = this.data.addressArray;
    let params = { city_id: addressArray[1][index].id }
    return http.getSchool(params);
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
        count: 9 - this.data.imgList.length,
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
    if (this.data.selectType !== 1) {
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
    } else if (!this.data.schoolArray.length){
      errTip = "学校不能为空";
    } else if (this.data.selectType == 1 && this.data.imgList.length == 0) {
      errTip = "请先上传图片";
    } else if (this.data.selectType == 2 && !this.data.video) {
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
      selectType,
      schoolArray,
      schoolIndex,
      classifyArray,
      classifyIndex,
      imgList,
      video
    } = this.data;
    let params = {
      school: schoolArray[schoolIndex].name,
      uid: this.data.$state.userInfo.id,
      name: productionName,
      content: introduction,
      type: selectType,
      hoc_id: classifyArray[classifyIndex].id,
      url: selectType == 2 ? [] : imgList,
      object_key: video || ""
    };
    this.setData({
      disabled: true
    })
    setTimeout(()=>{
      http.uploadOpus(params).then(res => {
        //上传状态
        wx.redirectTo({
          url: "/pages/voteSuccess/voteSuccess"
        });
        this.setData({
          disabled: false
        })
      });
    },1000)
  },
  unload(){
    wx.showToast({
      title: this.data.uploadShow,
      icon: "none",
      duration: 1500
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //上传作品需要加分类
    let params = { type: "classify" };
    http.getCategory(params).then(res => {
      if (res.data.is_upload){ //可以上传
        this.setData({
          uploadShow: '',
          classifyArray: res.data.data,
          selectType: res.data.data[0].type
        });
      }else{  //不能上传
        this.setData({
          uploadShow: res.data.msg
        })
      }
      
    });
    this.getAllProvince();
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
