$(function () {
    getUserInfo()
    $('#btnlogout').on('click', function () {
        layer.confirm('确定退出登录 ?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href='login.html'
            layer.close(index);
          });
    })
})
// 封装一个获取用户基本信息的函数
function getUserInfo () {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization:localStorage.getItem('token')||''
        // },
        success: function (res) {
            // console.log(111);
            console.log(res); 
            if (res.status!==0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            renderAvatar(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status!==0) {
        //         return location.href='login.html'
        //     }
        // }
    });
}

// 渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic!==null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}