$(function () {
    // 登录框
    $('#link_reg').on('click', function () {
        $('.login').hide()
        $('.register').show()

    })
    // 注册框
    $('#link_login').on('click', function () {
        $('.register').hide()
        $('.login').show()
    })
    // 表单校验
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6-12位，不能出现空格'],
        repwd: function (value) {
            // 确认密码规则就是拿到第一次输入的密码跟本次输入的进行对比
            var firstpwd = $('#firstpwd').val();
            if ( firstpwd === value ) {
                // layer.msg('注册成功，去登录吧！'); 
                // $('#link_login').click()
            } else {
                // layer.msg('您两次输入的密码不一致哦！'); 
                return '您两次输入的密码不一致哦！'
            }
        }
    })
    // 提交并监听注册的请求
    $('.register').on('submit', function (e) {
        console.log(666);
        // 阻止默认提交行为
        e.preventDefault();
        var data = $(this).serialize();
        $.ajax({
        type: "POST",
        url: "/api/reguser",
        data: data,
        success: function (res) {
            if (res.status!==0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            $('#link_login').click()
            }
        });
       
    })
     // 触发登录表单的 submit 事件
  $('.login').on('submit', function(e) {
      e.preventDefault();
    // 实现登录功能
      var data = $(this).serialize();
    $.ajax({
        type: "post",
        url: "/api/login",
        data: data,
        success: function (res) {
            if (res.status !== 0) {
                // 登录失败
                return layer.msg(res.message)
              }
              layer.msg('登录成功！')
              // 将 token 令牌存储到客户端本地
              localStorage.setItem('token', res.token)
              // 跳转到后台主页
              location.href = 'index.html'
        }
    });
  })

})