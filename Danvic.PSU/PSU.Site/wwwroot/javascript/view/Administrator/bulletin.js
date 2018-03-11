﻿/*!
 *   Administrator Home Bulletin Page JavaScript v1.0.0
 *   Author: Danvic712
 */
//table
$.dataTableSetting = {
    "bSort": false,//关闭排序
    "serverSide": true,//服务器端加载数据
    "sServerMethod": "POST",//数据获取方式 
    "bDeferRender": true,//是否启用延迟加载
    "sScrollXInner": "100%",//表格宽度 
    "bLengthChange": false,//是否允许用户自定义分页大小
    "bFilter": false,//是否启用内置搜索功能
    "bStateSave": true,//cookies保存当前状态
    "bProcessing": true,//是否显示加载进度条
    "iDisplayLength": 15,//默认每页显示多少条记录
    "deferRender": true,
    "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_ 条记录",
        "sZeroRecords": "对不起，没有匹配的数据",
        "sInfo": "第 _START_ - _END_ 条 / 共 _TOTAL_ 条数据",
        "sInfoEmpty": "没有匹配的数据",
        "sInfoFiltered": "(数据表中共 _MAX_ 条记录)",
        "sProcessing": "正在加载中...",
        "sSearch": "全文搜索：",
        "oPaginate": {
            "sFirst": "第一页",
            "sPrevious": " 上一页 ",
            "sNext": " 下一页 ",
            "sLast": " 最后一页 "
        }
    },
    "paging": true,
    "processing": true,
    "columnDefs": [
        {
            "targets": 7,
            "data": null,
            "render": function (data, type, row) {
                var html = '<a id="detail" class="btn btn-xs btn-link" data-id=' + data.id + '>查看</a>' +
                    '<a id="edit" class="btn btn-xs btn-link" data-id=' + data.id + '>编辑</a>' +
                    '<a id="delete" class="btn btn-xs btn-link" data-id=' + data.id + '>删除</a>';
                return html;
            }
        }
    ],
    "columns": [
        { "data": "id" },
        { "data": "title" },
        { "data": "content" },
        { "data": "typeStr" },
        { "data": "targetStr" },
        { "data": "dateTime" },
        { "data": "publisher" }
    ],

    ajax: function (data, callback, settings) {
        var param = {};
        param.Limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
        param.Start = data.start;//开始的记录序号
        param.Page = (data.start / data.length) + 1;//当前页码
        param.STitle = $('#title').val();//公告标题
        param.SDateTime = $('#datetime').val();//发布时间
        param.SType = $('#type').val();//公告类型

        //ajax请求数据
        $.ajax({
            type: "POST",
            url: "/Administrator/Home/Search",
            cache: false,  //禁用缓存
            data: {
                search: JSON.stringify(param)
            },  //传入组装的参数
            dataType: "json",
            success: function (result) {
                //console.log(result);
                var returnData = {};
                returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                returnData.recordsTotal = result.total;//返回数据全部记录
                returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = result.data;//返回的数据列表
                //console.log(returnData);
                //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                callback(returnData);
            },
            error: function (msg) {
                console.log(msg.responseText);
            }
        });
    }
};

$(function () {
    //datetime
    $('.date-picker').datepicker({
        autoclose: true,
        todayHighlight: true,
        language: 'zh-CN',
        format: 'yyyy-mm-dd'
    });

    var dataTable = $('#bulletin-table').dataTable($.dataTableSetting);

    //search
    $(document).on('click', '#search', function () {
        dataTable.fnDestroy(false);
        dataTable = $('#bulletin-table').dataTable($.dataTableSetting);
    });

    //detail
    $(document).on('click', '#detail', function () {
        window.location.href = '/Administrator/Home/Detail/' + $(this).attr('data-id');
    });

    //edit
    $(document).on('click', '#edit', function () {
        window.location.href = '/Administrator/Home/Edit/' + $(this).attr('data-id');
    });

    //delete
    $(document).on('click', '#delete', function () {
        var id = $(this).attr('data-id');
        bootbox.confirm({
            message: '确定删除编号为<b class="text-red">' + id + '</b>的公告信息吗？',
            buttons: {
                confirm: {
                    label: '确定',
                    className: 'btn btn-success btn-flat'
                },
                cancel: {
                    label: '取消',
                    className: 'btn btn-default btn-flat'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        url: '/Administrator/Home/Delete',
                        type: 'POST',
                        dataType: 'Json',
                        data: {
                            id: id
                        },
                        success: function (result) {
                            bootbox.alert({
                                message: result.msg,
                                buttons: {
                                    ok: {
                                        label: '确定',
                                        className: 'btn bg-olive btn-flat margin'
                                    }
                                },
                                callback: function () {
                                    window.location = "/Administrator/Home/Bulletin";
                                }
                            });
                        },
                        error: function (msg) {
                            console.log(msg);
                        }
                    });
                }
            }
        })



    });
});