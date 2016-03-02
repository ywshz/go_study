package main

import (
	_ "cattie/routers"
	_ "cattie/models"
	"github.com/astaxie/beego"
)

func main() {
	beego.BConfig.WebConfig.Session.SessionOn = true
	beego.Run()
}

