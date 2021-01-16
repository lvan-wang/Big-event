$(function () {
    initCate();
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

// 初始化富文本编辑器
    initEditor()

// 渲染封面裁剪区域
// 1. 初始化图片裁剪器
    var $image = $('#image')

// 2. 裁剪选项
    var options = {
      aspectRatio: 400 / 280,
      preview: '.img-preview'
    }

// 3. 初始化裁剪区域
    $image.cropper(options)

// 为选择封面按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    $('#coverFile').on('change', function (e) {
        if (e.target.files.length === 0) {
            return layer.msg('您还没有选择文件，请您选择文件')
        }
        var newImageURL = URL.createObjectURL(e.target.files[0]);
        // 为裁剪区域重新设置图片
        $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', newImageURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    })
// 发布&存为草稿功能
    // 为 `存为草稿` 按钮添加 `id` 属性,以区分是发布触发或者存为草稿触发
    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this)
        fd.append('state', art_state)
        $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 400,
          height: 280
        })
        .toBlob(function(blob) {
          // 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          // 5. 将文件对象，存储到 fd 中
          fd.append('cover_img', blob)
          // 6. 发起 ajax 数据请求
            publishArticle(fd)
        })
    })
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
           processData:false,
            success: function (res) {
               if (res.status !==0) {
                   return layer.msg('发布文章失败')
                } 
                layer.msg('发布文章成功')
                location.href = "/大事件项目/project/article/art_list.html";
            }
        });
    }
    
    

















})