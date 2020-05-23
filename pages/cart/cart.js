/**
 * 1.获取用户收货地址
 *    绑定点击事件
 *    调用小程序内置 api 获取用户收货地址 wx.chooseAddress()
 * 2.获取用户对小程序授权 获取地址 权限状态
 *    wx.getSetting()
 *    假设用户 点击获取收货地址的提示框 确定(可直接调用获取收货地址)
 *      scope.address 值 true
 *    假设用户 从未调用过 收货地址的 api  (可直接调用获取收货地址)  
 *      scope undefined
 *    假设用户 点击获取收货地址的提示框 取消
 *      scope.address 值 false
 *    打开设置界面，引导用户开启获取收货地址授权 wx.openSetting()
 * 3.页面加载完毕
 *    onShow()
 *    获取本地存储的地址数据
 *    把数据设置给 data 中的一个变量
 * 4.获取缓存中的商品数据
 *    商品详情页，添加购物车所需的额外值 num checked
 * 5.全选的实现，数据展示
 *    onShow 获取缓存中的购物车数据
 *    根据购物车中的商品数据，所有商品都被选中 checked=true   
 */
import { getSetting,openSetting,chooseAddress } from '../../utils/asyncWx';
import regeneratorRuntime from '../../lib/runtime/runtime';
// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取微信缓存中的数据（生产环境是获取后台数据） 
   */
  onShow() {
    // 1.获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 2.获取缓存中的商品数据
    const cart = wx.getStorageSync('cart') || [];
    // 3.计算全选
    // every 数组方法，会遍历，会接收一个回调函数，那么每一个回调函数都返回 true，那么every 方法的返回值为 true
    // 只要有一个回调函数返回了 false，那么就不会在循环执行，直接返回 false
    const allChecked = cart.length ? cart.every(v => v.checked) : false;
    // 给data赋值
    this.setData({
      address,
      cart,
      allChecked
    })
  },
  /**
   * 点击 获取收货地址 按钮
   */
  async handleChooseAddress(e) {
    // 1.获取 权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     // console.log(result)
    //     const scopeAddress = result.authSetting['scope.address'];
    //     if(scopeAddress === true || scopeAddress === undefined) {
    //       // 获取微信收货地址
    //       wx.chooseAddress({
    //         success: (result2)=>{
    //           console.log(result2)
    //         },
    //         fail: (err)=>{
    //           wx.showToast({
    //             title: '获取收货地址失败',
    //             icon: 'none'
    //           });
    //         }
    //       });
    //     } else {
    //       // 用户以前拒绝授权，引导用户打开权限页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           // 调用获取 收货地址代码
    //           wx.chooseAddress({
    //             success: (result2)=>{
    //               console.log(result2)
    //             },
    //             fail: (err)=>{
    //               wx.showToast({
    //                 title: '获取收货地址失败',
    //                 icon: 'none'
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
    // });

    // 封装为 Promise 语法
    // getSetting().then((res) => {
    //   const scopeAddress = res.authSetting['scope.address'];
    //   if(scopeAddress === true || scopeAddress === undefined) {
    //     return true;
    //   } else {
    //     return openSetting();
    //   }
    // }).then( res2 => {
    //   return chooseAddress();
    // }).then( res3 => {
    //   console.log(res3);
    // }, err => {
    //   wx.showToast({
    //     title: '获取收货地址失败',
    //     icon: 'none'
    //   });
    // })

    // async-await语法 （需在方法前加上 async）
    // 1.获取 权限状态
    try{
      const res = await getSetting();
      // 2.判断权限状态
      if(res.authSetting['scope.address'] === false) {
        // 用户以前拒绝授权，引导用户打开权限页面
        await openSetting();
      }
      // 3.获取收货地址信息
      let address = await chooseAddress().catch(err => {
        wx.showToast({
          title: '获取收货地址失败',
          icon: 'none'
        });
      });
      // 4.存入到缓存中
      // console.log(address);
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync('address', address)

    } catch(err) {
      console.log(err);
    }
  }
})