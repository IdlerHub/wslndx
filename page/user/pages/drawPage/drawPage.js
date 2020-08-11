// pages/drawPage/drawPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showrule: false,
    activeRed: 0,
    clickLuck: 'clickLuck',
    screenHeight: false,
    index: 0,  // 当前转动到哪个位置，起点位置
    count: 8,  // 总共有多少个位置
    timer: 0,  // 每次转动定时器
    speed: 200,  // 初始转动速度
    times: 0,    // 转动次数
    cycle: 50,   // 转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,   // 中奖位置
    click: true,
    showToast: false, //显示中奖弹窗  
    lotteryCfgList: [],
    lotteryres: {},
    showmeng: true,
    showmask: false,
    drawRuleNum: '',
    recordRuleNum: ''
  },
  pageName: '积分抽奖',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let systems = wx.getSystemInfoSync()
    systems.screenHeight > 736 ? this.setData({
      screenHeight: true
    }) : ''
  },
  onShow() {
    this.getLotteryCfglist()
    this.setData({
      recordRuleNum: '',
      towin: false
    })
  },
  getLotteryCfglist() {
    return app.lottery.lotteryCfgList().then(res => {
      this.setData({
        lotteryCfgList: res.data.list,
        lottery_count: res.data.today_lottery_count
      })
    })
  },
  getLotteryres() {
    return app.lottery.lotteryRes().then(res => {
      this.startRoll()
      this.setData({
        lotteryres: res.data
      })
    }).catch(err => {
      if (err.code == 0) {
        wx.showToast({
          title: '很抱歉，您的' + err.msg,
          icon: 'none'
        })
        this.setData({
          showmask: false,
          lottery_count: 0,
          clickLuck: 'clickLuck'
        })
      }
    })
  },
  showrule() {
    this.setData({
      showrule: true,
      drawRuleNum: 2
    })
  },
  closerule() {
    this.setData({
      showrule: false,
      drawRuleNum: ''
    })
  },
  touchstart(e) {
    this.touchStartTime = e.timeStamp;
  },
  touchend(e) {
    this.touchEndTime = e.timeStamp;
  },
  // 轮盘动画
  clickLuck(e) {
    let that = this
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      let currentTime = e.timeStamp;
      let lastTapTime = that.lastTapTime || currentTime - 310;
      // 更新最后一次点击时间
      that.lastTapTime = currentTime;
      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime > 300) {
        // do something 点击事件具体执行那个业务
        if (this.data.lottery_count >= 2) return
        this.setData({
          showmask: true,
          clickLuck: ''
        })
        wx.showModal({
          content: '是否消耗25学分开启抽奖?',
          cancelColor: '#999',
          confirmColor: '#DF2020',
          success(res) {
            if (res.confirm) {
              that.data.lottery_count == 0 ? that.setData({
                lottery_count: 0.5
              }) : that.setData({
                lottery_count: 1.5
              })
              that.getLotteryres()
            } else if (res.cancel) {
              that.setData({
                showmask: false,
                clickLuck: 'clickLuck'
              })
            }
          }
        })
      }
    }
  },
  startRoll() {
    let times = this.data.times += 1
    this.setData({
      times
    }) // 转动次数
    this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化 
    // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
    if (this.data.times > this.data.cycle + 10 && this.data.prize === this.data.index) {
      clearTimeout(this.data.timer)  // 清除转动定时器，停止转动
      this.setData({
        prize: -1,
        times: 0,
        speed: 200,
        click: true,
        timer: 0,
        clickLuck: 'clickLuck'
      })
      if (this.data.lotteryres.get_type == 1) {
        app.socket.send({
          type: 'Prizemessage',
          data: ''
        })
      }
      this.data.lottery_count == 0.5 ? this.setData({
        lottery_count: 1
      }) : this.data.lottery_count == 1.5 ? this.setData({
        lottery_count: 2
      }) : ''
      let that = this;
      setTimeout(res => {
        if (this.data.lotteryres.get_type == 0) {
          wx.showToast({
            title: '很遗憾，您未中奖呢',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            showToast: true
          })
        }
      }, 500)
    } else {
      if (this.data.times < this.data.cycle) {
        let speed = this.data.speed -= 10
        this.setData({
          speed
        }) // 加快转动速度
      } else if (this.data.times === this.data.cycle) {
        // const index = parseInt(Math.random() * 10, 0) || 0;  // 随机获得一个中奖位置
        let index = -1
        this.data.lotteryCfgList.forEach((item, num) => {
          item.id == this.data.lotteryres.id ? index = num : ''
        })
        this.setData({
          prize: index
        })
        // this.prize = index; 中奖位置,可由后台返回 
        if (this.data.prize > 7) {
          this.setData({
            prize: 7
          })
        }
      } else if (this.data.times > this.data.cycle + 10 && ((this.data.prize === 0 && this.data.index === 7) || this.data.prize === this.data.index + 1)) {
        let speed = this.data.speed += 110
        this.setData({
          speed
        })
      } else {
        let speed = this.data.speed += 20
        this.setData({
          speed
        })
      }
      if (this.data.speed < 40) {
        this.setData({
          speed: 40
        })
      }
      let timer = setTimeout(this.startRoll, this.data.speed)
      this.setData({
        timer
      })
    }
  },

  // 每一次转动
  oneRoll() {
    let index = this.data.index // 当前转动到哪个位置
    let count = this.data.count // 总共有多少个位置
    index += 1
    if (index > count - 1) { index = 0 }
    this.setData({
      index
    })
  },
  //中奖记录页面
  toWinprize() {
    if (this.data.towin) {
      return
    } else {
      wx.navigateTo({
        url: '/page/user/pages/winPrize/winPrize',
      })
      this.setData({
        showToast: false,
        recordRuleNum: '2',
        towin: true
      })
    }
  },
  closeprizr() {
    this.setData({
      showToast: false
    })
  },
  closeToast() {
    this.setData({
      showToast: false
    })
  }
})