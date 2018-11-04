67
$(function () {

  // 全局变量
  var currentPage = 1; //当前页
  var pageSize = 2; //每页条数
  var picArr = []; //存图片信息

  // 功能1: ajax请求渲染页面 + 分页插件渲染当前点击的页面
  // 已进入页面渲染一次
  render();

  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        // 1-渲染页面
        $('tbody').html(template('product-tmp', info));
        // 初始化分页插件并配置 
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (event, originalEvent, type, page) {
            // page==>当前点击的页码
            //更新当前页并重新渲染当前页
            currentPage = page;
            render();
          }
        })
      }

    })
  }


  // 功能2：点击添加分类按钮 显示模态框 渲染下拉框（ajax请求）
  $('#addProduct').click(function () {
    $('#product-catemodal').modal('show');
    // 查询二级分类渲染(二级分类接口) 下拉框提交的数据写死，page:1 pageSize:100
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $('.dropdown-menu').html(template('down', info))

      }
    })
  });

  // 功能3：给下拉框中的a注册点击事件，将当前点击的a的内容设置给button显示的文本，设置隐藏域的name为brandId的值（用于向后台提交数据）
  // a是动态生成的，用事件委托

  $('.dropdown-menu').on('click', 'a', function () {
    // 将当前点击的a的内容设置给button显示的文本
    var txt = $(this).text();
    $('#dropText').text(txt);

    // 将当前点击的二级分类品牌的id设置给对应隐藏域name=brandId 的value提交给后台
    $('[name="brandId"]').val($(this).data('id'));
    // 手动设置校验状态更新为成功
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  });


//功能4： 配置文件上传插件====>在初始校验前，因为要先手动设置更新图片的校验状态成功
  // 思路：上传三张图片，最后上传的显示在最前，多了则删除最后一张
  // 1-获取图片对象，此对象存的是图片的信息，将图片对象(信息)前加到数组中
  // 2-通过图片对象获取图片路径，图片盒子向前追加img元素==>prepend(img结构)，同时将路径拼接在结构中
  // 3-若数组长度>3,数组后删最后一个，图片盒子后山后面一个img(指定元素选择器)
  // 4- 数组长度===3，手动设置校验状态更新为成功===>js添加图片，为未更改input状态，不设置，初始化校验认为没传图

  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, data) {
      //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
      console.log(data);
      
      var picObj = data.result;
      var picUrl = data.result.picAddr;
      // 将图片对象(信息)前加到数组中
      picArr.unshift(picObj);
      // 图片盒子向前追加img元素==>prepend(img结构)，同时将路径拼接在结构中
      $('#imgBox').prepend('<img src=' + picUrl + ' alt="">');
      if(picArr.length>3){
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if(picArr.length===3){
        // 手动设置校验状态更新为成功
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
    }
  });

// 功能5：表单校验初始化
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      proName:{
        validators:{
          notEmpty:{
            message:'请输入名称' 
          }
        }
      },
      brandId:{
        validators:{
          notEmpty:{
            message:'请选择二级分类' 
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:'请输入描述' 
          }
        }
      },
      // 要求库存必须是非零开头的数字
      num:{
        validators:{
          notEmpty:{
            message:'请输入库存' 
          },
           // 正则校验  \d 表示数字 [0-9]
          // \d 出现 0次或多次
          // * 表示 0 次或多次
          // ? 表示 0 次或1次
          // + 表示 1 次或多次
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '库存格式要求是非零开头的数字'
          }
        }
      },
       // 要求尺码是  xx-xx 的格式,  xx 表示数字
      size: {
        validators: {
          // 非空校验
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式必须是 xx-xx 的格式, 例如: 32-40'
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:'请输入现价' 
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:'请输入原价' 
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:'请选择3张图片' 
          }
        }
      }

    }
  });

// 功能6：注册表单验证成功事件
  $('#form').on('success.form.bv',function(e){
    // 阻止默认提交
    e.preventDefault();

    // 拼接数据
    var dataStr=$('#form').serialize();
    dataStr+='&picName1='+picArr[0].picName+'&picAddr1='+picArr[0].picAddr;
    dataStr+='&picName2='+picArr[1].picName+'&picAddr2='+picArr[1].picAddr;
    dataStr+='&picName3='+picArr[2].picName+'&picAddr2='+picArr[2].picAddr;
    // ajax提交，重新渲染第一页
    

    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:dataStr,
      dataType:'json',
      success:function(info){
        // 提交数据成功,关闭模态框 重新渲染第一页
        if(info.success){
          $('#product-catemodal').modal('hide');
          currentPage=1;
          render();

          // 重置表单
          $('#form').data('bootstrapValidator').resetForm(true)
        // 手动重置文本和图片
        $('#dropText').text("请选择二级分类");
        $('#imgBox img').remove();
        }
      }
    })

  })
})