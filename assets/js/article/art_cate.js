$(function () {
    initArtCateList() 
    // 给添加类别按钮绑定点击事件出现弹出层
    var indexadd = null;
    $('#btnAddCate').on('click', function () {
        // 利用layui实现
        indexadd = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content:$('#dialog-add').html()
        })
    })
    // 使用代理 监听表单submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data:$(this).serialize(),
            success: function (res) {
               if (res.status !== 0) {
                   return layer.msg('新增文章分类失败！')
                } 
                layer.msg('新增文章分类成功！')
                initArtCateList()
                layer.close(indexadd)
            }
        });
    })
    // 修改文章类别
    var indexedit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexedit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content:$('#dialog-edit').html()
        })
        // 获取当前列表信息 写入对应框中
        var id = $(this).attr('data-id')
        $.ajax({
            type: "GET",
            url: "/my/article/cates/"+id,
            success: function (res) {
               if (res.status !== 0) {
                   return layer.msg('获取文章分类数据失败')
                } 
                // $('#form-edit').val(res.data)??
                var form = layui.form;
                form.val('editDialog', res.data);
               
            }
        });
    })
    // 修改后再发请求重新渲染页面
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data:$(this).serialize(),
            success: function (res) {
               if (res.status !== 0) {
                   return layer.msg('更新分类信息失败！')
                } 
                layer.msg('更新分类信息成功！')
                initArtCateList()
                layer.close(indexedit)
            }
        });
    })
    // 删除功能
    var indexdel = null;
    $('tbody').on('click', '#btnDel', function () {
        var id = $(this).attr('data-id');
       indexdel = layer.confirm('确认要删除吗?', {icon: 3, title:'提示'}, function(indexdel){
        //do something
        $.ajax({
            type: "GET",
            url: "/my/article/deletecate/"+id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败！')
                }
                layer.msg('删除文章分类成功！')
                initArtCateList()
                layer.close(indexdel);
            }
        });
        
      });
    })
    
})


// 获取文章分类的列表的函数封装
function initArtCateList() {
    // 发起请求
    $.ajax({
        type: "GET",
        url: "/my/article/cates",
        success: function (res) {
            var htmltr = template('tpl-table', res)
            $('tbody').html(htmltr)
        }
    });
}