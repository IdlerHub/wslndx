// components/address/address.js
const app = getApp()
Component({
  properties: {
    giftInfo:{
      type: Object,
      value: {}
    },
    showCard: {
      type: Boolean,
      value: false
    },
    type: {
      type: Number,
      value: 2
    }
  },
  observers:{
    showCard(){
      if (this.data.showCard) {
        this.getGoodsAddress().then(() => {
          this.init()
        })
      }
    }
  },
  data: {
    userInfo:{},
    address: [],
    addressId: [],
    is_email: false
  },

  methods: {
    unMove(){//禁止穿透滑动
      return
    },
    init() {
      //获取省市区,如果不是第一次进来的话,需要定位,否则默认即可
      let userInfo = this.data.userInfo;
      let cascade = [userInfo.province_id, userInfo.city_id, userInfo.area_id] || ["", "", ""]
      this.getProvince().then(() => {
        this.getCity(cascade[0]).then(() => {
          this.getArea(cascade[1]).then(() => {
            let index1 = cascade[0] ? this.provinceId.indexOf(cascade[0]) : 0;    //查找下标,找到直接赋值
            let index2 = cascade[1] ? this.cityId.indexOf(cascade[1]) : 0;
            let index3 = cascade[2] ? this.areaId.indexOf(cascade[2]) : 0;
            this.setData({
              multiAddress: [this.province, this.city, this.area],
              multiIndex: [index1, index2, index3],
              address: cascade[0]? [this.province[index1], this.city[index2], this.area[index3]]: []
            })
          })
        })
      })
    },
    getKV(arr) {
      let ids = []
      let names = []
      arr.forEach(item => {
        ids.push(item['id'])
        names.push(item['name'])
      })
      return { ids, names }
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
    getGoodsAddress() {  //获取收货地址信息 传uid
      return app.user.getGoodsAddress().then(res => {
        let addressId = [res.data.province_id, res.data.city_id, res.data.area_id]
        this.setData({
          userInfo: res.data,
          addressId: addressId,
          is_email: res.data.email.length > 0 ? false : true
        })
      })
    },
    putGoodsaddress(){
      let userInfo = this.data.userInfo;
      let param = {
        goods_address_id: userInfo.goods_address_id,
        username: userInfo.username,
        mobile: userInfo.mobile,
        province_id: this.data.addressId[0] || 0,
        city_id: this.data.addressId[1] || 0,
        area_id: this.data.addressId[2] || 0,
        address: userInfo.address || ''
      }
      return app.user.putGoodsaddress(param).then(res=>{
        console.log("提交成功",res)
      })
    },
    changeName(e){
      let userInfo = this.data.userInfo;
      userInfo['username'] = e.detail.value.trim();
      this.setData({
        userInfo: userInfo
      })
    },
    changeEmail(e) {
      let userInfo = this.data.userInfo;
      userInfo['email'] = e.detail.value.trim();
      this.setData({
        userInfo: userInfo
      })
    },
    changeMobile(e){
      let userInfo = this.data.userInfo;
      userInfo.mobile = e.detail.value.trim();
      this.setData({
        userInfo: userInfo
      })
    },
    changeAddress(e){
      let userInfo = this.data.userInfo;
      userInfo['address'] = e.detail.value;
      this.setData({
        userInfo: userInfo
      })
    },
    changeColumn(e){
      let multiAddress = this.data.multiAddress;
      let multiIndex = this.data.multiIndex;
      //下面id无用,就用这个注释
      // let multiAddressId = this.data.multiAddressId;
      let index = e.detail.value; //改变至某个下标
      let column = e.detail.column; //哪一列改变
      if(column == 0){  //省改变
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
      } else if (column == 1){  //市改变
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
    changeArea(e){
      let value = e.detail.value;
      this.setData({
        address: [this.province[value[0]], this.city[value[1]], this.area[value[2]]],
        addressId: [this.provinceId[value[0]], this.cityId[value[1]], this.areaId[value[2]]]
      })
    },
    cancel(){
      let that = this;
      wx.showModal({
        content: '取消后将无法兑换到商品，是否继续填写信息？',
        cancelColor: '#666',
        confirmText: "继续填写",
        confirmColor: "#DF2020",
        success(res) {
          if (res.cancel) {
            wx.showToast({
              title: '您已取消兑换',
              icon: "none",
              duration: 1500
            })
            that.setData({
              showCard: false
            })
          }
        }
      })
    },
    confirm(){
      let errTip = '';
      let that = this;
      let userInfo = this.data.userInfo, giftInfo = this.data.giftInfo;
      if(!userInfo.username){
        errTip = '收货人不能为空';
      }else if(!userInfo.mobile){
        errTip = '手机号不能为空';
      } else if (!/^[\u4e00-\u9fa5·\s_a-zA-Z0-9]+$/.test(userInfo.username)) {
        errTip = "请输入合法的姓名(仅支持数字/汉字/字母)"
      } else if (!/^1[3|4|5|6|7|8|9]\d{9}$/.test(userInfo.mobile)){
        errTip="手机号格式错误"
      } else if(!userInfo.email && giftInfo.receive_type == 1) {
        errTip = '电子邮箱不能为空';
      } else if(!/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/.test(userInfo.email) && giftInfo.receive_type == 1) {
        errTip = '电子邮箱格式不正确';
      }
      if(errTip){
        wx.showToast({
          title: errTip,
          icon: "none",
          duration: 1500
        })
        return
      }
      let address = that.data.address;  //拼接省市区地址
      
      let param = {
        receive_type: giftInfo.receive_type,
        get_type: 1,
        goods_user: userInfo.username,
        goods_mobile: userInfo.mobile,
        goods_address: address[0] + address[1] + address[2] + userInfo.address,
        goods_email: userInfo.email
      };
      that.putGoodsaddress().then(()=>{
        this.data.is_email ? app.user.putEmail({ email:userInfo.email }) : '';
        that.setData({
          showCard: false
        })
        wx.showModal({
          title: '兑换成功',
          content: '您的兑换申请已提交，请耐心等候哦！',
          showCancel: false,
          confirmColor: "#DF2020",
          success(res) {
            if (res.confirm) {
              if(that.data.giftInfo.from == "winPrize"){  //从抽奖来的
                param['id'] = that.data.giftInfo.id
                that.triggerEvent('change', param.id)
                app.lottery.finishGetPrize(param)
              }else{  //积分兑换
                param['gift_id'] = that.data.giftInfo.id
                param['sku_id'] = that.data.giftInfo.skuId
                app.user.exchange(param).then(() => {
                  that.triggerEvent('change', that.data.giftInfo.id)
                }).catch(err=>{
                  wx.showToast({
                    title: res.msg,
                    icon: "none",
                    duration: 2000
                  });
                });
              }
              
            }
          }
        })
      });
      
    }
  }
})
