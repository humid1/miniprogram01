
// 同时发送异步代码的次数
let ajaxTime = 0;

export const request = (params) => {
  // 判断 url 中是否带有 /my/ 请求的是私有路径，带上 header token
  let header = {...params.header};
  if(params.url.includes('/my/')) {
    // 拼接 header，带上 token
    header['Authorization'] = wx.getStorageSync("token");      
  }

  ajaxTime ++;
  // 显示加载中效果
  wx.showLoading({
    title: '加载中'
  })
  // 定义公共的 url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise( (resolve,reject) => {
    var reqTask = wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      // 接口调用成功的回调函数
      success: (result)=>{
        resolve(result); 
      },
      // 接口调用失败的回调函数
      fail: (err)=>{ 
        reject(err);
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: () => {
        ajaxTime --;
        if(ajaxTime === 0) {
          // 关闭 加载中 图标
          wx.hideLoading();
        }
      }
    });
  })
}