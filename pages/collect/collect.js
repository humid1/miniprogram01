// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],
    // 商品收藏的数据
    collect: []
  },
  // 修改 isActive 状态
  handleItemChange(e) {
    // console.log(e);
    // 1.获取标签索引
    const {index} = e.detail;
    // 修改源数据
    let {tabs} = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive=true : v.isActive=false)
    this.setData({
      tabs
    })
  },
  onShow() {
    // 获取缓存中收藏数据
    const collect = wx.getStorageSync('collect') || [];
    this.setData({
      collect
    })
  }
})