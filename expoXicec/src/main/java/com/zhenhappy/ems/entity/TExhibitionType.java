package com.zhenhappy.ems.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-5-9.
 */
@Entity
@Table(name = "t_exhibition_type")
public class TExhibitionType {

    private Integer id;
    private String exhibition_type_name;    //展位类型名称（特装/标摊）
    private String exhibition_sort;         //展位类型排序
    private Date create_time;               //创建时间
    private String bak_field1;              //备用字段1
    private String bak_field2;              //备用字段2

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "exhibition_type_name")
    public String getExhibition_type_name() {
        return exhibition_type_name;
    }

    public void setExhibition_type_name(String exhibition_type_name) {
        this.exhibition_type_name = exhibition_type_name;
    }

    @Column(name = "exhibition_sort")
    public String getExhibition_sort() {
        return exhibition_sort;
    }

    public void setExhibition_sort(String exhibition_sort) {
        this.exhibition_sort = exhibition_sort;
    }

    @Column(name = "bak_field1")
    public String getBak_field1() {
        return bak_field1;
    }

    public void setBak_field1(String bak_field1) {
        this.bak_field1 = bak_field1;
    }

    @Column(name = "bak_field2")
    public String getBak_field2() {
        return bak_field2;
    }

    public void setBak_field2(String bak_field2) {
        this.bak_field2 = bak_field2;
    }

    @Column(name = "create_time")
    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }
}

