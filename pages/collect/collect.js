// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:["商品收藏","品牌收藏","店铺收藏"],
    currentIndex: 0,
    showList: [true,false,false],
    list: []
  },

  onLoad() {
    wx.showLoading({
      title:"加载中"
    })
    let collectList = wx.getStorageSync('collectList')
    this.setData({
      list: collectList
    })
    wx.hideLoading()
  },

  showIndex(e) {
    this.setData({
      currentIndex: e.detail.currentIndex
    })
  },
  showAll(){
    this.setData({
      showList: [true,false,false]
    })
  },
  showHot(){
    this.setData({
      showList: [false,true,false]
    })
  },
  showFeature(){
    this.setData({
      showList: [false,false,true]
    })
  },

  // 点击跳转具体页面
  navigateTo(e) {
    let collectList = wx.getStorageSync('collectList') || []
    let num = e.target.dataset.index
    let index = collectList.findIndex(v=>v.goods_id === this.data.list[num].goods_id)
    wx.navigateTo({
      url:"../../pages/goods_detail/goods_detail?goods_id=" + this.data.list[num].goods_id + "&index=" + index
      })
  },
  onShareAppMessage() {
    
  },
  // 分享到朋友圈
 onShareTimeline() {
   return {
     title: '优品优购',
     code: "123456",
     imgUrl: "../../img/mao.jpg"
   }
 }
  
})