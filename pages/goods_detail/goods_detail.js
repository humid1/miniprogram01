import { request } from "../../request/index";

// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  // 构造商品对象
  GoodObj: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({ url:"/goods/detail", data: {goods_id} }).then( res => {
      const goodsObj = res.data.message;
      this.GoodObj = res.data.message;
      this.setData({
        goodsObj: {
          goods_name: goodsObj.goods_name,
          goods_price: goodsObj.goods_price,
          goods_number: goodsObj.goods_number,
          // iphone部分手机不支持 webp 图片格式
          // 后台进行修改 1.webp => 1.jpg
          goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics: goodsObj.pics,
          attrs: goodsObj.attrs
        }
      })
    })
  },
  // 点击轮播图 放大预览 
  handlePreviewImage(e) {
    // 先构造要预览的图片数组
    const urls = this.GoodObj.pics.map( v => v.pics_mid);
    // 接收传递过来的图片URL
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})