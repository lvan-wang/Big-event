// 1.打开页面，页面初始化 --- 发请求去服务器拿数据然后渲染出来 【并优化了时间显示[事件过滤器，补零函数]】
// 2. 筛选功能的实现 --- 初始化分类显示界面 2.1 发请求服务器拿文章分类内容并使用模板引擎渲染页面【注意通知layui重新render】 2.2 监听筛选表单的submit事件，把收集到的文章分类及文章状态发给服务器，服务器给数据并重新渲染页面
// 3. 分页功能的实现 --- 利用layui分页实现；jump切换分页回调。obj表示当前分页所有参数，obj.curr当前页码给到q.pagenum
// 4. 删除文章功能的实现 --- 删除按钮是未来元素，应使用事件委托绑定事件，获取到点击按钮的那个文章的id【使用自定义属性 data-id】，发请求删除，并重新渲染页面列表
$(function () {
     // 定义一个查询参数对象q
     var q = {
        pagenum: 1,//页码值
        pagesize: 5,//每页显示项目数量
        cate_id: '',//文章分类的id
        state:''//文章状态
    }
    //获取文章列表数据
    function initTable() {
        $.ajax({
              method: 'GET',
              url: '/my/article/list',
              data: q,
              success: function(res) {
                    if (res.status !== 0) {
                         return layer.msg('获取文章列表失败！')
                    }
                    // 使用模板引擎渲染页面的数据
                    var htmlStr = template('tpl-table', res)
                    $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                    renderPage(res.total)
              }
        })
    }
    // 定义时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 使用时间过滤器-优化时间显示 通过template.defaults.imports定义过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var year = dt.getFullYear();
        var month = padZero(dt.getMonth() + 1);
        var day = padZero(dt.getDate());
        var hour = padZero(dt.getHours());
        var min = padZero(dt.getMinutes());
        var second = padZero(dt.getSeconds());
        return year + '-' + month + '-' + day + '\t' + hour + ':' + min + ':' + second;
    }

    
// 1.页面初始化
     initTable();
    
    
// 2.筛选功能
    initCate();
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name = state]').val()
        // 拿到之后给参数q
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })
    // 初始化文章分类显示界面
    function initCate() {
        // 发起请求获取并渲染文章分类的下拉选择框
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !==0) {
                    return layer.msg('获取分类数据失败')
                }
                 // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui重新渲染表单结构 内置方法render
                layui.form.render()
                // form.render()
            }
        });

    }

   
// 3.分页功能
    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;
            laypage.render({
                elem: 'pageBox',
                count: total,
                limit: q.pagesize,
                curr: q.pagenum,
                layout:['count','limit','prev','page','next','skip'],
                limits:[5,10,15,20],
                jump: function (obj, first) {
                    console.log(first);
                    console.log(obj.curr);
                    //将最新的页码值给到q
                    q.pagenum = obj.curr;
                    //首次不执行
                    if (!first) {
                        //do something
                        initTable()
                    }
                }

            });
        })
    }
    $('tbody').on('click','.btnEdit', function () {
        location.href = '/大事件项目/project/article/art_edit.html';
})

// 4.删除文章功能
    $('tbody').on('click', '.btn-del', function () {
        // 获取删除按钮的个数
        var len = $('#btnDel').length;
        // 获取文章id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    if (len === 1) {
                        q.pagenum = q.pagenum - 1;
                    }
                    initTable()
                }
            });
            layer.close(index);
          });
    })


















})

