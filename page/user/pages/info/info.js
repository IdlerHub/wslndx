/*
 * @Date: 2019-05-28 09:50:08
 * @LastEditors: hxz
 * @LastEditTime: 2019-08-12 18:22:52
 */
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    gender: ["女", "男"],
    age: ["50以下", "50-60", "60-70", "70以上"],
    padding: false,
    showintegral: false,
    userAddress: {},
  },
  pageName: '修改资料（完善资料）',
  onLoad() {
    let userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    this.setData({
      userInfo: userInfo,
      param: {
        address: userInfo.address || ["", ""],
        school: userInfo.school || "",
        gender: userInfo.gender,
        age: userInfo.age
      }
    })
    this.init()
  },
  init() {
    let cascade = this.data.userInfo.university.split(",") || ["", "", ""]
    this.getGoodsAddress()
    this.getProvince().then(() => {
      this.getCity(cascade[0]).then(() => {
        this.getSchool(cascade[1]).then(() => {
          let index1 = cascade[0] ? this.province.indexOf(cascade[0]) : 0
          let index2 = cascade[1] ? this.city.indexOf(cascade[1]) : 0
          let index3 = cascade[2] ? Math.max(this.school.indexOf(cascade[2]), 0) : 0
          this.setData({
            multiAddress: [this.province, this.city],
            multiIndex: [index1, index2],
            singleSchool: this.school,
            singleIndex: index3
          })
        })
      })
    })
  },
  getProvince() {
    let param = { level: 1 }
    return app.user.search(param).then(msg => {
      this.province = msg.data
    })
  },
  getCity(val) {
    let param = { level: 2, name: val || this.province[0] }
    return app.user.search(param).then(msg => {
      this.city = msg.data
    })
  },
  getSchool(val) {
    let param = { level: 3, name: val || this.city[0] }
    return app.user.search(param).then(msg => {
      this.school = msg.data
    })
  },
  getGoodsAddress() {  //获取收货地址信息
    return app.user.getGoodsAddress().then(res => {
      wx.setStorageSync("userAddress", JSON.stringify(res.data))
      res.data.email.length > 0 ? this.is_show = true : ''
      this.setData({
        userAddress: res.data
      })
    })
  },
  bindMultiPickerColumnChange(e) {
    let temp = this.data.multiIndex
    let col = e.detail.column
    let val = e.detail.value
    temp[col] = val
    switch (col) {
      case 0:
        this.getCity(this.province[val]).then(() => {
          this.getSchool().then(() => {
            temp[1] = 0
            this.setData({
              "multiAddress[1]": this.city,
              multiIndex: temp,
              singleSchool: this.school,
              singleIndex: 0
            })
          })
        })
        break
      case 1:
        this.getSchool(this.city[val]).then(() => {
          this.setData({
            singleSchool: this.school,
            singleIndex: 0
          })
        })
        break
    }
  },
  bindMultiPickerChange(e) {
    let arr = e.detail.value
    this.setData({
      "param.address": [this.province[arr[0]], this.city[arr[1]]]
    })
  },
  tipOrder() {
    if (!this.data.param.address[1]) {
      wx.showToast({
        title: "请先选择地区",
        icon: "none",
        duration: 1500,
        mask: false
      })
    }
  },
  bindSchool(e) {
    let index = e.detail.value
    this.setData({
      "param.school": this.school[index]
    })
    this.submit()
  },
  bindSexChange(e) {
    this.setData({
      "param.gender": e.detail.value
    })
    this.submit()
  },
  bindAgeChange(e) {
    this.setData({
      "param.age": this.data.age[e.detail.value]
    })
    this.submit()
  },
  setUserinfo(param) {
    app.user.profile(param).then(msg => {
      if (msg.data.is_first == 'first') {
        this.setData({
          showintegral: true
        })
        setTimeout(() => {
          this.setData({
            showintegral: false
          })
        }, 2000)
      }
      app.setUser(msg.data.userInfo)
    })
  },
  submit() {
    let param = {}
    this.data.param.address.length > 0 ? param = {
      address: '',
      gender: +this.data.param.gender,
      university: this.data.param.school,
      age: this.data.param.age
    } : param = {
      address: this.data.param.address.join(","),
      gender: +this.data.param.gender,
      university: this.data.param.school,
      age: this.data.param.age
    }
    this.setUserinfo(param)
  },
  upUsername(e) {
    if (e.detail.value.trim() != '') {
      let param = {
        name: e.detail.value
      }
      this.setUserinfo(param)
    }
  },
  upEmail(e) {
    if (e.detail.value.trim() != '') {
      let param = {
        email: e.detail.value
      }
      if(!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(e.detail.value)) {
        wx.showToast({
          title: '电子邮箱格式不正确',
          icon: "none",
          duration: 1500
        })
        return
      }
      app.user.putEmail(param)
    }
  },
  focus() {
    this.setData({
      padding: true
    })
  },
  fill(){
    this.getGoodsAddress().then(()=>{
      wx.navigateTo({
        url: "/pages/infoAddress/infoAddress"
      })
    });
  },
  //用于数据统计
  onHide() {
  },
})
