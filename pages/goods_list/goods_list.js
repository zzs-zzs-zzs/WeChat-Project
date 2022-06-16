// pages/goodsList/goodsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    titles: ["组合","销量","价格"],
    list:[],
    getData: {
      pagenum: 1,
      cid: '',
      pagesize:10,
      query:''
    },
    totalPages: 1,
    url: '',
    count: 0
  },
 
  // 获取数据
  getData() {
    let that = this
    wx.request({
      url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
      data: that.data.getData,
      success(res) {
        that.data.totalPages = res.data.message.total / that.data.getData.pagesize
        that.setData({
          list: [...that.data.list,...res.data.message.goods]
        })
        wx.stopPullDownRefresh()
      },
      fail() {
        console.log('error')
      }
     })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.getData.cid = options.cid || ''
    this.data.getData.query = options.query || ''
    this.getData()
  },

  onPullDownRefresh() {
    this.setData({
      getData: {
        pagenum: 1,
        cid: '',
        pagesize:10,
        query:''
      },
    }),
    this.getData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      getData: {
        pagenum: this.data.getData.pagenum+1,
        cid: '',
        pagesize:10,
        query:''
      },
    }),
    this.getData()
  },
  showIndex(e) {
    this.setData({
      currentIndex: e.detail.currentIndex
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