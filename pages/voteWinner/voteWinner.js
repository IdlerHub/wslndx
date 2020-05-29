/*
 * @Github: https://github.com/IdlerHub
 * @Author: zxk
 * @Date: 2020-05-13 12:42:53
 * @LastEditors: zxk
 * @LastEditTime: 2020-05-29 11:15:36
 */ 
// pages/voteWinner/voteWinner.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankType: 0, //默认显示的标签
    topTitle1: ["排名","学校","投票总数"],  //表头
    topTitle2: ["排名","学校","作品数"],
    rankLeft1: [], //排名列表1
    rankLeft2: [], //排名列表2
    rankRight: [],  //个人奖
    categoryIndex: 0,
    category:[],  //分类
    showCertificate: false, //展示奖状
    author: '', //搜索用户名
    opus: '',   //搜索作品编号
    userInfo: {}, //作品获奖信息，微信分享的图片
    imgs: '/images/certificate-vote.png',   //奖状背景图
    tempImg: '' //临时路径
  },
  pageName: '赛事活动获奖排行',
  getCategory() {
    //获取分类数据
    app.vote.getCategory().then(res => {
      this.getPrize(res.data.data[0].id)
      this.setData({
        category: res.data.data,
      })
    });
  },
  getPrize(id){
    let params = {
      type: 2,
      hoc_id: id
    }
    app.vote.getPrize(params)//获取个人作品奖
    .then(data=>{
      this.setData({
        rankRight: data.data
      });
    })
    .catch(err=>{
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    })
  },
  checkTop(e) { //切换顶部标签
    this.setData({
      rankType: e.currentTarget.dataset.type,
      scollTop: 0
    })
  },
  openRule(){
    wx.navigateTo({
      url: "/pages/voteRule/voteRule"
    });
  },
  classifyChange(e){  //切换分类
    let index = e.detail.value;
    let id = this.data.category[index].id
    this.setData({
      categoryIndex: index
    })
    this.getPrize(id)
  },
  changeAuthor(e){
    this.setData({
      author: e.detail.value.trim()
    });
  },
  changeOpus(e){
    this.setData({
      opus: e.detail.value.trim()
    });
  },
  closeCertificate(){
    this.setData({
      showCertificate: false
    })
  },
  searchCertificate(){
    console.log(111)
    let params = {
      author: this.data.author,
      opus: this.data.opus
    }
    if(!params.author){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中'
    })
    app.vote.searchCertificate(params)
    .then(res=>{
      wx.hideLoading()
      this.setData({
        userInfo: res.data,
        showCertificate: true
      })
      this.downloadImg()
    })
    .catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    })
  },
  drawCertificate(v,info) {  //绘制奖状
    console.log(this.data.imgs)
    let that = this;
    const ctx = wx.createCanvasContext("certificate", this);
    //背景图
    ctx.drawImage(this.data.imgs, 0, 0, 630 / v, 1000 / v);
    ctx.save(); 
    //开始路径
    ctx.setFontSize(18);
    ctx.setFillStyle("#333333");
    ctx.setTextAlign('center')
    //TODO: 截取，最长四个字
    if(info.author.length > 5){
      info.author = info.author.substr(0,5)
    }
    ctx.fillText(info.author, 182/v, 355/v, 200 / v);
    ctx.setFontSize(18);
    ctx.setTextAlign('center')
    ctx.fillText(info.opus, 288 / v, 458 / v);
    ctx.setFontSize(18);
    ctx.setFillStyle("#FF0000");
    ctx.setTextAlign('center')
    ctx.fillText(info.honor, 408 / v, 638 / v);
    // let windowWidth = wx.getSystemInfoSync().windowWidth;
    let width = 630/v;
    let height = 1000/v;
    ctx.draw(true, () => {
      console.log('正在绘制')
      let timer = setTimeout(() => {
        wx.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: width * 3,
            destHeight: height * 3,
            canvasId: "certificate",
            // fileType: 'jpg',  //如果png的话，图片存到手机可能有黑色背景部分
            success(res) {
              //生成成功
              that.setData({
                tempImg: res.tempFilePath
              });
              clearTimeout(timer);
            },
            fail: res => {
              //生成失败
              clearTimeout(timer);
            }
          },
          this
        );
      }, 100);
    });
  },
  downloadImg(){  //先下载背景图，下载成功后开始绘画
    let that = this;
    wx.downloadFile({
      url: that.data.$state.imgHost +'/diploma.png',
      success:res=>{
        this.setData({
          imgs: res.tempFilePath
        })
        console.log(that.data.$state.imgHost + '/diploma.png')
        wx.getSystemInfo({
          success: function (res) {
            var v = 750 / res.windowWidth; //获取手机比例
            that.drawCertificate(v,that.data.userInfo);
          }
        })
      }
    })
  },
  saveCertificate() {
    //保存本地
    let that = this;
    setTimeout(() => {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.tempImg,
        success(res) {
          wx.showToast(
            {
              title: "保存成功",
              icon: "success"
            },
            1000
          );
          that.closeCertificate()
        },
        fail(err) {
          //授权问题报错
          if (
            err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" ||
            err.errMsg === "saveImageToPhotosAlbum:fail auth deny" ||
            err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"
          ) {
            wx.showModal({
              title: "提示",
              content: "需要您授权保存相册",
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    //授权状态
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      wx.showToast(
                        {
                          title: "获取权限成功,再次点击即可保存",
                          icon: "none"
                        },
                        500
                      );
                    } else {
                      wx.showToast(
                        {
                          title: "获取权限失败，将无法保存到相册哦~",
                          icon: "none"
                        },
                        500
                      );
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData);
                  }
                });
              }
            });
          }
        }
      });
    }, 500);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.vote.getPrize()//默认type=1,获取优秀组织奖
    .then(res=>{
      this.setData({
        rankLeft1: res.data.praise_numbers,
        rankLeft2: res.data.opus_numbers
      })
    }) 
    this.getCategory();
    if (options.rankType == 2){
      //展示证书
      this.setData({
        rankType: 2,
        author: options.author,
        opus: options.opus
      })
      this.searchCertificate()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // let title = this.data.title;
    if(this.data.rankType == 2 && this.data.showCertificate){
      console.log()
      return {
        title: "抗疫在线，荣誉有你",
        path: `pages/voteWinner/voteWinner?rankType=2&author=${this.data.userInfo.author}&opus=${this.data.userInfo.opus}`,
        imageUrl: this.data.userInfo.share_image,
      }
    }else{
      return {
        title: "“同心抗疫”活动获奖名单出炉了，大家快来看看！",
        path: `pages/voteWinner/voteWinner`,
      }
    }
    
  }
})