// 注意：每次调用$.ajax get post的时候会先调用ajaxprefilter这个函数
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})