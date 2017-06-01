package com.zhenhappy.ems.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-5-9.
 */
@Entity
@Table(name = "t_document_info")
public class TDocumentInfo {

    private Integer id;
    private Integer document_Require;       //文档类型是否必选
    private String document_Template;       //文档附件
    private Integer document_Sort;          //文档显示顺序
    private String document_Name;           //文档名称
    private String document_Type;           //文档类型
    private String document_Size;           //文档大小
    private String document_Remark;         //文档备注
    private Integer document_Fair;          //文档对应的展会
    private Date create_time;               //创建时间
    private Date update_time;               //更新时间
    private Integer document_Type_Id;       //对应文档类型id
    private String document_File_Path;      //附件保存路径
    private Integer document_Common;        //文档是否通用

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "document_Require")
    public Integer getDocument_Require() {
        return document_Require;
    }

    public void setDocument_Require(Integer document_Require) {
        this.document_Require = document_Require;
    }

    @Column(name = "document_Template")
    public String getDocument_Template() {
        return document_Template;
    }

    public void setDocument_Template(String document_Template) {
        this.document_Template = document_Template;
    }

    @Column(name = "document_Sort")
    public Integer getDocument_Sort() {
        return document_Sort;
    }

    public void setDocument_Sort(Integer document_Sort) {
        this.document_Sort = document_Sort;
    }

    @Column(name = "document_Name")
    public String getDocument_Name() {
        return document_Name;
    }

    public void setDocument_Name(String document_Name) {
        this.document_Name = document_Name;
    }

    @Column(name = "document_Type")
    public String getDocument_Type() {
        return document_Type;
    }

    public void setDocument_Type(String document_Type) {
        this.document_Type = document_Type;
    }

    @Column(name = "document_Size")
    public String getDocument_Size() {
        return document_Size;
    }

    public void setDocument_Size(String document_Size) {
        this.document_Size = document_Size;
    }

    @Column(name = "document_Remark")
    public String getDocument_Remark() {
        return document_Remark;
    }

    public void setDocument_Remark(String document_Remark) {
        this.document_Remark = document_Remark;
    }

    @Column(name = "document_Fair")
    public Integer getDocument_Fair() {
        return document_Fair;
    }

    public void setDocument_Fair(Integer document_Fair) {
        this.document_Fair = document_Fair;
    }

    @Column(name = "document_Type_Id", nullable = false)
    public Integer getDocument_Type_Id() {
        return document_Type_Id;
    }

    public void setDocument_Type_Id(Integer document_Type_Id) {
        this.document_Type_Id = document_Type_Id;
    }

    @Column(name = "document_File_Path")
    public String getDocument_File_Path() {
        return document_File_Path;
    }

    public void setDocument_File_Path(String document_File_Path) {
        this.document_File_Path = document_File_Path;
    }

    @Column(name = "document_Common")
    public Integer getDocument_Common() {
        return document_Common;
    }

    public void setDocument_Common(Integer document_Common) {
        this.document_Common = document_Common;
    }

    @Column(name = "create_time")
    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    @Column(name = "update_time")
    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}

