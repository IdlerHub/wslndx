//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    gender: ["女", "男"],
    age: ["50以下", "50-60", "60-70", "70以上"]
  },
  onLoad() {
    let userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    let str = userInfo.university.split(",")
    let Univs = str.length == 3 ? str : ["", "", str[0]]
    this.setData({
      userInfo: userInfo,
      param: {
        address: userInfo.address ? userInfo.address.split(",") : ["", "", ""],
        university: Univs,
        gender: userInfo.gender,
        age: userInfo.age
      }
    })
    this.init(Univs)
  },
  init(Univs) {
    this.getProvince().then(() => {
      this.getCity(Univs[0]).then(() => {
        this.getSchool(Univs[1]).then(() => {
          let index1 = Univs[0] ? this.province.indexOf(Univs[0]) : 0
          let index2 = Univs[1] ? this.city.indexOf(Univs[1]) : 0
          let index3 = Univs[2] ? Math.max(this.school.indexOf(Univs[2]), 0) : 0
          this.setData({
            multiArray: [this.province, this.city, this.school],
            multiIndex: [index1, index2, index3]
          })
        })
      })
    })
  },
  getProvince() {
    let param = { level: 1 }
    return app.user.search(param).then(msg => {
      if (msg.code == 1) {
        this.province = msg.data
      }
    })
  },
  getCity(val) {
    let param = { level: 2, name: val || this.province[0] }
    return app.user.search(param).then(msg => {
      if (msg.code == 1) {
        this.city = msg.data
      }
    })
  },
  getSchool(val) {
    let param = { level: 3, name: val || this.city[0] }
    return app.user.search(param).then(msg => {
      if (msg.code == 1) {
        this.school = msg.data
      }
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      "param.address": e.detail.value
    })
    this.submit()
  },
  bindMultiPickerChange(e) {
    let arr = e.detail.value
    this.setData({
      "param.university": [this.province[arr[0]], this.city[arr[1]], this.school[arr[2]]]
    })
    this.submit()
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
            temp[2] = 0
            this.setData({
              "multiArray[1]": this.city,
              "multiArray[2]": this.school,
              multiIndex: temp
            })
          })
        })
        break
      case 1:
        this.getSchool(this.city[val]).then(() => {
          temp[2] = 0
          this.setData({
            "multiArray[2]": this.school,
            multiIndex: temp
          })
        })
        break
    }
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
  submit() {
    let param = {
      address: this.data.param.address.join(","),
      gender: this.data.param.gender,
      university: this.data.param.university[2],
      age: this.data.param.age
    }
    app.user.profile(param).then(msg => {
      if (msg.code == 1) {
        app.setUser(msg.data.userInfo)
      }
    })
  },
  //用于数据统计
  onHide() {
    app.aldstat.sendEvent("退出", { name: "完善资料页" })
  }
})
