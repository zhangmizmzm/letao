$(function () {

  var currentPage = 1; //当前页
  var pageSize = 5; //每页的条数
  //1- 已进入页面先渲染一次
  render();

  //2- 封装ajax请求后台渲染数据的方法  与分页插件相结合
  function render() {
    $.ajax({
      type: 'get',
      url: '/user/queryUser',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        //1- 后台返回的信息+模板引擎渲染页面 
        var str = template('tmp', info);
        $('tbody').html(str);
        //2- 配置插件  ==插件的数据是ajax请求得到的，配置插件写在渲染中
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //必填,bootstrap的版本
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (event, originalEvent, type, page) { //为当前页数（page）按钮绑定点击事件
            // 更新当前页
            currentPage = page; //page分页插件已经算好了
            // 重新渲染页面
            render();
          }
        });



      }
    })
  }

  //3- 点击启用/禁用按钮  确定时 修改状态 + 隐藏模态框 

  // 元素是动态渲染生成的 和 批量操作注册事件（效率高） 需要注册委托事件
  //思路：
  // 1- 点击启用/禁用获取 id 修改状态 显示模态框
  $('tbody').on('click', '.btn', function () {
    // 显示模态框
    $('#usermodal').modal('show');

    // 获取当前用户id 
    currentId = $(this).parent().data('id'); //.data()是JQ中获取自定义属性的方法 getAttrib
    //  判断isDelete 的值，根据按钮是否有btn-dange的类名判断 
    isDelete = $(this).hasClass('.btn-danger') ? 0 : 1;

    // 2- 点击确定按钮发送ajax请求 修改数据库（ajax 提交用户id isDelete值  后台自己会修改数据库 前端只负责渲染   ）
    $('#usermodal .sure').click(function(){
      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:currentId,
          isDelete:isDelete
        },
        dataType:'json',
        success:function(info){
         console.log(info);
        //  前端只负责根据后台信息渲染   修改数据库是后台的操作
         if(info.success){//{"success":true} 后台修改成功
          // 隐藏模态框
          $('#usermodal').modal('hide');
          // 重新渲染页面
          render()
         }
        }
      })
    })
  })


})