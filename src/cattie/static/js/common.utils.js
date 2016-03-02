(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define('BkUtils', [ 'jquery' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {

	BkUtils = function(options) {

	};
	$.extend(BkUtils.prototype, {
		formatMoney : function(money,scale) {
			scale = scale > 0 && scale <= 20 ? scale : 2;  
			money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(scale) + "";  
		    var l = money.split(".")[0].split("").reverse(), r = money.split(".")[1];  
		    t = "";  
		    for (i = 0; i < l.length; i++) {  
		        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
		    }  
		    return t.split("").reverse().join("") + "." + r;  
		},
		reverseMoney : function() {
			return parseFloat(s.replace(/[^\d\.-]/g, ""));  
		},
		setupFilter: function(id){
			var ct = '<form class="form-horizontal">'
						+'<div class="form-group">'
							+'<div class="col-sm-6">'
								+'<input type="text" class="form-control" id="filter-input" placeholder="请输入关键字,多个关键字用空格分开,只显示符合所有关键字的行" />'
							+'</div>'
						+'</div>'
					+'</form>';
			$("#"+id).html(ct);
			$("#filter-input").keyup(function(){
				var arg = $("#filter-input").val();
				var raw_args = arg.split(/[\s,]/),args=[];
			    $.each(raw_args, function(i, v) {
			        var t = v.replace(/^\s+|\s$/g, ''); // trim the string
			        if (t) {
			            args.push(t);
			        }
			    });
			    if (!args.length) {
			    	$("tbody").find('tr').show();
			        return false;
			    }
			
			    $("tbody").find('tr').hide();
			    $("tbody").find('tr').each(function(i,row){
			    	var found = 0;
			    	keys = args.concat();
			    	$(row).find('td').each(function(j,td){
		                $.each(keys, function(j, v) {
		                	
		                    if (v!=undefined && $(td).text().toUpperCase().indexOf(v.toUpperCase()) >= 0) {
		                        found++; // found another term
		                        delete keys[j]
		                        return;
		                    }
		                });
			    	});
			    	if(found >= args.length) $(row).show();
			    	
			    });
			});
		},
		isEmpty : function(val){
			if(val==undefined || val.trim()==''){
				return true;
			}else{
				return false;
			}
		},
		isNotEmpty : function(val){
			if(val==undefined || val.trim()==''){
				return false;
			}else{
				return true;
			}
		},
	});

	return BkUtils;
}));

var BkUtils = new BkUtils();
