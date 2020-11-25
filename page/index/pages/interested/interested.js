// page/index/pages/interested/interested.js
Page({
  data: {
    list: [],
    selectNum: 0
  },
  onLoad: function (options) {
    let list = [
      {
        "id": 6,
        "name": "文化2",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/596d71edc8a1bdf5f1eedee3769ded5d.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 28,
            "name": "舞蹈",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/bb302ded1c5439ca8b4357ac6c3ad67a.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      },
      {
        "id": 5,
        "name": "摄影",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/00a160c2e7eede310ac89a8a51896640.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 39,
            "name": "测试1",
            "image": "https://hwcdn.jinlingkeji.cn/uploads/images/f2860437d75fea197d46c7ef82f6f7f3.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          },
          {
            "id": 34,
            "name": "书画",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/596d71edc8a1bdf5f1eedee3769ded5d.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          },
          {
            "id": 33,
            "name": "摄影",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/00a160c2e7eede310ac89a8a51896640.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          },
          {
            "id": 32,
            "name": "音乐",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/bb302ded1c5439ca8b4357ac6c3ad67a.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      },
      {
        "id": 4,
        "name": "运动",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/bb302ded1c5439ca8b4357ac6c3ad67a.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 38,
            "name": "综合",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/7ab015722b36b005def53ddc722b2918.jpg",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      },
      {
        "id": 3,
        "name": "将康",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/1d4686bc9dfd376f9997afb80a3b76e7.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 31,
            "name": "直播",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/1d4686bc9dfd376f9997afb80a3b76e7.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          },
          {
            "id": 29,
            "name": "运动",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/7323102372f360f4f5f8533cd3cfdd88.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      },
      {
        "id": 2,
        "name": "声乐弹唱",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/7323102372f360f4f5f8533cd3cfdd88.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 35,
            "name": "权益",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/dcae006e295f120e201cd3ed12d928d3.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      },
      {
        "id": 1,
        "name": "形象礼仪",
        "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443/uploads/images/bb302ded1c5439ca8b4357ac6c3ad67a.png",
        "topImage": "",
        "introContent": "",
        "color": "",
        "categoryList": [
          {
            "id": 36,
            "name": "养生",
            "image": "https://jinling-xcx-dev.obs.cn-north-1.myhuaweicloud.com:443//uploads/images/0d5d69ff9c7de843bfbacd2beea1285c.png",
            "topImage": "",
            "type": 0,
            "tag": "",
            "introContent": "",
            "color": ""
          }
        ]
      }
    ]
    list.forEach((e, i) => {
      e.index = i
      e.categoryList.forEach(t => {
        t.color.length > 0 ? t.select = 1 : t.select = 0
      })
    })
    this.setData({
      list
    })
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onShareAppMessage: function () {

  },
  select(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index, idx = e.currentTarget.dataset.idx
    if(this.data.list[index].categoryList[idx].select) {
      this.setData({
        [`list[${index}].categoryList[${idx}].select`]: 0,
        selectNum: this.data.selectNum - 1
      })
    } else {
      this.setData({
        [`list[${index}].categoryList[${idx}].select`]: 1,
        selectNum: this.data.selectNum += 1
      })
    }
  }
})