package controllers

import (
	"github.com/astaxie/beego"
	"cattie/models"
	"strings"
	"github.com/astaxie/beego/orm"
)

type DataSourceController struct {
	BaseController
}

// list
func (this *DataSourceController) List() {

	result := models.DataSourceList()

	list := make([]map[string]interface{}, len(result))

	for k, v := range result {
		row := make(map[string]interface{})
		row["id"] = v.Id
		row["name"] = v.Name
		row["type"] = v.Type
		row["url"] = v.Url
		row["max"] = v.Max
		row["min"] = v.Min
		row["description"] = v.Description
		row["create_time"] = beego.Date(v.CreateTime, "Y-m-d H:i:s")
		list[k] = row
	}

	this.Data["list"] = list

	this.display("datasource/list")
}

func (this *DataSourceController) Get() {
	id, _ := this.GetInt64("id")
	ds, _ := models.DataSourceGet(id)

	data := make(map[string]interface{})

	data["id"] = ds.Id
	data["name"] = ds.Name
	data["type"] = ds.Type
	data["url"] = ds.Url
	data["max"] = ds.Max
	data["min"] = ds.Min
	data["description"] = ds.Description
	data["create_time"] = beego.Date(ds.CreateTime, "Y-m-d H:i:s")
	this.jsonResult(data)
}

func (this *DataSourceController) Edit() {

	id, _ := this.GetInt64("id")

	datasource, err := models.DataSourceGet(id)
	if err != nil {
		this.showMsg(err.Error())
	}

	if this.isPost() {
		datasource.Name = strings.TrimSpace(this.GetString("name"))
		datasource.Type = strings.TrimSpace(this.GetString("type"))
		datasource.Url = strings.TrimSpace(this.GetString("url"))
		datasource.Max,_ = this.GetInt("max")
		datasource.Min,_ = this.GetInt("min")

		if err := datasource.Update(); err != nil {
			this.ajaxMsg("数据源不存在", MSG_ERR)
		}

		refer := this.Ctx.Request.Referer()
		if refer == "" {
			refer = beego.URLFor("DataSourceController.List")
		}
		this.redirect(refer)
	}
}

func (this *DataSourceController) Add() {
	if this.isPost() {
		datasource := new(models.DataSource)
		datasource.Name = strings.TrimSpace(this.GetString("name"))
		datasource.Type = strings.TrimSpace(this.GetString("type"))
		datasource.Url = strings.TrimSpace(this.GetString("url"))
		datasource.Max,_ = this.GetInt("max")
		datasource.Min,_ = this.GetInt("min")

		if _, err := models.DataSourceAdd(datasource); err != nil {
			this.ajaxMsg(err.Error(), MSG_ERR)
		}

	}

	refer := this.Ctx.Request.Referer()
	if refer == "" {
		refer = beego.URLFor("DataSourceController.List")
	}
	this.redirect(refer)
}
