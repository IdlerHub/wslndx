const app = getApp()
function initRecord(that) {
  app.backgroundAudioManager.onPlay(() => {
    that.playTiemr ? [clearInterval(that.playTiemr), that.playTiemr= null ] : ''
    that.playTiemr = setInterval(() => {
      if (that.data.playVoice.playTimer.minute == that.itemTimer.minute && that.data.playVoice.playTimer.second == that.itemTimer.second) {
        app.backgroundAudioManager.stop()
        that.setData({
          'playVoice.status': 0,
          'playVoice.id': 0,
        })
        wx.setKeepScreenOn({
          keepScreenOn: false
        })
        return
      }
      let num = that.data.playVoice.playTimer.second
      num += 1
      num > 60 ? that.setData({
        'playVoice.playTimer.minute': that.data.playVoice.playTimer.minute += 1,
        'playVoice.playTimer.second': 0
      }) : that.setData({
        'playVoice.playTimer.second': num
      })
    }, 1000)
  })

  app.backgroundAudioManager.onStop(() => {
    that.playTiemr ? [clearInterval(that.playTiemr), that.playTiemr= null]  : ''
    that.setData({
      'playVoice.status': 0,
      'playVoice.id': 0,
    })
  })
}

function checkRecord(e, that) {
  let duration = e.currentTarget.dataset.duration,
    recordUrl = e.currentTarget.dataset.record,
    id = e.currentTarget.dataset.id,
    name = e.currentTarget.dataset.name
    that.itemTimer = e.currentTarget.dataset.timer
  if (that.data.playVoice.status && recordUrl == that.recordUrl) {
    that.setData({
      'playVoice.status': 0,
    })
    app.backgroundAudioManager.stop();
    wx.setKeepScreenOn({
      keepScreenOn: false
    })
  } else {
    that.recordUrl = recordUrl
    that.setData({
      'playVoice.status': 1,
      'playVoice.id': id,
      'playVoice.playTimer.minute': 0,
      'playVoice.playTimer.second': 0
    })
    app.backgroundAudioManager.title = `${name}的音频`
    app.backgroundAudioManager.src = recordUrl;
    app.backgroundAudioManager.play();
  console.log(that)
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  }
}

module.exports = {
  initRecord,
  checkRecord
}