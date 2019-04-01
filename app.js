//base64 
import { Base64 } from 'utils/base64.js';
const ald = require('./utils/ald-stat.js')
    //app.js  
App({
    API_URL: 'https://develop.jinlingkeji.cn/api/v1/', //正式域名：https://api.jinlingkeji.cn   开发域名：https://develop.jinlingkeji.cn
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
    data: {

    },
    onLaunch: function() {
        if (wx.getStorageSync('token')) return;
        this.wxLogin();
    },
    wxLogin() {
        var that = this;
        wx.login({
            success: res => {
                // 微信code登录
                var code = {
                    code: res.code,
                }
                that.user.wxlogin(code, function(msg) {
                    if (msg.code == 1) {
                        wx.setStorageSync('token', msg.data.token)
                        wx.setStorageSync('uid', msg.data.uid)
                        wx.setStorageSync('userInfo', msg.data.userInfo)
                        var pages = getCurrentPages();
                        var prePage = pages[pages.length - 1];
                        prePage.onShow();
                        prePage.onLoad();
                    }
                }, function() {})
            }
        })
    },
    //获取电话号码
    phone(e, page) {
        var page = page;
        if (e.detail.errMsg != 'getPhoneNumber:ok') { page.setData({ phoneMask: true }); return; }
        var param = {
            mobileEncryptedData: e.detail.encryptedData,
            mobileiv: e.detail.iv
        }
        this.user.profile(param, function(msg) {
            if (msg.code == 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo)
                page.setData({
                    phoneMask: false
                })
            }
        }, function() {})
    },
    addVisitedNum: function(id) {
        var that = this;
        var userInfo = wx.getStorageSync('userInfo');
        if (!userInfo.mobile) {
            var arr = wx.getStorageSync('visitedNum') ? wx.getStorageSync('visitedNum') : [];
            if (arr.indexOf(id) == -1) {
                arr.push(id)
                wx.setStorageSync('visitedNum', arr)
            }
        }
    },
    //判断是否显示获取电话授权弹框
    PhoneMask: function(page) {
        var that = page;
        var visitedNum = wx.getStorageSync('visitedNum');
        var userInfo = wx.getStorageSync('userInfo')
        if (visitedNum.length > 10 && !userInfo.mobile) {
            that.setData({ phoneMask: true })
        }
    }
})