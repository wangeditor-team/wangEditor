// table 菜单
_e(function (E, $) {

    E.createMenu(function (check) {
        var menuId = 'table';
        if (!check(menuId)) {
            return;
        }
        var editor = this;
        var lang = editor.config.lang;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,
            id: menuId,
            title: lang.table
        });

        // dropPanel 内容
        var $content = $('<div style="font-size: 14px; color: #666; text-align:right;"></div>');
        var $table = $('<table class="choose-table" style="margin-bottom:10px;margin-top:5px;">');
        var $row = $('<span>0</span>');
        var $rowspan = $('<span> 行 </span>');
        var $col = $('<span>0</span>');
        var $colspan = $('<span> 列</span>');
        var $tr;
        var i, j;

        // 创建一个n行n列的表格
        for (i = 0; i < 15; i++) {
            $tr = $('<tr index="' + (i + 1) + '">');
            for (j = 0; j < 20; j++) {
                $tr.append($('<td index="' + (j + 1) + '">'));
            }
            $table.append($tr);
        }
        $content.append($table);
        $content.append($row).append($rowspan).append($col).append($colspan);

        // 定义table事件
        $table.on('mouseenter', 'td', function (e) {
            var $currentTd = $(e.currentTarget);
            var currentTdIndex = $currentTd.attr('index');
            var $currentTr = $currentTd.parent();
            var currentTrIndex = $currentTr.attr('index');

            // 显示
            $row.text(currentTrIndex);
            $col.text(currentTdIndex);

            // 遍历设置背景颜色
            $table.find('tr').each(function () {
                var $tr = $(this);
                var trIndex = $tr.attr('index');
                if (parseInt(trIndex, 10) <= parseInt(currentTrIndex, 10)) {
                    // 该行需要可能需要设置背景色
                    $tr.find('td').each(function () {
                        var $td = $(this);
                        var tdIndex = $td.attr('index');
                        if (parseInt(tdIndex, 10) <= parseInt(currentTdIndex, 10)) {
                            // 需要设置背景色
                            $td.addClass('active');
                        } else {
                            // 需要移除背景色
                            $td.removeClass('active');
                        }
                    });
                } else {
                    // 改行不需要设置背景色
                    $tr.find('td').removeClass('active');
                }
            });
        }).on('mouseleave', function (e) {
            // mouseleave 删除背景色
            $table.find('td').removeClass('active');

            $row.text(0);
            $col.text(0);
        });

        // 插入表格
        $table.on('click', 'td', function (e) {
            var $currentTd = $(e.currentTarget);
            var currentTdIndex = $currentTd.attr('index');
            var $currentTr = $currentTd.parent();
            var currentTrIndex = $currentTr.attr('index');

            var rownum = parseInt(currentTrIndex, 10);
            var colnum = parseInt(currentTdIndex, 10);

            // -------- 拼接tabel html --------

            var i, j;
            var tableHtml = '<table>';
            for (i = 0; i < rownum; i++) {
                tableHtml += '<tr>';

                for (j = 0; j < colnum; j++) {
                    tableHtml += '<td><span>&nbsp;</span></td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</table>';

            // -------- 执行命令 --------
            editor.command(e, 'insertHtml', tableHtml);
        });

        // 创建 panel
        menu.dropPanel = new E.DropPanel(editor, menu, {
            $content: $content,
            width: 262
        });

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });

});