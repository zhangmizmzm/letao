
$(function(){

//功能1- 动态渲染一级分类名
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    dataType:'json',
    success:function(info){
      console.log(info);
      var htmlStr=template('fisrt-tmp',info);
      $('.lt_category_left ul').html(htmlStr)
      // 初始化也要渲染出第一个一级分类对应的二级分类
      renderById(info.rows[0].id)
    }
  })

// 功能2：给a注册点击事件（事件委托）点击a 渲染对应二级分类的图片
    // (根据当前点击的id渲染，id不同且要渲染多次===>封装渲染方法)

  $('.lt_category_left ul').on('click','a',function(){
    // 当前添加高亮，其他移除
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');
    var id=$(this).data('id');
    renderById(id)
  })

// 封装渲染二级分类的方法===>通过id渲染
  function renderById(id){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{id:id},
      dataType:'json',
      success:function(info){
        console.log(info);
        var htmlStr=template('second-tmp',info);
        $('.lt_category_right ul').html(htmlStr)    
      }
    })
  }

})