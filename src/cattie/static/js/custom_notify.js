(function(factory) {
	if (typeof define === 'function' && define.amd) {
		define('Noty', [ 'jquery' ], factory);
	} else {
		factory(jQuery);
	}
}(function($) {

	Noty = function(options) {

	};
	$.extend(Noty.prototype, {
		error : function(message) {
			new PNotify({
				title : '错误',
				text : message,
				icon : 'glyphicon glyphicon-remove-circle',
				type : 'error',
				delay : 5000
			});
		},
		info : function(message) {
			new PNotify({
				title : '提醒',
				text : message,
				icon : 'glyphicon glyphicon-info-sign',
				type : 'info',
				delay : 5000
			});
		}
	});

	return Noty;
}));

Noty.error = function(message) {
	var n = new Noty();
	n.error(message);
}

Noty.info = function(message) {
	var n = new Noty();
	n.info(message);
}