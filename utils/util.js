const formatTime = date => {
    date = date ? date : new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + " " + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**时间格式化 00:00:00 */
const timeFormat = function(t) {
    var t = t || 0;
    // t=Math.round(t/1000);
    function format(n) {
        var k = n.toString();
        if (k.length <= 1) k = "0" + k;
        return k;
    }
    var h = "00",
        m = "00",
        s = "00";
    h = format(parseInt(t / 3600 + ''));
    m = format(parseInt(t / 60 + '') % 60);
    s = format(t % 60);
    return h + "小时 " + m + "分 " + s + "秒";
}

/**验证是否手机号 */
function isPoneAvailable(poneInput) {
    if (!(/^1[3|4|5|7|8|9]\d{9}$/.test(poneInput))) {
        return false;
    } else {
        return true;
    }
}
/**获取链接参数 */
function getQueryStringByName(href, name) {
    var result = href.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
/**破万 */
function tow(num) {
    return (num / 10000) > 1 ? (num / 10000).toFixed(1) : null;
}

module.exports = {
    formatTime: formatTime,
    timeFormat: timeFormat,
    isPoneAvailable: isPoneAvailable,
    getQueryStringByName: getQueryStringByName,
    tow: tow,
}