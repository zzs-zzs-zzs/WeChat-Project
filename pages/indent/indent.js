// pages/indent/indent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles:["全部","待付款","待收货","已完成","已取消"],
    showList: [false,false,false,false,false],
    currentIndex: 0,
    notPayList: [],
    cancelList: [],
    finshedList: [],
    notAcceptList: [],
    allList: [],
    totalPrice: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let showList = this.data.showList
    switch (options.from) {
      case "pay": 
        showList[1] = true
        this.setData({
          currentIndex: 1
        })
        wx.setNavigationBarTitle({
          title: this.data.titles[1] + "订单"
        })
      break;
      case "all":
        showList[0] = true
        this.setData({
          currentIndex: 0
        })
        wx.setNavigationBarTitle({
          title: this.data.titles[0] + "订单"
        })
      break;
      case "NotAccept":
        showList[2] = true
        this.setData({
          currentIndex: 2
        })
        wx.setNavigationBarTitle({
          title: this.data.titles[2] + "订单"
        })
      break;
    }
    this.setData({
      showList: showList
    })
    // 获取未支付数据
    let notPayList = wx.getStorageSync('notPayList') || []
    let length = []
    let totalPrice = []
    notPayList.forEach((element,index) => {
      length.push(element.length)
      totalPrice.push(0)
      element.forEach(item=> {
        totalPrice[index] += item.goods_price * item.num
      })
    })
    this.setData({
      totalPrice: totalPrice
    })
    // 取消订单数据
    let cancelList = wx.getStorageSync("cancelList")
    // 完成的订单
    let finshedList = wx.getStorageSync("finshedList")
    // 待收货数据
    let notAcceptList = wx.getStorageSync("notAcceptList")
    // 全部数据
    let allList = wx.getStorageSync("allList")
    this.setData({
      notPayList: notPayList,
      length: length,
      cancelList: cancelList,
      finshedList: finshedList,
      notAcceptList: notAcceptList,
      allList: allList
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '优品优购',
      code: "123456",
      imgUrl: "../../img/mao.jpg"
    }
  },

  // 获取点击的是第几个标签
  handleEvent(e) {
    let showList = [false,false,false,false,false]
    showList[e.detail.currentIndex] = true
    this.setData({
      showList, showList
    })
    switch (e.detail.currentIndex) {
      case 0:
        let allList = wx.getStorageSync("allList")
        this.setData({
          allList: allList
        })
        wx.setNavigationBarTitle({
          title: this.data.titles[e.detail.currentIndex] + "订单"
        })
      break;
      case 1:
        let notPayList = wx.getStorageSync("notPayList")
        this.setData({
          notPayList: notPayList
        })
      break;
      case 2:
        let notAcceptList = wx.getStorageSync("notAcceptList")
        this.setData({
          notAcceptList: notAcceptList
        })
      break;
      case 3:
        let finshedList = wx.getStorageSync("finshedList")
        this.setData({
          finshedList: finshedList
        })
      break;
      case 4:
        let cancelList = wx.getStorageSync("cancelList")
        this.setData({
          cancelList: cancelList
        })
      break;
    }
    wx.setNavigationBarTitle({
      title: this.data.titles[e.detail.currentIndex] + "订单"
    })
  },

  // 点击未支付界面的去支付按键
  goToPay(e) { 
    let equal = false
    let index = e.target.dataset.index
    let notPayList = wx.getStorageSync('notPayList') || []
    if ( notPayList.length === 0 ) {
      wx.showToast({
        title: '订单超时已不存在，请下拉刷新',
        icon: "none"
      })
    } else {
      notPayList.forEach(element=> {
        if (element[0].timer === this.data.notPayList[index][0].timer) {
          equal = true
        }
      })
      if ( equal ) {
        wx.showToast({
          title: '没有企业微信暂时无法实现支付功能,现在点击就算是支付成功',
          icon: "none"
        })
        setTimeout(()=> {
          this.setData({
            showList: [false,false,true,false,false],
            currentIndex: 2
          })
          // 同时跳转已完成界面，将数据放在放在本地缓存中
          let notPayList = this.data.notPayList
          let currentItem = notPayList[index]
          notPayList.splice(index,1)
          currentItem[0].totalPrice = this.data.totalPrice[index]
          let allList = wx.getStorageSync('allList') || []
          let notAcceptList = wx.getStorageSync('notAcceptList') || []
          currentItem[0].hasAccept = false
          currentItem[0].random = Math.random().toFixed(4)
          notAcceptList.unshift(currentItem)
          allList.unshift(currentItem)
          wx.setStorageSync('allList',allList)
          wx.setStorageSync('notAcceptList',notAcceptList)
          wx.setStorageSync('notPayList',notPayList)
          this.setData({
            notPayList: notPayList,
            notAcceptList: notAcceptList
          })
          wx.pageScrollTo({
            scrollTop: 0
          });
            
        },1000)
      } else {
        wx.showToast({
          title: '订单超时已不存在，请下拉刷新',
          icon: "none"
        })
      }

    }
  },

   // 下拉刷新待支付列表
  onPullDownRefresh() {
    this.setData({
      notPayList: wx.getStorageSync('notPayList')
    })
  },

  // 点击取消订单，进行订单删除，并将该订单作为取消订单放在取消订单中
  cancelIndent(e) {
    // 首先将取消的订单报讯在本地缓存中并删除
    let notPayList = this.data.notPayList
    let currentItem = notPayList[e.target.dataset.index]
    currentItem[0].totalPrice = this.data.totalPrice[e.target.dataset.index]
    notPayList.splice(e.target.dataset.index,1)
    this.setData({
      notPayList: notPayList
    })
    // 将定时器删除
    let app = getApp()
    app.clearTimeOut(currentItem[0].timer)
    // 更新本地缓存的数据
    wx.setStorageSync('notPayList',notPayList)
    // 添加取消列表的数据
    let cancelList = wx.getStorageSync('cancelList') || []
    let allList = wx.getStorageSync('allList') || []
    // 将新的数据放在前面
    cancelList.unshift(currentItem)
    currentItem[0].cancel = 1
    allList.unshift(currentItem)
    wx.setStorageSync('cancelList',cancelList)
    wx.setStorageSync('allList',allList)
    // 取消成功提示
    wx.showToast({
      title: "取消成功,可在订单界面查询取消订单",
      icon: "none"
    })
  },

  // 点击跳转具体页面
  navigateTo(e) {
    wx.navigateTo({
      url: "../../pages/goods_detail/goods_detail?goods_id=" + e.target.dataset.id
    })
  },

  // 全部订单中的再次购买
  payAgainFromAll(e) {
    console.log(e.target.dataset.index);
    let index = e.target.dataset.index
    // 点击再次购买只需要回到pay界面。同时将选中的数据放在缓存中即可
    console.log(this.data.allList[index]);
    wx.setStorageSync('buyAgain',this.data.allList[index])
    wx.navigateTo({
      url: "../../pages/pay/pay?from=all"
    })
  },


  // 已完成界面的再次购买
  payAgainFromFinshed(e) {
    console.log(e.target.dataset.index);
    let index = e.target.dataset.index
    // 点击再次购买只需要回到pay界面。同时将选中的数据放在缓存中即可
    console.log(this.data.finshedList[index]);
    wx.setStorageSync('buyAgain',this.data.finshedList[index])
    wx.navigateTo({
      url: "../../pages/pay/pay?from=finished"
    })
  },


  // 取消界面再次购买
  payAgainFromCancel(e) {
    console.log(e.target.dataset.index);
    let index = e.target.dataset.index
    // 点击再次购买只需要回到pay界面。同时将选中的数据放在缓存中即可
    console.log(this.data.cancelList[index]);
    wx.setStorageSync('buyAgain',this.data.cancelList[index])
    wx.navigateTo({
      url: "../../pages/pay/pay?from=cancel"
    })
    
  },


  // 点击确认收货
  hasAccept(e) {
    let index = e.target.dataset.index
    let notAcceptList = wx.getStorageSync('notAcceptList')
    // 点击确认收货之后，将数据在未收货界面删除，添加到已完成界面，同时将全部订单中的对应的未收货标签去掉，改为已完成

    let finshedList = this.data.finshedList || []
    console.log(Array.isArray(finshedList));
    finshedList.unshift(notAcceptList[index])
    let allList = wx.getStorageSync('allList')
    allList.forEach(item=> {
      if ( item[0].random === notAcceptList[e.target.dataset.index][0].random) {
        item[0].hasAccept = true
      }
      
    })
    notAcceptList.splice(index,1)
    this.setData({
      notAcceptList: notAcceptList,
      allList: allList
    })
    wx.setStorageSync('allList',allList)
    wx.setStorageSync('notAcceptList',notAcceptList)
    wx.setStorageSync('finshedList',finshedList)
  },
  
  // 点击未收货去到未收货界面
  goToNotPay() {
    this.setData({
      currentIndex: 2,
      showList: [false,false,true,false,false],
      notAcceptList: wx.getStorageSync('notAcceptList')
    })
    wx.setNavigationBarTitle({
      title: "未收货订单"
    })
  },
  

  // 点击已完成去到已完成界面
  goToHasPay() {
    this.setData({
      currentIndex: 3,
      showList: [false,false,false,true,false],
      finshedList: wx.getStorageSync('finshedList')
    })
    wx.setNavigationBarTitle({
      title: "已完成订单"
    })
  },
  
  // 点击已取消去到取消界面
  goToHasCancel() {
    this.setData({
      currentIndex: 4,
      showList: [false,false,false,false,true],
      cancelList: wx.getStorageSync('cancelList')
    })
    wx.setNavigationBarTitle({
      title: "已取消订单"
    })
  }
  

    
})