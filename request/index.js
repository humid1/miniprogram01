export const request = (param) => {
  return new Promise( (resolve,reject) => {
    var reqTask = wx.request({
      ...param,
      success: (result)=>{
        resolve(result);    
      },
      fail: (err)=>{ 
        reject(err);
      }
    });
  })
}