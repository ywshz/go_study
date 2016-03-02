package models
import (
	"github.com/astaxie/beego/orm"
	"time"
)

type DataSource struct {
	Id          int64
	Name        string
	Type        string
	Url         string
	Max         int
	Min         int
	Description string
	CreateTime  time.Time
}

func (t *DataSource) TableName() string {
	return TableName("datasource")
}

func (t *DataSource) Update(fields ...string) error {
	if _, err := orm.NewOrm().Update(t, fields...); err != nil {
		return err
	}
	return nil
}

func DataSourceAdd(datasource *DataSource) (int64, error)  {
	datasource.CreateTime = time.Now().UTC().Add(8 * time.Hour)
	return orm.NewOrm().Insert(datasource)
}

func DataSourceList() ([]*DataSource) {
	dataSources := make([]*DataSource, 0)
	query := orm.NewOrm().QueryTable(TableName("datasource"))
	query.All(&dataSources)
	return dataSources
}

func DataSourceGet(id int64) (*DataSource, error) {
	ds := &DataSource{
		Id: id,
	}
	err := orm.NewOrm().Read(ds)
	if err != nil {
		return nil, err
	}
	return ds, nil
}