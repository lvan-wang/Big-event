$(function () {
    // console.log(666);
    // 表单验证
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        rePwd: function (value) {
            if (value!==$('#newpwd').val()) {
                return '两次输入的密码不一致'
            }
        },
        samePwd: function (value) {
            if (value===$('#oldpwd').val()) {
                return '新密码和旧密码不能相同'
            }
        }
    })
    // 发起请求，修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data:$(this).serialize(),
            success: function (res) {
                if (res.status!==0) {
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                $('.layui-form')[0].reset()
            }
        });
   })
})