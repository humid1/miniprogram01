/**
 * 1.发送请求获取数据
 * 2.点击轮播图，预览大图
 * 3.点击加入购物车
 *  先绑定点击事件
 *  获取缓存中的购物车数据-数组格式
 *  先判断，当前商品是否已经存在购物车
 *    存在，修改商品数据，执行购物车商品数量 ++，重新把购物车数据，填充到缓存中
 *    不存在购物车，直接给购物车添加一个新元素
 * 4.商品收藏功能
 *    页面 onShow的时候加载，缓存中的数据
 *    判断当前页面商品是不是被收藏
 *        是，改变页面的图标
 *        否，
 *    点击商品收藏按钮，判断该商品是否存在于缓存数组中
 *        已经存在，把商品删除
 *        没有存在，把商品添加到收藏数组中，存入缓存中即可
 */
import { request } from "../../request/index";

// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 构造商品对象
  GoodInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {goods_id} = options;
    // this.getGoodsDetail(goods_id);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let {goods_id} = currentPage.options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({ url:"/goods/detail", data: {goods_id} }).then( res => {
      const goodsObj = res.data.message;
      this.GoodInfo = res.data.message;
      // 1.获取缓存中的商品收藏数组
      let collect = wx.getStorageSync("collect") || [];
      // 2.判断当前商品是否被收藏
      let isCollect = collect.some( v=> v.goods_id === this.GoodInfo.goods_id );
      
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
        },
        isCollect
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
  // 点击收藏按钮触发的事件
  handleCollect() {
    // let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex( v => v.goods_id === this.GoodInfo.goods_id);
    // 3.当index !== -1 表示已经收藏过
    let title = "收藏成功";
    if(index !== -1) {
      // 表示已经收藏过,需要移除
      collect.splice(index, 1);
      title = "取消收藏";
    } else {
      // 没有收藏过，添加到缓存中
      collect.push(this.GoodInfo);
    }
    wx.showToast({
      title,
      icon: 'success',
      mask: true
    })
    // 4.把数组存入缓存中
    wx.setStorageSync('collect', collect);
    // 5.修改 data 中的属性
    this.setData({
      isCollect: !this.data.isCollect
    })
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