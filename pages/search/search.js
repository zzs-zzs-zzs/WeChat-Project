import {request} from '../../lib/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    list: [],
    timeId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击小图标显示相机
  showCamera() {
    wx.navigateTo({
      url:"../../pages/camera/camera"
    })
  },

  // 监听输入框数据
  bindinput(e) {
    this.setData({
      input: e.detail.value
    })
    clearTimeout(this.data.timeId)
    this.setData({
      timeId:setTimeout(()=>{
                this.request()
              },1000)
    })
  },

  // 请求数据
  request() {
    request({
          url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch",
          data:{
            query:this.data.input
          }
        })
        .then(res=> {
          this.setData({
            list: res.data.message
          })
        }) 
  },

  // 点击搜索
  search() {
    this.request()
  },

  // 点击跳转
  navigateTo(e){
    wx.navigateTo({
      url: '../../pages/goods_detail/goods_detail?goods_id=' + e.target.dataset.id
    });
      
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