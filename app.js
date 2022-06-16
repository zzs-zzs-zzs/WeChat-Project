//app.js
App({
  onLaunch(options) {
    if ( wx.getStorageSync('userInfo').avatarUrl !== undefined ) {
       // 设置tabbar的角标
      let cart = wx.getStorageSync('cart')
      wx.setTabBarBadge({
        index: 2,
        text: cart.length + ''
      })
    }
   
  },
  onShow(options) {
    if ( wx.getStorageSync('userInfo').avatarUrl !== undefined ) {
      // 设置tabbar的角标
     let cart = wx.getStorageSync('cart')
     wx.setTabBarBadge({
       index: 2,
       text: cart.length + ''
     })
   }
  },
  onHide() {

  },
  onError(msg) {

  },
  onPageNotFound(path,query,isEntryPage) {

  },

  // 定义一个函数，做一个定时器，是用于待付订单的定时删除
  timeOut(timer) {
    let time = setTimeout(()=> {
      // 时间到删除待付订单
      clearTimeout(time)
      console.log(timer);
      console.log('timeout');
      let notPayList = wx.getStorageSync('notPayList')
      notPayList.forEach((element,index) => {
        if( element[0].timer === timer ) {
          notPayList.splice(index,1)
        }
      });
      wx.setStorageSync('notPayList',notPayList)
    },1000*600)
  },

  // 如果待付订单已经支付，在支付完成后删除待付订单
  // 取消订单
  clearTimeOut(timer) {
    console.log('已经清除'+timer+'定时器');
    clearTimeout(timer)
  }
})