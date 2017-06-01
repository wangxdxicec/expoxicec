package com.zhenhappy.ems.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-2-8.
 */
@Entity
@Table(name = "t_expoBuildInfo")
public class TExpoBuildInfo {

    private Integer id;
    private Integer userid;
    private Integer fairid;
    private String booth_Number;                          //展位号
    private String exhibitor_Company;                     //参展单位
    private Integer exhibitor_Type;                       //展位类型   1：标摊；2：特装
    private String exhibition_Liability_Insurance_Image;  //申报展位对应的《展览会责任险》保单
    private String exhibition_Aauthorization_Image;       //布展委托函
    private String exhibition_Power_Attorney_Image;       //授权委托书
    private String Building_Units_Information_Image;      //搭建单位相关资料
    private String Special_Booth_Information_Image;       //特装展位相关图纸
    private String Building_Material_Report_Image;        //搭建材料检验报告
    private String Staff_Qualification_Certificate_Image; //现场工人相关技术资格证复印件
    private Integer current_Audit_Status;                 //当前审核状态  1:表示正在上传材料  2:表示正在审核  3:表示审核通过  4:表示审核不通过
    private String current_Audit_Content;                 //当前审核内容
    private Date create_time;                             //创建时间
    private Date update_time;                             //更新时间
    private String booth_area;                            //展位面积
    private String exhibition_area;                       //展位对应的展区
    private String bak_field3;                            //备份字段3
    private String bak_field4;                            //备份字段4

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "fairid")
    public Integer getFairid() {
        return fairid;
    }

    public void setFairid(Integer fairid) {
        this.fairid = fairid;
    }

    @Column(name = "booth_area")
    public String getBooth_area() {
        return booth_area;
    }

    public void setBooth_area(String booth_area) {
        this.booth_area = booth_area;
    }

    @Column(name = "exhibition_area")
    public String getExhibition_area() {
        return exhibition_area;
    }

    public void setExhibition_area(String exhibition_area) {
        this.exhibition_area = exhibition_area;
    }

    @Column(name = "bak_field3")
    public String getBak_field3() {
        return bak_field3;
    }

    public void setBak_field3(String bak_field3) {
        this.bak_field3 = bak_field3;
    }

    @Column(name = "bak_field4")
    public String getBak_field4() {
        return bak_field4;
    }

    public void setBak_field4(String bak_field4) {
        this.bak_field4 = bak_field4;
    }

    @Column(name = "booth_Number")
    public String getBooth_Number() {
        return booth_Number;
    }

    public void setBooth_Number(String booth_Number) {
        this.booth_Number = booth_Number;
    }

    @Column(name = "Building_Material_Report_Image")
    public String getBuilding_Material_Report_Image() {
        return Building_Material_Report_Image;
    }

    public void setBuilding_Material_Report_Image(String building_Material_Report_Image) {
        Building_Material_Report_Image = building_Material_Report_Image;
    }

    @Column(name = "Building_Units_Information_Image")
    public String getBuilding_Units_Information_Image() {
        return Building_Units_Information_Image;
    }

    public void setBuilding_Units_Information_Image(String building_Units_Information_Image) {
        Building_Units_Information_Image = building_Units_Information_Image;
    }

    @Column(name = "create_time")
    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    @Column(name = "current_Audit_Content")
    public String getCurrent_Audit_Content() {
        return current_Audit_Content;
    }

    public void setCurrent_Audit_Content(String current_Audit_Content) {
        this.current_Audit_Content = current_Audit_Content;
    }

    @Column(name = "current_Audit_Status")
    public Integer getCurrent_Audit_Status() {
        return current_Audit_Status;
    }

    public void setCurrent_Audit_Status(Integer current_Audit_Status) {
        this.current_Audit_Status = current_Audit_Status;
    }

    @Column(name = "exhibition_Aauthorization_Image")
    public String getExhibition_Aauthorization_Image() {
        return exhibition_Aauthorization_Image;
    }

    public void setExhibition_Aauthorization_Image(String exhibition_Aauthorization_Image) {
        this.exhibition_Aauthorization_Image = exhibition_Aauthorization_Image;
    }

    @Column(name = "exhibition_Liability_Insurance_Image")
    public String getExhibition_Liability_Insurance_Image() {
        return exhibition_Liability_Insurance_Image;
    }

    public void setExhibition_Liability_Insurance_Image(String exhibition_Liability_Insurance_Image) {
        this.exhibition_Liability_Insurance_Image = exhibition_Liability_Insurance_Image;
    }

    @Column(name = "exhibition_Power_Attorney_Image")
    public String getExhibition_Power_Attorney_Image() {
        return exhibition_Power_Attorney_Image;
    }

    public void setExhibition_Power_Attorney_Image(String exhibition_Power_Attorney_Image) {
        this.exhibition_Power_Attorney_Image = exhibition_Power_Attorney_Image;
    }

    @Column(name = "exhibitor_Company")
    public String getExhibitor_Company() {
        return exhibitor_Company;
    }

    public void setExhibitor_Company(String exhibitor_Company) {
        this.exhibitor_Company = exhibitor_Company;
    }

    @Column(name = "exhibitor_Type")
    public Integer getExhibitor_Type() {
        return exhibitor_Type;
    }

    public void setExhibitor_Type(Integer exhibitor_Type) {
        this.exhibitor_Type = exhibitor_Type;
    }

    @Column(name = "Special_Booth_Information_Image")
    public String getSpecial_Booth_Information_Image() {
        return Special_Booth_Information_Image;
    }

    public void setSpecial_Booth_Information_Image(String special_Booth_Information_Image) {
        Special_Booth_Information_Image = special_Booth_Information_Image;
    }

    @Column(name = "Staff_Qualification_Certificate_Image")
    public String getStaff_Qualification_Certificate_Image() {
        return Staff_Qualification_Certificate_Image;
    }

    public void setStaff_Qualification_Certificate_Image(String staff_Qualification_Certificate_Image) {
        Staff_Qualification_Certificate_Image = staff_Qualification_Certificate_Image;
    }

    @Column(name = "update_time")
    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }

    @Column(name = "userid")
    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }
}

