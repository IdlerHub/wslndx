//base64 
import { Base64 } from 'utils/base64.js';
/*添加async await*/
import regeneratorRuntime from 'wx-promise-pro';
/*添加微信官方接口转化为promise*/
const wxpro = require('wx-promise-pro');
/*埋点统计*/
const ald = require('./utils/ald-stat.js');

//app.js
App({
    API_URL: 'https://api.jinlingkeji.cn/api/v1/', //正式域名：https://api.jinlingkeji.cn   开发域名：https://develop.jinlingkeji.cn
    IMG_URL: 'https://develop.jinlingkeji.cn/uploads',
    //工具库
    util: require('utils/util.js'),
    md5: require('utils/md5.js'),
    //接口
    classroom: require('data/Classroom.js'),
    user: require('data/User.js'),
    video: require('data/Video.js'),
    circle: require('data/Circle.js'),
    // Base64
    base64: Base64,
    data: {},
    onLaunch: async function(opts) {
        if (opts.path === 'pages/video/video' && !!opts.query.id) {
            /* 看单个短视频的游客不需要授权 */
            this.wxLogin();
        } else {
            /* 检查版本更新 */
            this.checkVersion();
            /* 直接进入首页的全部要求授权 */
            let userInfo = wx.getStorageSync('userInfo');
            if (!!userInfo.mobile) {
                this.globalData.userInfo = userInfo;
                wx.reLaunch({ url: '/pages/index/index' });
            } else {
                await this.wxLogin();
                if (!this.globalData.userInfo.mobile) {
                    wx.reLaunch({ url: '/pages/login/login' });
                } else {
                    wx.reLaunch({ url: '/pages/index/index' });
                }
            }
        }
    },
    wxLogin: async function() {
        await wx.pro.login({}).then((res) => {
            this.globalData.code = res.code;
        });
        await this.user.wxLoginCode({ code: this.globalData.code }).then((msg) => {
            if (msg.code === 1) {
                wx.setStorageSync('token', msg.data.token);
                wx.setStorageSync('uid', msg.data.uid);
                wx.setStorageSync('userInfo', msg.data.userInfo);
                this.globalData.userInfo = msg.data.userInfo;
            }
        });
    },
    addVisitedNum: function(id) {
        let userInfo = wx.getStorageSync('userInfo');
        if (!userInfo.nickname) {
            let arr = wx.getStorageSync('visitedNum') ? wx.getStorageSync('visitedNum') : [];
            if (arr.indexOf(id) == -1) {
                arr.push(id);
                wx.setStorageSync('visitedNum', arr)
            }
        }
    },
    updateBase(e, page) {
        if (e.detail.errMsg != 'getUserInfo:ok') {
            page.setData({ baseInfo: true });
            return;
        }
        let param = {
            userInfo: JSON.stringify(e.detail.userInfo),
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
        };
        this.user.profile(param).then((msg) => {
            if (msg.code == 1) {
                this.globalData.userInfo = msg.data.userInfo;
                wx.setStorageSync('userInfo', msg.data.userInfo);
                let userInfo = msg.data.userInfo;
                if (userInfo) userInfo.address = userInfo.address ? userInfo.address.split(',')[1] : '';
                page.setData({
                    userInfo: userInfo,
                    baseInfo: false
                });
                if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback()
                }
            }
        })
    },
    baseInfo: function(page) {
        let visitedNum = wx.getStorageSync('visitedNum');
        let userInfo = wx.getStorageSync('userInfo');
        if (visitedNum.length > 10 && !userInfo.nickname) {
            page.setData({ baseInfo: true })
        }
    },
    checkVersion: () => {
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
            updateManager.onCheckForUpdate(function(res) {
                console.log('onCheckForUpdate====', res)
                    // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    console.log('res.hasUpdate====')
                    updateManager.onUpdateReady(function() {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: function(res) {
                                console.log('success====', res)
                                    // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(function() {
                        // 新的版本下载失败
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        }
    },
    globalData: {
        /*wx.login 返回值 code */
        code: null,
        /* 登录用户信息 */
        userInfo: null,
    }
});