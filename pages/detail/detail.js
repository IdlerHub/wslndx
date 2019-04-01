//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        sort: 0,
        nav: [{ name: '剧集' }, { name: '简介' }],
        height: 0,
        phoneMask: false
    },
    onLoad(options) {
        var that = this;
        this.videoContext = wx.createVideoContext('myVideo')
        let systemInfo = wx.getSystemInfoSync();
        let windowHeight = systemInfo.windowHeight;
        let query = wx.createSelectorQuery().in(that);
        query.select('#myVideo').boundingClientRect();
        query.select('.info').boundingClientRect();
        query.select('.nav').boundingClientRect();
        query.exec((res) => {
            let videoHeight = res[0].height;
            let infoHeight = res[1].height;
            let navHeight = res[2].height + 10;
            let scrollViewHeight = windowHeight - videoHeight - infoHeight - navHeight;
            that.setData({
                height: scrollViewHeight,
                currentTab: 0,
                navScrollLeft: 0,
                userInfo: wx.getStorageSync('userInfo'),
                id: options.id,
                cur: null
            });
            wx.setNavigationBarTitle({
                title: options.name
            })
            if (options.play) {
                that.setData({
                    hideRecode: true
                })
                that.getDetail(function() {
                    that.recordAdd()
                })
            } else {
                that.getDetail()
            }
        });
        app.PhoneMask(that)
    },

    //获取用户号码
    getPhoneNumber: function(e) {
        app.phone(e, this);
      console.log(this.data.phoneMask)
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    switchTab(event) {
        var cur = event.detail.current;
        this.setData({
            currentTab: cur,
        });
        app.PhoneMask(this)
    },
    getDetail(callback) {
        var that = this;
        this.param = {
            id: this.data.id,
            sort: this.data.sort
        }
        wx.showNavigationBarLoading()
        app.classroom.detail(this.param, function(msg) {
            wx.hideNavigationBarLoading()
            if (msg.code == 1) {
                msg.data.bw = app.util.tow(msg.data.browse);
                msg.data.sublesson.forEach(function(item, index) {
                    item.minute = (item.film_length / 60).toFixed(0)
                })
                that.setData({
                    detail: msg.data
                })
                that.manage()
            }
            if (callback) {
                callback()
            }
        }, function() {})
    },
    ended() {
        this.setData({
            playing: false
        })
    },
    manage() {
        var that = this;
        var detail = this.data.detail;
        var current = 0,
            total = 0,
            cur = '';
        detail.sublesson.forEach(function(item) {
            total++;
            if (item.played == 1) {
                current++;
            }
            if (item.id == detail.current_sublesson_id) {
                cur = item;
            }
        })
        if (detail.current_sublesson_id == 0) {
            cur = detail.sublesson[0]
        }
        this.setData({
            'detail.progress': parseInt(current / total * 100),
            cur: cur
        })
    },
    // 排序
    order() {
        this.setData({
            sort: this.data.sort == 0 ? 1 : 0
        })
        this.getDetail();
    },
    // 收藏
    collect() {
        var that = this;
        var param = { lesson_id: this.param.id }
        if (this.data.detail.collected == 1) {
            wx.showModal({
                title: '',
                content: '是否取消收藏',
                success: function(res) {
                    if (res.confirm) {
                        app.classroom.collectCancel(param, function(msg) {
                            if (msg.code == 1) {
                                that.setData({
                                    "detail.collected": 0
                                })
                            }
                        }, function() {})
                    } else if (res.cancel) {
                        return
                    }
                }
            })
        } else {
            app.classroom.collect(param, function(msg) {
                    if (msg.code == 1) {
                        that.setData({
                            "detail.collecting": true,
                            "detail.collected": 1
                        })
                    }
                }, function() {})
                //用于数据统计
            app.aldstat.sendEvent('课程收藏', { "name": that.data.title })
        }
    },
    aniend() {
        this.setData({
            "detail.collecting": false,
        })
    },
    // 选择剧集
    select(e) {
        var i = e.currentTarget.dataset.index
        var list = this.data.detail.sublesson
        this.setData({
            cur: list[i],
        })
        this.recordAdd();
    },
    recordAdd() {
        var that = this
        var list = this.data.detail.sublesson

        var param = {
            lesson_id: this.param.id,
            sublesson_id: that.data.cur.id
        }
        app.classroom.recordAdd(param, function(msg) {
            if (msg.code == 1) {
                that.getDetail(function() {
                    that.videoContext.play();
                    that.setData({
                        playing: true,
                        hideRecode: true
                    });
                    app.addVisitedNum(`k${that.data.cur.id}`)
                    app.PhoneMask(that)
                })
            }
        }, function() {})
    },
    navitor() {
        if (!this.data.userInfo.nickname) {
            wx.showModal({
                title: '',
                showCancel: false,
                content: '您还没有授权，请先授权',
                success: function(res) {
                    if (res.confirm) {
                        wx.reLaunch({
                            url: '../index/index',
                        })
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '../certificate/certificate?name=' + this.data.detail.title,
            })
        }
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "课程详情页" })
    }
})