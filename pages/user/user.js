// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    showHeadPortrait: false,
    url: "../../img/mao.jpg",
    menuList: {
      collectShop: 0,
      collectShoper: 0,
      attention: 0,
      history: 0,
      showNotPayBadge: false,
      notPayCount: 0,
      showNotAcceptBadge: false,
      notAccepCount: 0
    }
  },

  // 页面加载和show时候的准备工作
  ready() {
     // 获取后台的收藏商品的数据和用户信息,
     let history = wx.getStorageSync('history') || []
     this.setData({
       menuList:{
         collectShop: 0,
         collectShoper: wx.getStorageSync('collectList').length,
         attention: 0,
         history: history.length
       }
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    }
    console.log(this.data.userInfo);
    if ( this.data.showHeadPortrait ) {
      this.ready()
      // 设置待付款和待收货的的订单数量
      let notPayList = wx.getStorageSync('notPayList')
      let notAcceptList = wx.getStorageSync('notAcceptList')
      if ( notPayList.length > 0) {
        this.setData({
          showNotPayBadge: true,
          notPayCount: notPayList.length
        })
      }
      if ( notAcceptList.length > 0) {
        this.setData({
          showNotAcceptBadge: true,
          notAccepCount: notAcceptList.length
        })
      }
    }
    

  },

  // onShow时候刷新用户的收藏数
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (this.data.userInfo.avatarUrl !== undefined ) {
      this.setData({
        showHeadPortrait: true
      })
    }
    if ( this.data.showHeadPortrait ) {
      this.ready()
      let notPayList = wx.getStorageSync('notPayList')
      let notAcceptList = wx.getStorageSync('notAcceptList')
      if ( notPayList.length > 0) {
        this.setData({
          showNotPayBadge: true,
          notPayCount: notPayList.length
        })
      } else {
        this.setData({
          showNotPayBadge: false
        })
      }
      if ( notAcceptList.length > 0) {
        this.setData({
          showNotAcceptBadge: true,
          notAccepCount: notAcceptList.length
        })
      } else {
        this.setData({
          showNotAcceptBadge: false
        })
      }
    }
    
  },

  // 获取用户信息
  bindgetuserinfo(res) {
    wx.setStorageSync('userInfo',res.detail.userInfo)
    this.setData({
      userInfo: res.detail.userInfo,
      showHeadPortrait: true
    })
    // 设置购物车的数量图标
    let cart = wx.getStorageSync('cart')
     wx.setTabBarBadge({
       index: 2,
       text: cart.length + ''
     })
     this.onShow()
     wx.showToast({
       title: "欢迎回来"
     })
  },

  // 退出登录
  logOut() {
    wx.setStorageSync('userInfo',[])
    this.setData({
      userInfo: [],
      showHeadPortrait: false,
      menuList:{
        collectShop: 0,
        collectShoper: 0,
        attention: 0,
        history: 0,
        showNotPayBadge: false,
        notPayCount: 0,
        showNotAcceptBadge: false,
        notAccepCount: 0
      },
      showNotPayBadge:false,
      showNotAcceptBadge:false
    })
     // 设置购物车的数量图标
     wx.removeTabBarBadge({
       index: 2
     })
    wx.showToast({
      title: "您已经退出"
    })
  },

  // 跳转收藏界面
  navigateToCollect() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/collect/collect"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
    
  },

  // 跳转意见反馈界面
  navigateToAdvice() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/advice/advice"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 跳转足迹界面
  navagateToHistory() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/history/history"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 跳转地址管理界面
  nanigateToAddtress() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/address/address"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 未开通的功能
  showTip() {
    if ( this.data.showHeadPortrait ) {
      wx.showToast({
        title: "后台没有数据，功能无法实现",
        icon: "none"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 分享朋友
  onShareAppMessage() {
    return {
      title: "分享朋友",
      success() {
        console.log("success");
      },
      fail() {
        console.log("error");
      }
    }
  },
    // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "分享朋友圈",
      query: {},
      imageUrl: "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      success() {
        console.log("success");
      },
      fail() {
        console.log("error");
      }
    }
  },

  // 跳转全部订单页面
  navigateToAll() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/indent/indent?from=all"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 跳转未支付界面
  navigateToNotPay() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/indent/indent?from=pay"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

   // 跳转待收货界面
   navigateToNotAccept() {
    if ( this.data.showHeadPortrait ) {
      wx.navigateTo({
        url: "../../pages/indent/indent?from=NotAccept"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  },

  // 点击关于我们
  aboutUS() {
    if ( this.data.showHeadPortrait ) {
      wx.showToast({
        title: "就是一个程序汪，有啥好看的",
        icon: "none"
      })
    } else {
      wx.showToast({
        title: "请先登录",
        icon: "none"
      })
    }
  }

})