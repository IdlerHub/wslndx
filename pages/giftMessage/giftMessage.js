// pages/giftMessage/giftMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intro_content: '原标题：13吨包裹烧成灰？2019“双十一”高峰期间全行业处理邮快件业务量将达28亿件 来源：中商产业研究院“您的快递在燃烧”！每年双十一都会有这样的事发生，这样的事目前来看，只能“避开”没法“避免”。11月13日，13吨包裹烧成灰登上热搜，双十一刚过，大家购买的物品也正在运输途中。但11月12日凌晨4点，一辆北京开往湖南的百世快递公司物流车在河南安阳起火。这辆车长约15米，满载快递包裹，车身有大量火光冒出，浓烟滚滚。剧烈燃烧致车厢两侧已经开裂，空气里弥漫着一股焦味。据消防人员介绍，车厢内包裹重13吨，主要有日用品、百货、食用油、纸巾等。经过两小时扑救，现场大火被扑灭，无人员伤亡。但车上的快递全部都被烧毁。2019双十一高峰期间快递量将达到28亿件此外，在11月11日双十一当天，广州一快递点也发生火灾，店铺燃烧面积约4平方米，主要燃烧物是快递包裹。该快递在点居民区，还好扑灭及时并没有造成人员伤亡。同时，快递网点客服称，客户可提供单号与商品付款截图获取理赔。随着双十一大促刚结束，接下来的几天都是快递高峰期。据国家邮政局表示，预计今年的“双11”旺季高峰期从11月11日持续至11月18日，高峰期间，全行业处理的邮快件业务量将达到28亿件。数据来源：中商产业研究院整理“双十一”全天各邮政、快递企业共处理5.35亿快件数据显示，“双十一”全天各邮政、快递企业共处理5.35亿快件，是二季度以来日常处理量的3倍，同比增长28.6 %，再创历史新高。数据显示，“双十一”当天日寄发快件量排名前10的城市是：广州、金华(义乌) 、上海、深圳、杭州、苏州、北京、武汉、宁波、东莞。日投递快件量排名前10的城市是：北京、上海、广州、深圳、成都、重庆、苏州、杭州、东莞、天津。数据来源：中商产业研究院整理“双十一”当天各快递公司战绩日前，中国邮政、顺丰、中通、圆通等寄递企业公布了11日当天的战绩，均刷新了各自纪录。那么，各快递公司“双十一”当天战绩如何呢？11日，中国邮政订单量超过1亿件，包裹快递收寄量达6668万件，同比增长91.5 %。中国邮政未雨绸缪，通过提前新建、改建一批重点邮件处理中心，全网日均处理能力新增2600万件。到目前为止，全网没有出现限收、限流和积压现象。11日，顺丰速运全网收件量环比平日增长145.6 %，其中阿里平台订单量同比增长118%，揽收率高达80.8 %，排名全行业第一。大数据、云计算、人工智能等创新技术助力智慧决策，双十一件量预测准确率高达99.6 %。此外，顺丰顺应电商平台预售趋势，创新推出智慧供应链产品“极效前置”，双十一首日派送率超过六成。与此同时，顺丰的时效产品、重货、冷运、同城、供应链等服务运转正常，总体服务在业务高峰实现平稳有序运营。11日23: 31: 45，中通快递当日快递订单量突破2亿。21: 44: 25，中通快递当日揽收量破1亿。21: 16: 20，中通快运货量突破2万吨。22: 36: 25，中通云仓科技订单量突破1000万。11日，圆通速递(12.400, - 0.17, - 1.35 %) “双十一”订单量如期破亿，比2018年提早4小时8分。11日18: 42: 16，德邦快递大件快递单产品收入破亿。截止目前，申通、韵达、百世等企业尚未公布“双十一”当天战绩。更多资料请参考中商产业研究院发布的《2019 - 2025年中国快递行业市场前景及投资机会研究报告》，同时中商产业研究院还提物流产业大数据、物流产业规划策划、物流产业园策划规划、物流产业招商引资等解决方案。(原标题：13吨包裹烧成灰？2019“双十一”高峰期间全行业处理邮快件业务量将达28亿件)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ops) {
    let gift = JSON.parse(ops.content)
    wx.setNavigationBarTitle({
      title: gift.title
    })
    this.setData({
      gift,
      totalPoints: ops.totalPoints 
    })
  },
  gift() {
    if (!this.data.gift.stock) {
      wx.showToast({
        title: "已经没货啦～",
        icon: "none",
        duration: 1500
      })
    } else {
      if (this.data.totalPoints >= this.data.gift.need_points) {
        let param = { gift_id: this.data.gift.id }
        wx.showModal({
          title: "兑换提示",
          content: "确定要兑换该物品吗?",
          showCancel: true,
          cancelText: "暂时不换",
          cancelColor: "#000000",
          confirmText: "确定兑换",
          confirmColor: "#df2020",
          success: res => {
            if (res.confirm) {
              app.user.exchange(param).then(res => {
                if (res.code == 1) {
                  wx.navigateTo({
                    url: "/pages/gift/gift"
                  })
                }
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: "您的积分不够兑换!",
          icon: "none",
          duration: 1500
        })
      }
    }
  },

})