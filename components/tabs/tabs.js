// components/tabs.js
Component({
  options: {
    // 设置支持使用插槽
    multipleSlots:true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    titles: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toFather(e) {
      this.setData({
        currentIndex: e.target.dataset.index
      })
      this.triggerEvent('myEvent',{currentIndex:this.data.currentIndex})
    }
  }
})
