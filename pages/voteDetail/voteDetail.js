// pages/voteDetail/voteDetail.js
const app = getApp()
let videoCtx = null;
Page({
  data: {
    current: 0,
    pause: false,
    zan: false,
    shareFlag: false,
    sharePoster: false,
    supportFlag: 0,   //点赞权限
    zanFlag: false, //点赞动画
    waitingFlag: false,
    userImg: '',  //用户头像
    showImg: '', //展示图片
    code: '', //二维码
    imgs: '/images/share-bg.png', //海报背景图片
    tempImg: '',  //canvas临时路径
    item:{},  //作品详情
    shareInfo: {}   //海报信息
  },
  aniend(){
    console.log("动画播放结束")
    this.setData({
      zanFlag: false
    })
  },
  giveLike(e){
    console.log('我给你点赞', this.data.supportFlag)
    // step1 判断今天是否点赞过
    // step2  作品点赞数添加 （修改data中数据），不刷新页面
    if (this.data.supportFlag == 0) {
      //提示
      wx.showToast({
        title: "您今日已经点赞过了哦",
        icon: "none",
        duration: 1500
      })
    } else {
      console.log("点赞了")
      let work = this.data.item
      work.prise_numbers += 1;
      work.is_praise = 1;
      this.setData({
        item: work,
        supportFlag: 0,
        zanFlag: true
      })
      let params = {
        id: e.currentTarget.dataset.id,
        type: this.data.item.hoc_id
      }
      this.praiseOpus(params)
      console.log('点赞', params)
    }
  },
  praiseOpus(params) {
    app.vote.praiseOpus(params).then(res => {
      console.log('点赞成功',res)
      wx.showToast({
        title: "今日点赞成功,请明日再来",
        icon: "none",
        duration: 2500
      })
    }).catch(err => {
      console.log(err)
    })
  },
  unshare(){
    this.setData({
      sharePoster: false
    })
  },
  toVote(){
    console.log(111)
    wx.navigateTo({
      url: "/pages/vote/vote"
    })
  },
  toJoin(){
    wx.navigateTo({
      url: "/pages/voteProduction/voteProduction"
    })
  },
  changeIndex(e){
    console.log(e)
    this.setData({
      current: e.detail.current
    })
  },
  controlVideo(){
    videoCtx = wx.createVideoContext('videoWorks', this)
    if(this.data.pause){
      videoCtx.play()
      this.setData({
        pause: false
      })
    console.log("开始播放了",this.data.pause)
    }else{
      videoCtx.pause()
      this.setData({
        pause: true
      })
      console.log("暂停视频",this.data.pause)
    }
  },
  videoplay(e){ //播放时触发
    console.log("自动播放")
    this.setData({
      pause: false
    })
  },
  // videopause(e){  //暂停时触发
  //   console.log(222)
    
  // },
  getOpusInfo(id){
    let params = { id: id }
    app.vote.getOpusInfo(params).then(res=>{
      console.log(res)
      this.setData({
        item: res.data,
        supportFlag: res.data.have_praise
      })
      wx.setNavigationBarTitle({
        title: this.data.item.name
      })
      //如果是视频就自动播放
    })
  },
  getPosterInfo(ho_id) {
    let params = { ho_id: ho_id }
    let that = this;
    app.vote.getPosterInfo(params).then(res => {
      console.log("获取海报信息", res)
      wx.hideLoading()
      this.setData({
        shareFlag: false,
        sharePoster: true
      })
      this.setData({
        shareInfo: res.data
      })
      //这里需要下载对应的网络图片资源并且开始绘画canvas
      this.downloadImg(this.data.shareInfo.avatar, 'userImg');
      if (this.data.item.type == 1) {
        console.log("图片下载")
        this.downloadImg(this.data.shareInfo.opus_url, 'showImg');
      } else {
        console.log("视频封面下载")
        this.downloadImg(this.data.shareInfo.opus_banner_image, 'showImg');
      }
      console.log("二维码下载")
      this.downloadImg(this.data.shareInfo.qrcode_url, 'code');
      setTimeout(()=>{
        wx.getSystemInfo({
          success: function (res) {
            var v = 750 / res.windowWidth;  //手机比例
            console.log("获取手机比例", v)
            that.drawPoster(v)
          }
        })
      },500)
    })
  },
  shareMode(){  //弹出样式
    this.setData({
      shareFlag: true
    })
  },
  shareImg(e){ //点击生成海报
    console.log("生成海报")
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    })
    
    this.getPosterInfo(this.data.item.id);
    
  },
  savePoster() {    //保存本地
    console.log('保存到本地')
    let that = this;
    setTimeout(()=>{
      wx.saveImageToPhotosAlbum({
        filePath: that.data.tempImg,
        success(res) {
          console.log("保存成功")
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          }, 1000)
          that.shareOff() //关闭窗口
        },
        fail(err) { //授权问题报错
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"){
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    console.log("settingdata", settingdata)
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showToast({
                        title: '获取权限成功,再次点击即可保存',
                        icon: 'none'
                      }, 500)
                    } else {
                      wx.showToast({
                        title: '获取权限失败，将无法保存到相册哦~',
                        icon: 'none',
                      }, 500)
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData)
                  },
                  complete(finishData) {
                    console.log("finishData", finishData)
                  }
                })
              }
            })
          }
        }
      })
    },1000)
  },
  shareOff(){ //取消分享
    this.setData({
      shareFlag: false
    })
  },
  downloadImg(url,data){
    let that = this;
    wx.downloadFile({
      url: url,
      success: function (res) {
        switch (data) {
          case 'code':
            console.log('我是二维码：' + res.tempFilePath);
            that.setData({
              code: res.tempFilePath
            })
            break;
          case 'userImg':
            console.log('我是头像：' + res.tempFilePath);
            that.setData({
              userImg: res.tempFilePath
            })
            break;
          case 'showImg':
            console.log('我是封面：' + res.tempFilePath);
            that.setData({
              showImg: res.tempFilePath
            })
            break;
          default:
            console.log("没有下载")
            break;
        }
      }
    })
  },
  drawPoster(v){
    let that = this
    let ratio = 0.5;
    let ctx = wx.createCanvasContext('poster', this);
    ctx.drawImage(
      this.data.imgs,
      0,
      0,
      630 / v,
      812 / v
    );
    ctx.save();
    ctx.beginPath();
    //头部
    // ctx.rect(30 / v, 31 / v, 570 / v, 96 / v)
    
    ctx.save();
    // 圆的圆心的 x 坐标和 y 坐标，25 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
    ctx.arc(78 / v, 78 / v, 48 / v, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(
      this.data.userImg,
      30 / v,
      31 / v,
      96 / v,
      96 / v
    );
    ctx.restore()
    ctx.setFontSize(30 / v);
    ctx.setFillStyle('white')
    ctx.fillText(
      this.data.shareInfo.nickname,
      150 / v,
      65 / v
    )
    ctx.setFontSize(28 / v);
    ctx.setFillStyle('white')
    ctx.fillText(
      '正在参赛......',
      150 / v,
      115 / v
    )
    ctx.restore();    //恢复限制
    //分享图片
    ctx.rect(30 / v, 157 / v, 570 / v, 380 / v)

    //作品图片
    let worksImg = this.data.showImg || '/images/vote-wei.png';
    ctx.drawImage(
      worksImg,
      30 / v,
      157 / v,
      570 / v,
      380 / v
    )

    //作品名称
    ctx.setFontSize(40 / v);
    ctx.setFillStyle('white')
    ctx.fillText(
      this.data.shareInfo.opus_name,
      30 / v,
      598 / v,
      560 / v
    )
    ctx.save();
    //作品内容
    // ctx.rect(30 * ratio, 616 * ratio, 570 * ratio, 172 * ratio)

    ctx.setFontSize(36 * ratio);
    ctx.setFillStyle('white')
    console.log('长度长度长度',this.data.shareInfo.opus_content.length)
    //可以尝试切割字符串,循环数组,达到换行的效果
    let len = 0;
    for (var a = 0; a < 3; a++) {
      let content = this.data.shareInfo.opus_content.substr(len,15)
      len += 15;
      ctx.fillText(
        content,
        30 * ratio,
        (658 + a * 48) / v,
      )

    }
    ctx.restore();

    //二维码
    ctx.save();
    ctx.setFillStyle('white');
    ctx.lineJoin = "round";
    ctx.lineWidth = 20 / v;

    ctx.fillRect(0 / v, 788 / v, 630 / v, 235 / v);
    ctx.drawImage(
      this.data.code,
      30 / v,
      821 / v,
      153 / v,
      153 / v
    )
    ctx.setFontSize(36 / v);
    ctx.setFillStyle('#666666')
    ctx.fillText(
      '长按识别二维码',
      230 / v,
      886 / v
    )
    ctx.fillText(
      '为好友加油,一起参赛!',
      230 / v,
      937 / v
    )
    // ctx.setFillStyle('white');
    // ctx.fill();
    // ctx.draw();
    ctx.restore();
    let windowWidth = wx.getSystemInfoSync().windowWidth;
    console.log(windowWidth)
    ctx.draw(true, () => {
      let timer = setTimeout(()=>{
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 375,
          height: 680,
          destWidth: 375 * 750 / windowWidth,
          destHeight: 680 * 750 / windowWidth,
          canvasId: "poster",
          // fileType: 'jpg',  //如果png的话，图片存到手机可能有黑色背景部分
          success(res) {
            console.log('生成成功回调', res)
            that.setData({
              tempImg: res.tempFilePath
            })
            clearTimeout(timer)
          },
          fail: res => {
            console.log('生成失败',res)
            clearTimeout(timer)
          }
        },this);
      },100)
    });
  },
  onLoad(options) {
    // this.store.$state.userInfo
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      if (options.flag == 'true') {  //未审核
        this.setData({
          waitingFlag: options.flag
        })
      }
      this.getOpusInfo(options.voteid);
    }else{
      console.log("没有用户信息,即新用户")
    }
  },
  onShareAppMessage(ops){
    let id = this.data.item.id
    let uid = this.store.$state.userInfo.id
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '网上老年大学',
      path: '/pages/voteDetail/voteDetail?voteid=' + id + '&type=share&vote=0&uid=' + uid,  // 路径，传递参数到指定页面。
     success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onHide(){
    videoCtx = wx.createVideoContext('videoWorks', this)
    videoCtx.stop()
    this.setData({
      pause: true
    })
    videoCtx = null;
  }
})