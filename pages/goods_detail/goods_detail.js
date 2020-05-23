/**
 * 1.发送请求获取数据
 * 2.点击轮播图，预览大图
 * 3.点击加入购物车
 *  先绑定点击事件
 *  获取缓存中的购物车数据-数组格式
 *  先判断，当前商品是否已经存在购物车
 *    存在，修改商品数据，执行购物车商品数量 ++，重新把购物车数据，填充到缓存中
 *    不存在购物车，直接给购物车添加一个新元素
 */
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
  GoodInfo: {},
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
      this.GoodInfo = res.data.message;
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
    const urls = this.GoodInfo.pics.map( v => v.pics_mid);
    // 接收传递过来的图片URL
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  // 点击 加入购物车
  handleCartAdd(e) {
    // 1.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodInfo.goods_id);
    if(index === -1) {
      // 第一次添加
      this.GoodInfo.num = 1;
      this.GoodInfo.checked = true
      cart.push(this.GoodInfo)
    } else {
      // 存在该商品数据
      cart[index].num++;
    }
    // 3.把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart);
    // 4.弹框提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 添加遮罩层，防止频繁点击
      mask: true
    })
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