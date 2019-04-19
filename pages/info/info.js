//index.js
//获取应用实例
const app = getApp()
Page({
    data: {
        IMG_URL: app.IMG_URL,
        gender: ['女', '男'],
        age: [
            "50以下",
            "50-60",
            "60-70",
            "70以上"
        ],
    },
    onLoad() {
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo: userInfo,
            param: {
                address: userInfo.address ? userInfo.address.split(',') : ['', '', ''],
                university: ['', '', userInfo.university],
                gender: userInfo.gender,
                age: userInfo.age,
            }
        });
        this.param = this.data.param.university;
        this.getProvince();
    },
    getProvince() {
        let param = {level: 1};
        app.user.search(param).then((msg) => {
            if (msg.code == 1) {
                this.province = msg.data;
                this.getCity();
            }
        })
    },
    getCity(val) {
        let param = {level: 2, name: val || this.province[0]};
        app.user.search(param).then((msg) => {
            if (msg.code == 1) {
                this.city = msg.data;
                this.getSchool();
            }
        })
    },
    getSchool(val) {
        let param = {level: 3, name: val || this.city[0]};
        app.user.search(param).then((msg) => {
            if (msg.code == 1) {
                this.school = msg.data;
                this.param[2] = this.school ? this.school[0] : '';
                this.setData({
                    multiArray: [this.province, this.city, this.school]
                })
            }
        })
    },
    bindRegionChange: function (e) {
        this.setData({
            'param.address': e.detail.value
        });
        this.submit();
    },
    bindMultiPickerChange() {
        this.setData({
            'param.university': this.param[2] ? this.param : [this.province[0], this.city[0], this.school[0]]
        });
        this.submit();
    },
    bindMultiPickerColumnChange(e) {
        let param = this.param;
        param[e.detail.column] = this.data.multiArray[e.detail.column][e.detail.value];
        switch (e.detail.column) {
            case 0:
                this.getCity(param[e.detail.column]);
                break;
            case 1:
                this.getSchool(param[e.detail.column]);
                break;
        }
    },
    bindSexChange(e) {
        this.setData({
            'param.gender': e.detail.value
        });
        this.submit();
    },
    bindAgeChange(e) {
        this.setData({
            'param.age': this.data.age[e.detail.value]
        });
        this.submit();
    },
    // back(){
    //   wx.navigateBack()
    // },
    submit() {
        let param = {
            address: this.data.param.address.join(','),
            gender: this.data.param.gender === "男" ? 1 : 0,
            university: this.data.param.university[2],
            age: this.data.param.age,
        };
        app.user.profile(param).then((msg) => {
            if (msg.code == 1) {
                wx.setStorageSync('userInfo', msg.data.userInfo)
            }
        })
    },
    //用于数据统计
    onHide() {
        app.aldstat.sendEvent('退出', {"name": "完善资料页"})
    }
})
