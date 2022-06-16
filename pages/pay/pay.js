// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    adderssText: '',
    totalNum: '',
    totalPrice: '',
    show: false,
    weight: '',
    freight: 0,
    cart: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.from);
    // 来自购物车界面或者来自商品页面
    if ( typeof(options.from) === 'undefined') {
      console.log("me");
      let list = wx.getStorageSync('cart')
      this.data.cart =  wx.getStorageSync('cart')
      let list1 = []
      let weight = 0
      let totalPrice = 0
      let totalNum = 0
      let waitPay = {}
      // 判断是在商品界面直接跳转还是在购物车跳转
      if ( typeof(options.id) !== "undefined" ) {
        waitPay = wx.getStorageSync('waitPay')
        totalPrice = waitPay.goods_price * waitPay.num,
        totalNum = waitPay.num,
        weight = waitPay.goods_weight * waitPay.num
        list1.push(waitPay)
        wx.setStorageSync('waitPay',[])
      } else {
        for ( let i = 0; i < list.length; i++ ) {
          if ( list[i].checked ) {
            list1.push( list[i] )
            weight += list[i].num * list[i].goods_weight
            totalPrice += list[i].num * list[i].goods_price
            totalNum += list[i].num
          }
        }
      }
      if ( weight >200 ) {
        this.setData({
          freight: '运费公式待定'
        })
      }
      this.setData({
        list: list1,
        totalPrice: totalPrice,
        totalNum: totalNum,
        weight: weight
      })
    } else {
      // 来自订单界面的再次购买
      let totalPrice = 0
      let totalNum = 0
      let weight = 0
      let list = wx.getStorageSync('buyAgain')
      list.forEach(item=> {
        totalPrice += item.goods_price * item.num,
        totalNum += item.num,
        weight += item.goods_weight * item.num
      })
      this.setData({
        list: list,
        totalPrice: totalPrice,
        totalNum: totalNum,
        weight: weight
      })
      wx.setStorageSync("buyAgain",[])
    }
    
    

    // 页面加载的时候查看本地缓存是否存在默认地址，若存在直接显示地址，不存在才显示添加地址按钮
    let addressList = wx.getStorageSync('addressList') || []
    if ( typeof(addressList[0]) === "undefined") {
    } else {
      if ( addressList[0].default ) {
        this.setData({
          adderssText: addressList[0],
          show: true
        })
      }
    }

  },

  // 微信默认的收获地址方式,不用
  // 收货地址
  /* chooseAddress() {
    let that = this
    wx.chooseAddress({
      success (res) {
        that.setData({
          adderssText: res,
          show: true
        })
      }
    })
  }, */

  pay() {
    if ( this.data.adderssText === '' ) {
      wx.showToast({
        title:"请选择收货地址",
        icon: "none"
      })
    } else {
      // 用户登录获取code
      wx.login({
        timeout: 10000,
        success(res) {
          console.log(res.code);
        }
      })
      wx.showToast({
        title:"需要支付" + this.data.totalPrice + "元,该功能只有企业微信才能使用,暂时无法实现，所以这里将提交作为待支付订单",
        icon: "none"
      })
      // 同时在购物车中将商品移除

      let cart = this.data.cart
      for ( let j = 0; j <= this.data.list.length; j++) {
         cart.forEach((element,index) => {
          this.data.list.forEach((item)=> {
            if (element.goods_id === item.goods_id || element.goods_name === item.goods_name || element.goods_id === item.goods_introduce) {
              cart.splice(index,1)
            }
          })
        });
      }
     
      wx.setStorageSync('cart',cart)
      setTimeout(()=> {
        // 在跳转界面的时候，同时将这些商品作为待支付产片存进本地缓存中
        let notPayList = wx.getStorageSync('notPayList') || []
        let list = this.data.list
        list[0].timer = Math.random().toFixed(4)
        notPayList.unshift(list)
        wx.setStorageSync('notPayList',notPayList)
        // 同时给这个订单添加一个定时器，定时器设置在全局中
        let app = getApp()
        app.timeOut(notPayList[notPayList.length-1][0].timer)
        // 由于没有企业微信认证，只能将提交的订单作为待支付订单放在待支付页面中
        wx.redirectTo({
          url: "../../pages/indent/indent?from=pay" 
        })
      },1000)
    }
  },

  // 跳转收货地址界面
  navigateToAddress() {
    wx.navigateTo({
      url: "../../pages/address/address?from=" + "pay"
    })
  },
  // 应用推荐
  onShareAppMessage() {
  
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '优品优购',
      code: "123456",
      imgUrl: "../../img/mao.jpg"
    }
  },




})