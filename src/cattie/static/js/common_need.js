var BASE_PATH = '${path }';
//主菜单
var selectMenuIndex = $("#head_menu_index_input").val()
$("#head_menu_index_" + selectMenuIndex).addClass("active");
//边菜单
var selectSidebarIndex = $("#side_bar_index_input").val()
$("#head_submenu_index_" + selectSidebarIndex).addClass("active");
$("#side_bar_index_" + selectSidebarIndex).addClass("active");

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
	if(jqxhr.status==403 && jqxhr.responseJSON != undefined){
		Noty.error(jqxhr.responseJSON.message);
	}else{
		Noty.error(jqxhr.status);
	}
});

var ajax_loading_progress_interval_id;
$(document).ajaxStart(function (event) {
	var loading = '<div id="ajax_loading_progress" class="progress">'
		+ '<div class="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100" style="width: 1%"/>'
		+ '</div>';
	$("body").prepend(loading);

	ajax_loading_progress_interval_id = setInterval(function () {
		var ariaValuenow = parseInt($("#ajax_loading_progress .progress-bar").attr("aria-valuenow"));
		var remain = 100 - ariaValuenow;
		var newValue = (ariaValuenow + (remain/2));
		$("#ajax_loading_progress .progress-bar").attr("aria-valuenow",newValue);
		$("#ajax_loading_progress .progress-bar").width( newValue + "%");
	}, 40);
});

$(document).ajaxComplete(function (event, jqxhr, settings, thrownError) {
	//$("#ajax_loading_progress").remove();
	$("#ajax_loading_progress .progress-bar").attr("aria-valuenow",100);
	$("#ajax_loading_progress .progress-bar").width( "100%");

	$("#ajax_loading_progress").width("101%").delay(200).fadeOut(1000, function () {
		window.clearInterval(ajax_loading_progress_interval_id);
		$(this).remove();
	});
});