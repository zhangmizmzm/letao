
$(function(){
//功能1-  初始化表单校验=====>图标显示+提示信息
  //  bootstrap-validator插件会在表单提交的时候进行校验，如果校验成功了，表单会继续提交，但是如果校验失败了，就会阻止表单的提交。
      // 校验规则：
      // 1-用户名不能为空, 密码不能为空====>非空提示
      // 2-长度为2-6位长度为6-12位=====>长度校验
      // 以上是初始化表单校验
      // 3-用户名不存在也须提示=====>为配置ajax回调的提示（用户名是否存在要根据ajax请求的后台返回的信息判断）


  $('#form').bootstrapValidator({
    //1- 配置图标
      //指定校验时的图标显示，默认是bootstrap风格
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

     //2- 指定校验字段=====>input表单必须有name属性
      fields: {
        //2.1- 校验用户名，对应name表单的name属性(若无name属性，无校验的样式)
        username: {
          // 用户名表单校验的规则====>validators（验证器），属性是检验的规则
          validators: {
            //规则1- 不能为空
            notEmpty: {  
              message: '用户名不能为空'// ===>提示信息
            },
            //规则2- 长度校验
            stringLength: {
              min: 2,
              max: 6,
              message: '用户名长度必须在2-6位之间'//===>提示信息
            },
            callback:{
              message: '用户名不存在'
            }
          }
        },

        //2.2- 校验密码，对应name表单的name属性(若无name属性，无校验的样式)
        password: {
          // 密码表单校验的规则====>validators
          validators: {
            //规则1 不能为空
            notEmpty: {
              // 非空提示
              message: '用户名不能为空'
            },
            //规则2 长度校验
            stringLength: {
              min: 6,
              max: 12,
              message: '用户名长度必须在6-12位之间'
            },
            callback:{
              message: '密码错误'
            }
          }
        }
      }
  });



// 功能2 登录功能  注册表单成功事件(success.form.bv)===>即初始化成功  

  //2.1 通过ajax提交，所以在事件中要阻止submit表单提交的默认事件（事件对象e）
  //2.2 点击登录时，发送ajax请求，根据后台的数据渲染，
  // 若用户名密码正确登录成功，跳转首页
  // 若用户名或密码不正确，根据返回的信息更新校验状态和提示信息
  $('#form').on('success.form.bv',function(e){
    //2.1 通过ajax提交，所以在事件中要阻止submit表单提交的默认事件（事件对象e）
    e.preventDefault();
    //2.2 发送ajax请求===>看接口文档
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),//表单序列化获取表单数据
      dataType:'json',
      success:function(info){
        console.log(info);
        // 若用户名密码正确登录成功，跳转首页  info==>{success: true}
        if(info.success){
          location.href='index.html';
        }
        // 若用户名或密码不正确(校验失败)，根据返回的信息更新校验状态和提示信息
        // 密码错误 ===>info  {error: 1001, message: "密码错误！"}
        if(info.error===1001){
          //获取插件的实例，用实例调用插件的方法===>更新校验表单状态的方法
          // 用updateStatus(field, status, validatorName)方法更新字段的状态
          // 实例 $(form).data('bootstrapValidator');
          // status的值有：- NOT_VALIDATED：未校验的- VALIDATING：校验中的- INVALID ：校验失败的- VALID：校验成功的。

          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback')
        }
        if(info.error===1000){
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback')
        }
      }

    })
  });


// 功能3  重置表单

$('[type="reset"]').click(function(){
   // 调用实例的方法, 重置校验状态和内容
    // resetForm 传true, 内容和校验状态都重置
    //           不传true, 只重置校验状态,但reset按钮可以重置表单内容，可以不传内容
  $('#form').data("bootstrapValidator").resetForm(true);
})


})
