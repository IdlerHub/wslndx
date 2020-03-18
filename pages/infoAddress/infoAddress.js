// pages/infoAddress/infoAddress.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    param:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    console.log(ops)
    // if (ops.type = "first") {//第一次补充信息,使用用户信息默认填充
    //   let userInfo = JSON.parse(JSON.stringify(this.data.$state.userInfo))
    //   this.setData({
    //     userInfo: userInfo,
    //     param: {
    //       address: userInfo.address || ["", ""]
    //     }
    //   })
    //   console.log(userInfo)
    // } else {//获取用户填过信息
    //   this.getGoodsAddress()
    // }
    
    // this.init()
  },
  init() {
    //获取省市区,如果不是第一次进来的话,需要定位,否则默认即可
    // let cascade = this.data.userInfo.university.split(",") || ["", ""]
    this.getProvince().then(() => {
      this.getCity(cascade[0]).then(() => {
        this.getSchool(cascade[1]).then(() => {
          let index1 = cascade[0] ? this.province.indexOf(cascade[0]) : 0;    //查找下标,找到直接赋值
          let index2 = cascade[1] ? this.city.indexOf(cascade[1]) : 0
          let index3 = cascade[2] ? this.area.indexOf(cascade[2]) : 0
          this.setData({
            multiAddress: [this.province, this.city,this.area],
            multiIndex: [index1, index2,index3],
          })
        })
      })
    })
  },
  getProvince() { //获取省级
    let param = { level: 1 }
    return app.user.getAreainfo(param).then(res => {
      this.province = res.data
    })
  },
  getCity(val) {  //获取市级
    let param = { level: 2, name: val || this.province[0] }
    return app.user.getAreainfo(param).then(res => {
      this.city = res.data
    })
  },
  getArea(val) {  //获取区级
    let param = { level: 3, name: val || this.city[0] }
    return app.user.getAreainfo(param).then(res => {
      this.area = res.data
    })
  },
  getGoodsAddress(){  //获取收货地址信息 传uid
    return app.user.getGoodsAddress().then(res => {
      this.setData({
        userInfo: res.data
      })
    })
  }
})