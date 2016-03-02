package routers

import (
	"cattie/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{},"*:Index")
    beego.Router("/datasource", &controllers.DataSourceController{},"*:List")
	beego.AutoRouter(&controllers.DataSourceController{})
}
