// 注意：每次调用$.ajax get post的时候会先调用ajaxprefilter这个函数
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 为有权限的接口统一加header请求头
    if (options.url.includes('/my/')) {
    options.headers = {
        Authorization:localStorage.getItem('token')||''
        }
    }
    // 全局统一挂载 complete 回调函数 监控 ajax 请求完是否身份验证失败
    options.complete = function (res) {
        // console.log(res);
        if (res.responseJSON.status !== 0 && res.responseJSON.message === '身份认证失败！') {
            return location.href = 'login.html'
        }
    }
        
        
        
})