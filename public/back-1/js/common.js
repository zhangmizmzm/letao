// 每个页面的进度条和侧边栏、头部功能相同，都放入common.js中

 // ajax全局事件(给全局document注册)
  // .ajaxComplete() 这个事件将在每个 ajax 完成时调用  (不管成功还是失败, 都会调用)
  // .ajaxSuccess()  在每个 ajax 成功时调用
  // .ajaxError()    将在每个 ajax 失败时调用
  // .ajaxSend()     在每个 ajax 发送前调用

  // .ajaxStart()    在第一个 ajax 开始发送时调用
  // .ajaxStop()     在所有的 ajax 请求完成后调用


// 进度条功能===>有ajax的全局事件不能写入入口函数
  //  思路:ajax开始/结束 事件 ====》全局的事件===>给全局document注册
  //  ajax开始发送请求时，开启进度条  ajax请求全部时，结束进度条
  //  引入了nprogress.js文件后，就有了一个全局对象NProgress对象
      //开启进度条 NProgress.start();
      //关闭进度条 NProgress.done();

    $(document).ajaxStart(function(){
      // 第一个ajax发送时就开启进度条
      NProgress.start();
    });
    $(document).ajaxStop(function(){
      // 所有ajax结束就结束进度条  定时器实现延时的效果
     setTimeout( function(){
      NProgress.done();
     },500)
    })
 