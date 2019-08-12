function formatTime(date) {
  date = date ? date : new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute].map(formatNumber).join(":")
}

function formatNumber(n) {
  n = n.toString()
  return n.padStart(2, "0")
}

function dateUnit() {
  var date = new Date()
  return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日"
}

/**验证是否手机号 */
function isPoneAvailable(poneInput) {
  if (!/^1[3|4|5|7|8|9]\d{9}$/.test(poneInput)) {
    return false
  } else {
    return true
  }
}
/**获取链接参数 */
function getQueryStringByName(href, name) {
  var result = href.match(new RegExp("[?&]" + name + "=([^&]+)", "i"))
  if (result == null || result.length < 1) {
    return ""
  }
  return result[1]
}
/**破万 */
function tow(num) {
  return num / 10000 > 1 ? (num / 10000).toFixed(1) + "W" : null
}

module.exports = {
  formatTime,
  isPoneAvailable,
  getQueryStringByName,
  tow,
  dateUnit
}
