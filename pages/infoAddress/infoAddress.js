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
    this.getGoodsAddress();
    this.init()
  },
  init() {
    //获取省市区,如果不是第一次进来的话,需要定位,否则默认即可
    let userInfo = this.data.userInfo;
    let cascade = [userInfo.province_id, userInfo.city_id, userInfo.area_id]   || ["", ""]
    console.log('城市列表',cascade)
    // this.getProvince().then(() => {
    //   this.getCity(cascade[0]).then(() => {
    //     this.getArea(cascade[1]).then(() => {
    //       let index1 = cascade[0] ? this.provinceId.indexOf(cascade[0]) : 0;    //查找下标,找到直接赋值
    //       let index2 = cascade[1] ? this.cityId.indexOf(cascade[1]) : 0;
    //       let index3 = cascade[2] ? this.areaId.indexOf(cascade[2]) : 0;
    //       console.log(1111,index1,index2,index3)
    //       this.setData({
    //         multiAddress: [this.province, this.city,this.area],
    //         multiIndex: [index1, index2,index3],
    //       })
    //     })
    //   })
    // })
    this.getProvince();
    this.getCity();
    this.getArea();
    let index1 = cascade[0] ? this.provinceId.indexOf(cascade[0]) : 0;    //查找下标,找到直接赋值
    let index2 = cascade[1] ? this.cityId.indexOf(cascade[1]) : 0;
    let index3 = cascade[2] ? this.areaId.indexOf(cascade[2]) : 0;
    console.log(1111, index1, index2, index3)
    this.setData({
      multiAddress: [this.province, this.city,this.area],
      multiIndex: [index1, index2,index3],
    })
  },
  getKV(arr){
    let ids = []
    let names = []
    arr.forEach(item => {
      ids.push(item['id'])
      names.push(item['name'])
    })
    return {ids, names}
  },
  getProvince() { //获取省级
    // let param = { level: 1 }
    // return app.user.getAreainfo(param).then(res => {
    //   this.province = res.data
    // })
    let res = {
      "code": 1,
      "msg": "获取成功",
      "time": "1584522451",
      "data": [
        {
          "id": 2,
          "name": "南昌"
        },
        {
          "id": 54,
          "name": "抚州"
        },
        {
          "id": 235,
          "name": "赣州"
        },
        {
          "id": 0,
          "name": "吉安"
        },
        {
          "id": 237,
          "name": "景德镇"
        },
        {
          "id": 238,
          "name": "九江"
        },
        {
          "id": 239,
          "name": "萍乡"
        },
        {
          "id": 240,
          "name": "上饶"
        },
        {
          "id": 241,
          "name": "新余"
        },
        {
          "id": 242,
          "name": "宜春"
        },
        {
          "id": 243,
          "name": "鹰潭"
        }
      ]
    }
    let data = this.getKV(res.data)
    this.province = data.names
    this.provinceId = data.ids
  },
  getCity(val) {  //获取市级
    // let param = { level: 2, province_id: val || this.province[0] }
    // return app.user.getAreainfo(param).then(res => {
    //   this.city = res.data
    // })
    let res = {
      "code": 1,
      "msg": "获取成功",
      "time": "1584522451",
      "data": [
        {
          "id": 2,
          "name": "南昌"
        },
        {
          "id": 54,
          "name": "抚州"
        },
        {
          "id": 235,
          "name": "赣州"
        },
        {
          "id": 0,
          "name": "吉安"
        },
        {
          "id": 237,
          "name": "景德镇"
        },
        {
          "id": 238,
          "name": "九江"
        },
        {
          "id": 239,
          "name": "萍乡"
        },
        {
          "id": 240,
          "name": "上饶"
        },
        {
          "id": 241,
          "name": "新余"
        },
        {
          "id": 242,
          "name": "宜春"
        },
        {
          "id": 243,
          "name": "鹰潭"
        }
      ]
    }
    let data = this.getKV(res.data)
    this.city = data.names
    this.cityId = data.ids
  },
  getArea(val) {  //获取区级
    // let param = { level: 3, area_id: val || this.city[0] }
    // return app.user.getAreainfo(param).then(res => {
    //   this.area = res.data
    // })
    let res = {
      "code": 1,
      "msg": "获取成功",
      "time": "1584522451",
      "data": [
        {
          "id": 2,
          "name": "南昌"
        },
        {
          "id": 54,
          "name": "抚州"
        },
        {
          "id": 235,
          "name": "赣州"
        },
        {
          "id": 0,
          "name": "吉安"
        },
        {
          "id": 237,
          "name": "景德镇"
        },
        {
          "id": 238,
          "name": "九江"
        },
        {
          "id": 239,
          "name": "萍乡"
        },
        {
          "id": 240,
          "name": "上饶"
        },
        {
          "id": 241,
          "name": "新余"
        },
        {
          "id": 242,
          "name": "宜春"
        },
        {
          "id": 243,
          "name": "鹰潭"
        }
      ]
    }
    let data = this.getKV(res.data)
    this.area = data.names
    this.areaId = data.ids
  },
  getGoodsAddress(){  //获取收货地址信息 传uid
    // return app.user.getGoodsAddress().then(res => {
    //   this.setData({
    //     userInfo: res.data
    //   })
    // })
    let res = {
      "code": 1,
      "msg": "获取成功",
      "time": "1584521545",
      "data": {
        "id": 1,
        "username": "张三",
        "mobile": "18370669679",
        "province_id": 2,
        "city_id": 54,
        "area_id": 0,
        "address": "asdfadasfa"
      }
    }
    this.setData({
      userInfo: res.data
    })
  },
  changeName(e) {
    let userInfo = this.data.userInfo;
    userInfo['username'] = e.detail.value.trim();
    this.setData({
      userInfo: userInfo
    })
  },
  changeMobile(e) {
    let userInfo = this.data.userInfo;
    userInfo.mobile = e.detail.value.trim();
    this.setData({
      userInfo: userInfo
    })
  },
  changeAddress(e) {
    let userInfo = this.data.userInfo;
    userInfo['address'] = e.detail.value;
    this.setData({
      userInfo: userInfo
    })
  },
  confirm(){
    let errTip = ''
    console.log(this.data.userInfo.username)
    if (!this.data.userInfo.username) {
      errTip = '收货人不能为空';
    } else if (!this.data.userInfo.mobile) {
      errTip = '收货人不能为空';
    } else if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.data.userInfo.mobile)) {
      errTip = "手机号格式错误"
    } else if (!this.data.userInfo.address) {
      errTip = "请输入详细地址"
    }
    if (errTip) {
      wx.showToast({
        title: errTip,
        icon: "none",
        duration: 1500
      })
      return
    }
    //保存地址信息请求
  }
})