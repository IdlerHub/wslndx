// components/giftModels/giftModels.js
// 奖品兑换规格卡片,需要在兑换的接口处新增sku_id字段,score.js页带有规格字段位置的修改
const app = getApp()
Component({
  properties: {
    giftInfo: { //礼品详情
      type: Object,
      vaue: {}
    },
    showCard:{
      type: Boolean,
      value: false
    }
  },
  observers:{
    showCard(){
      if (this.data.showCard) {
        app.user.getSpecification({giftId: this.data.giftInfo.id}).then(res=>{
          this.setData({
            modelsInfo: res.dataList,
            skuId: 0
          })
        })
      } 
    }
  },
  data: {
    modelsInfo: {}, //规格列表
    skuId: 0,//规格id
  },
  methods: {
    close(){
      this.setData({
        showCard: false
      })
    },
    unMove(){//禁止穿透滑动
      return
    },
    changeSku(e) {  //切换规格
      let skuId = e.currentTarget.dataset.skuId
      if(this.data.skuId === skuId) {
        skuId = 0
      }
      this.setData({
        skuId
      })
    },
    setSkuId(){  //提交规格
      if(this.data.skuId == 0) {
        wx.showToast({
          title: "请选择" + this.data.modelsInfo[0].qualityValue,
          icon: "none",
          duration: 2000
        });
      }else {
        let giftInfo = this.data.giftInfo
        giftInfo['skuId'] = this.data.skuId
        this.triggerEvent('setSkuId',giftInfo)
      }
    }
  }
})
