// pages/infoAddress/infoAddress.js
const app = getApp()
Page({
  data: {
    userInfo:{},
    param:{},
    newFlag: 0,
    address: [],
    addressId: []
  },

  onLoad: function () {
    
    this.init()
  },
  init() {
    let userInfo = JSON.parse(wx.getStorageSync("userAddress"))
    console.log(userInfo)
    //获取省市区,如果不是第一次进来的话,需要定位,否则默认即可
    let cascade = [userInfo.province_id, userInfo.city_id, userInfo.area_id] || ["", "", ""]
    console.log("data的userInfo", this.data.userInfo)
    console.log('城市列表', cascade)
    this.getProvince().then(() => {
      this.getCity(cascade[0]).then(() => {
        this.getArea(cascade[1]).then(() => {
          let index1 = cascade[0] ? this.provinceId.indexOf(cascade[0]) : 0;    //查找下标,找到直接赋值
          let index2 = cascade[1] ? this.cityId.indexOf(cascade[1]) : 0;
          let index3 = cascade[2] ? this.areaId.indexOf(cascade[2]) : 0;
          this.setData({
            userInfo: userInfo,
            multiAddress: [this.province, this.city, this.area],
            multiIndex: [index1, index2, index3],
            address: cascade[0] ? [this.province[index1], this.city[index2], this.area[index3]] : [],
            addressId: cascade
          })
        })
      })
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
    let param = { level: 1 }
    return app.user.getAreainfo(param).then(res => {
      let data = this.getKV(res.data)
      this.province = data.names
      this.provinceId = data.ids
    })
  },
  getCity(val) {  //获取市级
    let param = { level: 2, area_id: val || this.provinceId[0] }
    return app.user.getAreainfo(param).then(res => {
      let data = this.getKV(res.data)
      this.city = data.names
      this.cityId = data.ids
    })
  },
  getArea(val) {  //获取区级
    let param = { level: 3, area_id: val || this.cityId[0] }
    return app.user.getAreainfo(param).then(res => {
      let data = this.getKV(res.data)
      this.area = data.names
      this.areaId = data.ids
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
  changeColumn(e) {
    console.log("列改变", e)
    let multiAddress = this.data.multiAddress;
    let multiIndex = this.data.multiIndex;
    //下面id无用,就用这个注释
    // let multiAddressId = this.data.multiAddressId;
    let index = e.detail.value; //改变至某个下标
    let column = e.detail.column; //哪一列改变
    if (column == 0) {  //省改变
      this.getCity(this.provinceId[index]).then(() => {
        this.getArea(this.cityId[0]).then(() => {
          multiAddress[1] = this.city;
          multiAddress[2] = this.area;
          this.setData({
            multiAddress: multiAddress,
            multiIndex: [index, 0, 0],
          })
        })
      })
    } else if (column == 1) {  //市改变
      this.getArea(this.cityId[index]).then(() => {
        multiAddress[2] = this.area;
        multiIndex[1] = index;  //市列下标改变,省列下标不变
        multiIndex[2] = 0;
        this.setData({
          multiAddress: multiAddress,
          multiIndex: multiIndex
        })
      })
    }
  },
  changeArea(e) {
    console.log("确定选择", e)
    let value = e.detail.value;
    // this.provinceId[index[0]]  省级id
    this.setData({
      address: [this.province[value[0]], this.city[value[1]], this.area[value[2]]],
      addressId: [this.provinceId[value[0]], this.cityId[value[1]], this.areaId[value[2]]]
    })
  },
  putGoodsaddress() {
    let userInfo = this.data.userInfo;
    console.log("chengshi9",this.data.addressId)
    let param = {
      goods_address_id: userInfo.goods_address_id,
      username: userInfo.username,
      mobile: userInfo.mobile,
      province_id: this.data.addressId[0] || 0,
      city_id: this.data.addressId[1] || 0,
      area_id: this.data.addressId[2] || 0,
      address: userInfo.address || ''
    }
    app.user.putGoodsaddress(param).then(res=>{
      wx.setStorageSync("userAddress", JSON.stringify(param))
      wx.navigateBack();
    })
  },
  confirm(){
    let errTip = '';
    let that = this;
    console.log(this.data.userInfo.username)
    if (!this.data.userInfo.username) {
      errTip = '收货人不能为空';
    } else if (!this.data.userInfo.mobile) {
      errTip = '手机号不能为空';
    } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(this.data.userInfo.username)) {
      errTip = "请输入合法的姓名(仅支持数字/汉字/字母)"
    } else if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.data.userInfo.mobile)) {
      errTip = "手机号格式错误"
    }
    if (errTip) {
      wx.showToast({
        title: errTip,
        icon: "none",
        duration: 1500
      })
      return
    }
    that.putGoodsaddress()
  }
})