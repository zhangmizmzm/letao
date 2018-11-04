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
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        // 结合模板引擎渲染
        var str=template('second-tmp',info);
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


// 功能2 点击添加分类 显示模态框 ajax请求动态渲染下拉框ul中一级分类名
  $('#addcate').click(function(){
    $('#second-catemodal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{//数据写死
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(info){
        console.log(info);
        // 渲染
        var str=template('dropdown-tmp',info);
        $('.dropdown-menu').html(str);
      }
    })
  });

// 功能3：下拉菜单中a注册点击事件===>a是动态生成的，所以注册事件委托
$('.dropdown-menu').on('click','a',function(){
  // 获取a的文本设置给button
  $('#dropText').text( $(this).text() )
  // 将当前点击的a 标签的分类id给隐藏域的value(用于提交数据,后台接口规定categoryId是所属一级分类名对应的id) 
  id=$(this).data('id');
  $('[name="categoryId"]').val(id);
  // 点击选择类名===>不为空，设置校验成功
  $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');

})

// 功能4：配置文件上传插件（表单校验中需要校验图片状态，所以要先配置）
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      // 获取图片路径
      var picUrl=data.result.picAddr
      // 将路径设置给img
      $('#second-catemodal img').attr('src',picUrl);
      // 将路径设置给隐藏域  ==》提交数据
      $('[name="brandLogo"]').val(picUrl);
      // 上传了图片===>不为空，设置校验成功
  $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    }
  });

// 功能5 表单校验初始化
$('#form').bootstrapValidator({
   //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
   excluded: [],//有隐藏域时，必须要配置
  //2- 配置图标
  //指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
  },
  // 校验字段名，对应的是name属性
  fields:{
    // name属性  表单才有name 属性，不是表单要手动添加隐藏域，设置name属性
    categoryId:{
      validators:{
        notEmpty:{
          message:'请选择一级分类'
        }
      }
    },
    brandName:{
      // 校验器：校验提示要求
      validators:{
        notEmpty:{
          message:'请输入二级分类'
        }
      }
    },
    brandLogo:{
      // 校验器：校验提示要求
      validators:{
        notEmpty:{
          message:'请选择图片'
        }
      }
    }

  }
});

// 功能6 注册表单成功事件
 $("#form").on('success.form.bv', function (e) {    
   e.preventDefault();    
   //ajax将表单数据提交 .serialize()整体提交===>有name属性提交 
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:$("#form").serialize(),
      dataType:'json',
      success:function(info){
        if(info.success){
          $('#second-catemodal').modal('hide');
          // 重新渲染第一页  添加了数据
          currentPage=1;
          render();
          // 重置表单
          $('#form').data('bootstrapValidator').resetForm(true)
          // 手动设置 图片 和下拉框
          $('#dropText').text( '请选择一级分类' );
          $('#second-catemodal img').attr('src','./images/none.png')
        }
      }
    })

  });
})