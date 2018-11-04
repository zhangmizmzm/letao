
// ajax请求 渲染页面  分页插件 对应页码数据的渲染
// 添加分类 添加到数据库  表单校验

$(function(){
// 功能1- ajax请求 渲染页面  分页插件 对应页码数据的渲染
  //1.1- 初始化
  var currentPage=1;//当前页
  var pageSize=5;//每页条数

  //1.2- 已进入页面调用渲染一次
  render();
  //1.3- 封装渲染的方法
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        // 结合模板引擎渲染
        var str=template('first-tmp',info);
        $('tbody').html(str);
        
        // 分页对应页码数据渲染
        // 配置分页插件
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,//必写，配置bootstrap版本
          currentPage:info.page,//当前页是后台返回的page
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(event, originalEvent, type,page){
            // 为当前点击的页码绑定事件
            // 更新当前页
            currentPage=page;
            // 重新渲染当前页
            render();
          }
        });
      }

    });
  }

// 功能2- 点击添加分类(显示模态框)  
  $('#addcate').click(function(){
    //1- 显示模态框
    $('#first-catemodal').modal('show');
  });
//功能3- 表单校验 初始化校验  
  $('#form').bootstrapValidator({
    //1- 配置图标
    //指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验字段名，对应的是name属性
    fields:{
      // name属性
      categoryName:{
        // 校验器：校验提示要求
        validators:{
          notEmpty:{
            message:'请输入一级分类'
          }
        }
      }
    }
  });
  
//功能4- 注册校验成功事件 校验成功事件中(阻止默认+ajax提交数据,重新渲染第一页)
    // submit不要注册点击事件 
  $('#form').on('success.form.bv',function(e){
        // 阻止表单默认提交
      e.preventDefault();

      // ajax提交
      $.ajax({
        type:'post',
        url:'/category/addTopCategory',
        data:$('#form').serialize(),
        dataType:'json',
        success:function(info){
          if(info.success){
            //1- 显示模态框
            $('#first-catemodal').modal('hide');
            //2- 重新渲染第一页
            currentPage=1;
            render();
            //3- 重置表单==>校验成功后重置
            $('#form').data('bootstrapValidator').resetForm(true);
          }
        }
      })
    });
    

})