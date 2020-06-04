// components/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: String,
      value: ''
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
    handDelImg(e) {
      const {imgUrl} = e.currentTarget.dataset;
      this.triggerEvent("delImg", imgUrl)
    }
  }
})
