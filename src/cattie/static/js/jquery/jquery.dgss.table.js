;(function ($) {

    var Table = function (ele, opt) {
        this.$element = ele;
        this.defaults = {
            autoLoad:true
        };
        this.options = $.extend({}, this.defaults, opt);
    };

    //定义私有方法
    Table.prototype = (function () {
        function renderSingleDate(bar) {
            var day = '<input type="hidden" id="' + bar.name + '" name="' + bar.name + '"/>';
            $("#dgss_SearchForm").append(day);

            var picker = '<div class="form-group">'
                + '<div class="global-datePicker">'
                + '<a href="javascript:;" class="btn btn-default dropdown pull-right" id="SelDate">'
                + '<i class="glyphicon glyphicon-calendar"></i> <span id="select-date-span"></span>'
                + '</a>'
                + '</div>'
                + '</div>';

            $("#dgss_SearchForm").append(picker+'\n');

            if (bar.displayDate) {
                $("#select-date-span").text(bar.displayDate);
            } else {
                $("#select-date-span").text(moment().format('YYYY-MM-DD'));
            }
            $("#" + bar.name).val($("#select-date-span").text());

            $('#SelDate').daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    locale: {
                        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月',
                            '9月', '10月', '11月', '12月'],
                        firstDay: 1
                    },
                },
                function (start, end, label) {
                    $("#select-date-span").text(start.format('YYYY-MM-DD'));
                    $("#" + bar.name).val($("#select-date-span").text());
                });
        };

        function renderSelect(bar) {

            var selector = '<div class="form-group"> <select class="form-control" name="net_type" id="' + bar.name + '"> ';

            var data = bar.data;
            for (var index in data) {
                selector += '<option value="' + data[index].value + '">' + data[index].name + '</option>';
            }
            selector += '</select></div>';

            $("#dgss_SearchForm").append(selector+'\n');
        };

        function renderAutocomplete(bar) {
            var hid = '<input type="hidden" id="' + bar.name + '" name="' + bar.name + '"/>';
            $("#dgss_SearchForm").append(hid);

            var ac = '<div class="form-group"> <div class="input-group">'
                + '<div class="input-group-addon">' + bar.display + '</div>'
                + '<input id="sel_' + bar.name + '" type="text" class="form-control" value=""> </div> </div>';

            $.getJSON(bar.url, function (data) {
                var cps = new Array();
                $(data).each(function (i, v) {
                    cps.push({value: v[bar.valueFiled] + '-' + v[bar.displayFiled], data: v[bar.valueFiled]});
                });
                $('#sel_' + bar.name).autocomplete({
                    lookup: cps,
                    onSelect: function (suggestion) {
                        $("#" + bar.name).val(suggestion.data);
                    }
                });
                $('#sel_' + bar.name).keyup(function () {
                    if ($('#sel_' + bar.name).val() == '') {
                        $("#" + bar.name).val('');
                    }
                });
            });

            $("#dgss_SearchForm").append(ac+'\n');
        };


        function renderNumber(bar) {

            var nb = ' <div class="form-group"> '
                + ' <div class="input-group"> '
                + ' <div class="input-group-addon">' + bar.display + '</div> '
                + ' <input id="' + bar.name + '" name="' + bar.name + '" type="number" min="' + bar.min + '" max="' + bar.max + '" class="form-control" value=""> '
                + ' </div> '
                + ' </div>';

            $("#dgss_SearchForm").append(nb+'\n');
        };

        function renderText(bar) {
            var txt = '<div class="form-group">'
                + '<div class="input-group">'
                + '<div class="input-group-addon">' + bar.display + '</div>'
                + '<input id="' + bar.name + '" type="text" class="form-control" value="">'
                + '</div>'
                + '</div>';
            $("#dgss_SearchForm").append(txt+'\n');
        };

        function loadData() {
            var searchBars = this.options.searchBar;
            var param = {};
            for (var index in searchBars) {
                var bar = searchBars[index];
                param[bar.name] = $('#' + bar.name).val();
            }
            if (table.options.params && table.options.params.newPage) {
                param.page = table.options.params.newPage;
            } else {
                param.page = 1;
            }

            console.log(param);

            this.options.params = $.extend({}, this.options.params, param);
            var options = this.options;
            $.post(this.options.url, this.options.params, function (result) {
                if ($("#dgss_table tbody").length == 0) {
                    $("#dgss_table").append('<tbody id="dgss_tbody">');
                } else {
                    $("#dgss_tbody").html("");
                }

                if (!result.data) {
                    result.data = result;
                    result.total = 1;
                }
                $(result.data).each(function (i, row) {
                    var fields = options.fields;
                    var $tr = $("<tr>").appendTo($("#dgss_tbody"));
                    for (var i in fields) {
                        var field = fields[i];
                        var val = '';
                        if(field.format){
                            val = field.format(row);
                        }else{
                            val = row[field.fieldId];
                        }

                        $tr.append("<td>" + val + "</td>");
                    }
                });

                $('#dgss_pagenator').bootstrapPaginator({
                    currentPage: param.page,
                    totalPages: result.total
                });
            });

            return false;
        };

        return {//返回一个原型对象
            constructor: Table,//把原型的constructor属性设置到正确的构造函数

            /*******公有方法*******/
            init: function () {
                var $ele = this.$element;
                if (this.options.searchBar) {
                    this.$element.prepend('<form class="form-inline" method="post" id="dgss_SearchForm">');
                    var searchBars = this.options.searchBar;
                    for (var index in searchBars) {
                        var bar = searchBars[index];

                        if (bar.type == 'singledate') {
                            this._(renderSingleDate)(bar);
                            continue;
                        }

                        if (bar.type == 'select') {
                            this._(renderSelect)(bar);
                            continue;
                        }

                        if (bar.type == 'autocomplete') {
                            this._(renderAutocomplete)(bar);
                            continue;
                        }

                        if (bar.type == 'number') {
                            this._(renderNumber)(bar);
                            continue;
                        }

                        if (bar.type == 'text') {
                            this._(renderText)(bar);
                            continue;
                        }
                    }

                    $("#dgss_SearchForm").append('\n<button type="submit" class="btn btn-primary" id="submitBtn">查询</button>\n');
                    $("#dgss_SearchForm").append('<hr/>');
                }

                this.$element.append('<table id="dgss_table" class="table">');


                if (this.options.caption) {
                    $("#dgss_table").prepend('<caption id="dgss_caption">' + this.options.caption + '</caption>');
                } else {
                    $("#dgss_table").prepend('<caption id="dgss_caption">');
                }

                if (this.options.fields) {
                    var fields = this.options.fields;

                    $("#dgss_table").append('<thead id="dgss_thead">');
                    var $tr = $("<tr>");
                    $("#dgss_thead").append($tr);
                    for (var i in fields) {
                        var field = fields[i];
                        $tr.append("<th>" + field.displayName + "</th>");
                    }
                }

                $("#dgss_SearchForm").submit(this._(loadData));
                //在数据加载完成后使用
                if (this.options.filter) {
                    $('<div class="row"><div class="col-sm-12"><div id="dgss_filter"></div></div>').insertBefore($("#dgss_table"));
                    BkUtils.setupFilter("dgss_filter");
                }

                if (this.options.pagenator) {
                    this.$element.append('<ul id="dgss_pagenator">');

                    this.options.pagenator = $.extend({}, this.options.pagenator, {
                        onPageChanged: function (e, oldPage, newPage) {
                            table.options.params.newPage = newPage;
                            table.options.params.oldPage = oldPage;
                            table._(loadData)();
                        }
                    });

                    $('#dgss_pagenator').bootstrapPaginator(this.options.pagenator);
                }

                if(this.options.autoLoad) this._(loadData)();
            },

            //返回一个函数，该函数的this绑定到当前对象
            _: function (fun) {
                var that = this;
                return function () {
                    return fun.apply(that, arguments);//注意return
                }
            }
        }

    })();//立刻执行
    var table;

    $.fn.table = function (options) {
        table = new Table(this, options);
        table.init();
        return this;
    }

})
(jQuery);