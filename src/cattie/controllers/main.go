package controllers

import (
)

type MainController struct {
	BaseController
}

// 首页
func (this *MainController) Index() {
	this.Data["BasePath"] = ""
	this.display("index")
}
