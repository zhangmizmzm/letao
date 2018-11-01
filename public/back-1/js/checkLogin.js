// 除登录页外，每个页面一进入页面前都要判断是否登陆过====>每个页面都要引入此js
// 登录保持有后台操作，前端仅需根据后台接口给的数据（请求后台），若未登录进行拦截即可（location到登录页）
$.ajax({
  type: 'get',
  url: '/employee/checkRootLogin',
  dataType: 'json',
  success: function (info) {
    if (info.error === 400) {
      location.href = 'login.html'
    }
    if (info.success) {
      console.log("当前用户已登录");
    }
  }

})