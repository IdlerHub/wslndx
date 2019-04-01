//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    IMG_URL: app.IMG_URL,
    gender: ['女','男'],
    age: [
      "50以下",
      "50-60",
      "60-70",
      "70以上"
    ],
  },
  onLoad(options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo,
      param: {
        address: userInfo.address ? userInfo.address.split(',') : ['', '', ''],
        university: ['','',userInfo.university],
        gender: userInfo.gender,
        age: userInfo.age,
      }
    })
    this.param=this.data.param.university;
    this.getProvince();
  },
  getProvince() {
    var that = this;
    var param = { level:1 }
    app.user.search(param, function (msg) {
      if (msg.code == 1) {
        that.province = msg.data;
        that.getCity()
      }
    }, function () { })
  },
  getCity(val) {
    var that = this;
    var param = { level: 2, name: val ? val : this.province[0]}
    app.user.search(param,function (msg) {
      if (msg.code == 1) {
        that.city=msg.data,
        that.getSchool()
      }
    }, function () { })
  },
  getSchool(val) {
    var that = this;
    var param = { level: 3, name: val ? val : this.city[0] }
    app.user.search(param, function (msg) {
      if (msg.code == 1) {
        that.school=msg.data,
          that.param[2] = that.school ? that.school[0]:'';
        that.setData({
          multiArray: [that.province, that.city, that.school]
        })
      }
    }, function () { })
  },
  bindRegionChange: function (e) {
    this.setData({
      'param.address': e.detail.value
    })
    this.submit();
  },
  bindMultiPickerChange(e) {
    this.setData({
      'param.university': this.param[2] ? this.param : [this.province[0], this.city[0], this.school[0]]
    })
    this.submit();
  },
  bindMultiPickerColumnChange(e) {
    var that = this;
    var param=this.param;
    param[e.detail.column] = this.data.multiArray[e.detail.column][e.detail.value];
    switch (e.detail.column){
      case 0:
        that.getCity(param[e.detail.column])
        break
      case 1:
        that.getSchool(param[e.detail.column])
        break
    }
  },
  bindSexChange(e) {
    this.setData({
      'param.gender': e.detail.value
    })
    this.submit();
  },
  bindAgeChange(e){
    this.setData({
      'param.age': this.data.age[e.detail.value]
    })
    this.submit();
  },
  // back(){
  //   wx.navigateBack()
  // },
  submit() {
    var that = this;
    var param = {
      address: this.data.param.address,
      gender: this.data.param.gender,
      university: this.data.param.university,
      age: this.data.param.age,
    };
    param.address = param.address.join(',');
    param.gender = (param.gender=="男"?1:0);
    param.university = param.university[2];
    app.user.profile(param, function (msg) {
      if (msg.code == 1) {
        wx.setStorageSync('userInfo', msg.data.userInfo)
      }
    }, function () { })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent('退出', { "name": "完善资料页" })
  }
})
