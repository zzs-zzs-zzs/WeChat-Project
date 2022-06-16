// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  onShow() {
    let history = wx.getStorageSync('history') || list
    this.setData({
      list: history
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
   }

})