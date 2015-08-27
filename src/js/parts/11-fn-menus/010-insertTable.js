'insertTable': {
    'title': '插入表格',
    'type': 'modal',
    'cssClass': 'icon-wangEditor-table',
    'modal': function(editor){
        var rowNumTxtId = $E.getUniqeId(),
            colNumTxtId = $E.getUniqeId(),
            titleCheckId = $E.getUniqeId(),
            btnId = $E.getUniqeId(),
            content = '<p>行数：<input id="' + rowNumTxtId + '" type="text" value="3"/></p>' + 
                        '<p>列数：<input id="' + colNumTxtId + '" type="text" value="5"/></p>' +
                        '<p>显示首行背景：<input id="' + titleCheckId + '" type="checkbox" checked="checked"/></p>' + 
                        '<p><button id="' + btnId + '"  type="button" class="wangEditor-modal-btn">插入表格</button></p>',
            $table_modal = $(
                $E.htmlTemplates.modalSmall.replace('{content}', content)
            );
        $table_modal.find('#' + btnId).click(function(e){
            //注意，该方法中的 $table_modal 不要跟其他modal中的变量名重复！！否则程序会混淆
            //具体原因还未查证？？？

            var rowNumValue = $('#' + rowNumTxtId).val(),
                rowNum = rowNumValue === '' || isNaN(+rowNumValue) ? 3 : rowNumValue,
                colNumValue = $('#' + colNumTxtId).val(),
                colNum = colNumValue === '' || isNaN(+colNumValue) ? 5 : colNumValue,
                firstRowBold = $('#' + titleCheckId).is(':checked'),

                table_callback = function(){
                    //inserttable callback
                    $('#' + rowNumTxtId).val('');
                    $('#' + colNumTxtId).val('');
                },

                i, j,
                //表格模板
                table = '',
                tableTemp = '<table border="1" bordercolor="#cccccc" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" > ${content} </table>',
                trArray = [],
                firstTrTemp = '<tr style="font-weight:bold;background-color:#f1f1f1;">${content}</tr>',
                trTemp = '<tr>${content}</tr>',
                tdArray,
                tdTemp_FirstRow = '<td style="min-width:100px; padding:5px;">&nbsp;</td>',
                tdTemp = '<td style="padding:5px;">&nbsp;</td>';
            
            for (i = 0; i < rowNum; i++) {
                //遍历每一行
                tdArray = [];
                for (j = 0; j < colNum; j++) {
                    //遍历本行的每一列
                    if(i === 0){
                        tdArray.push(tdTemp_FirstRow);  //第一行的td带宽度样式
                    }else{
                        tdArray.push(tdTemp);  //第二行往后的td不带宽度样式（没必要）
                    }
                }
                if (i === 0 && firstRowBold) {
                    trArray.push(firstTrTemp.replace('${content}', tdArray.join('')));
                } else {
                    trArray.push(trTemp.replace('${content}', tdArray.join('')));
                }
            }
            //生成table代码
            table = tableTemp.replace('${content}', trArray.join(''));

            //执行插入
            editor.command(e, 'insertHTML', table, table_callback);
        });
        return $table_modal;
    }
},