//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        nav: [{ name: '收藏课程' }, { name: '学习历史' }, { name: '我的圈子' }],
        height: 0
    },
    onLoad() {
        /*todo:去掉that*/
        let that = this;
        let systemInfo = wx.getSystemInfoSync();
        let windowHeight = systemInfo.windowHeight;
        let query = wx.createSelectorQuery().in(this);
        query.select('.top').boundingClientRect();
        query.select('.nav').boundingClientRect();
        query.exec((res) => {
            let headerHeight = res[0].height;
            let navHeight = res[1].height;
            let scrollViewHeight = windowHeight - headerHeight - navHeight;
            that.setData({
                height: scrollViewHeight,
            });
        });
        this.setData({
            collect: [],
            history: {},
            circle: [],
            currentTab: 0,
            navScrollLeft: 0,
        });
        this.collectParam = this.historyParam = this.circleParam = { page: 1, pageSize: 10 };
        this.getCollect([]);
        this.getHistory([]);
        this.getCircle([]);
    },
    onShow() {
        if (app.globalData.userInfo.nickname) {
            /*updateBase请求先返回*/
            this.init();
        } else {
            /*页面先加载，login请求后返回*/
            app.userInfoReadyCallback = () => {
                this.init();
            };
        };
    },
    init() {
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
        this.setData({
            userInfo: userInfo,
        })
    },
    switchNav(event) {
        let cur = event.currentTarget.dataset.current;
        if (this.data.currentTab !== cur) {
            this.setData({
                currentTab: cur
            })
        }
    },
    switchTab(event) {
        let cur = event.detail.current;
        this.setData({
            currentTab: cur,
        });
    },
    getUserInfo(e) {
        if (e.detail.errMsg != 'getUserInfo:ok') return;
        let param = {
            userInfo: JSON.stringify(e.detail.userInfo)
        };
        app.user.profile(param).then((msg) => {
            if (msg.code == 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo);
                let userInfo = msg.data.userInfo;
                if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
                this.setData({
                    userInfo: userInfo,
                })
            }
        })
    },
    getCollect(list) {
        let collect = list || this.data.collect;
        wx.showNavigationBarLoading();
        return app.user.collect(this.collectParam).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                msg.data.forEach(function(item) {
                    item.thousand = (item.browse / 10000) > 1 ? (item.browse / 10000).toFixed(1) : null;
                    collect.push(item);
                });
                this.setData({
                    collect: collect
                })
            }
        })
    },
    getHistory(list) {
        let temp = list || this.data.history.history;
        wx.showNavigationBarLoading();
        return app.user.history(this.historyParam).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                for (let i in msg.data.history) {
                    msg.data.history[i].forEach(function(item) {
                        item.createtime = app.util.formatTime(new Date(item.createtime * 1000)).slice(10)
                    });
                    temp.push({ date: i, data: msg.data.history[i] });
                }
                this.setData({
                    'history.history': temp,
                    'history.last_lesson': msg.data.last_lesson
                })
            }

        })
    },
    getCircle(list) {
        let circle = list || this.data.circle;
        wx.showNavigationBarLoading();
        this.circleParam.us_id = 0;
        app.circle.news(this.circleParam).then((msg) => {
            wx.hideNavigationBarLoading();
            if (msg.code == 1) {
                if (msg.data) {
                    msg.data.forEach(function(item) {
                        let arr = [];
                        item.images.forEach(function(i) {
                            arr.push(i.image)
                        });
                        item.images = arr;
                        item.auditing = ((new Date()).getTime() - new Date(item.createtime * 1000)) < 7000 ? true : false;
                        item.pause = true;
                        circle.push(item);
                    })
                }
                this.setData({
                    circle: circle
                })
            }
        })
    },
    del(e) {
        let i = e.currentTarget.dataset.index;
        let circle = this.data.circle;
        let param = {
            blog_id: circle[i].id
        };
        wx.showModal({
            title: '',
            content: '是否删除帖子',
            success: (res) => {
                if (res.confirm) {
                    app.circle.delPost(param).then((msg) => {
                        if (msg.code == 1) {
                            this.circleParam.page = 1;
                            this.getCircle([]);
                        }
                    })
                } else if (res.cancel) {
                    return;
                }
            }
        })
    },
    // 写帖成功动效
    rlSuc() {
        this.setData({
            rlAni: true
        });
        this.circleParam.page = 1;
        this.getCircle([]);
    },
    rlAniend() {
        this.setData({
            rlAni: false
        })
    },
    //图片预览
    previewImage(e) {
        let that = this;
        let urls = e.currentTarget.dataset.urls;
        let current = e.currentTarget.dataset.current;
        this.setData({
            preview: true
        });
        wx.previewImage({
            current: current,
            urls: urls, // 需要预览的图片http链接列表
            complete: () => {
                that.setData({
                    preview: false
                })
            }
        })
    },
    navigate(e) {
        let id = e.currentTarget.dataset.id;
        if (!this.data.preview) {
            wx.navigateTo({
                url: '../pDetail/pDetail?id=' + id,
            })
        }
    },
    //下拉刷新
    onPullDownRefresh() {
        this.collectParam.page = this.historyParam.page = this.circleParam.page = 1;
        this.getCollect([]).then(() => {
            wx.stopPullDownRefresh();
        });
        this.getHistory([]);
        this.getCircle([]);
    },
    //上拉加载
    collectLower() {
        this.collectParam.page++;
        this.getCollect();
    },
    historyLower() {
        this.historyParam.page++;
        this.getHistory();
    },
    circleLower() {
        this.circleParam.page++;
        this.getCircle();
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', { "name": "个人中心页" })
    }
})