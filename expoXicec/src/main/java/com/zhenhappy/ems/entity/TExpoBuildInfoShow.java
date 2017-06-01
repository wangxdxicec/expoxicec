package com.zhenhappy.ems.entity;

/**
 * Created by wangxd on 2017-2-8.
 */
public class TExpoBuildInfoShow {

    private Integer id;
    private Integer userid;
    private String booth_Number;     //展位号
    private String exhibitor_Company;//参展单位
    private String exhibitor_Type;  //展位类型
    private String exhibition_Liability_Insurance_Image;  //申报展位对应的《展览会责任险》保单
    private String exhibition_Aauthorization_Image;       //布展委托函
    private String exhibition_Power_Attorney_Image;       //授权委托书
    private String Building_Units_Information_Image;      //搭建单位相关资料
    private String Special_Booth_Information_Image;       //特装展位相关图纸
    private String Building_Material_Report_Image;        //搭建材料检验报告
    private String Staff_Qualification_Certificate_Image; //现场工人相关技术资格证复印件
    private Integer current_Status;                       //当前审核值
    private String current_Audit_Status;                  //当前审核状态  1:表示正在上传材料  2:表示正在审核  3:表示审核通过  4:表示审核失败
    private String current_Audit_Status_Button;           //当前审核状态  1:提交审核  2:表示等待审核中  3:表示审核通过  4:表示审核失败
    private String current_Review_Info;                   //当前审核内容
    private String create_time;                           //创建时间
    private String update_time;                           //更新时间
    private String booth_area;                            //展位面积
    private String exhibition_area;                       //展位对应的展区
    private String bak_field3;                            //备份字段3
    private String bak_field4;                            //备份字段4
    private String login_name;
    private String login_telphone;
    private Integer fair_enable;

    public String getBooth_area() {
        return booth_area;
    }

    public void setBooth_area(String booth_area) {
        this.booth_area = booth_area;
    }

    public String getExhibition_area() {
        return exhibition_area;
    }

    public void setExhibition_area(String exhibition_area) {
        this.exhibition_area = exhibition_area;
    }

    public String getBak_field3() {
        return bak_field3;
    }

    public void setBak_field3(String bak_field3) {
        this.bak_field3 = bak_field3;
    }

    public String getBak_field4() {
        return bak_field4;
    }

    public void setBak_field4(String bak_field4) {
        this.bak_field4 = bak_field4;
    }

    public String getBooth_Number() {
        return booth_Number;
    }

    public void setBooth_Number(String booth_Number) {
        this.booth_Number = booth_Number;
    }

    public String getBuilding_Material_Report_Image() {
        return Building_Material_Report_Image;
    }

    public void setBuilding_Material_Report_Image(String building_Material_Report_Image) {
        Building_Material_Report_Image = building_Material_Report_Image;
    }

    public String getBuilding_Units_Information_Image() {
        return Building_Units_Information_Image;
    }

    public void setBuilding_Units_Information_Image(String building_Units_Information_Image) {
        Building_Units_Information_Image = building_Units_Information_Image;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String getCurrent_Review_Info() {
        return current_Review_Info;
    }

    public void setCurrent_Review_Info(String current_Review_Info) {
        this.current_Review_Info = current_Review_Info;
    }

    public String getCurrent_Audit_Status() {
        return current_Audit_Status;
    }

    public void setCurrent_Audit_Status(String current_Audit_Status) {
        this.current_Audit_Status = current_Audit_Status;
    }

    public String getExhibition_Aauthorization_Image() {
        return exhibition_Aauthorization_Image;
    }

    public void setExhibition_Aauthorization_Image(String exhibition_Aauthorization_Image) {
        this.exhibition_Aauthorization_Image = exhibition_Aauthorization_Image;
    }

    public String getExhibition_Liability_Insurance_Image() {
        return exhibition_Liability_Insurance_Image;
    }

    public void setExhibition_Liability_Insurance_Image(String exhibition_Liability_Insurance_Image) {
        this.exhibition_Liability_Insurance_Image = exhibition_Liability_Insurance_Image;
    }

    public String getExhibition_Power_Attorney_Image() {
        return exhibition_Power_Attorney_Image;
    }

    public void setExhibition_Power_Attorney_Image(String exhibition_Power_Attorney_Image) {
        this.exhibition_Power_Attorney_Image = exhibition_Power_Attorney_Image;
    }

    public String getExhibitor_Company() {
        return exhibitor_Company;
    }

    public void setExhibitor_Company(String exhibitor_Company) {
        this.exhibitor_Company = exhibitor_Company;
    }

    public String getExhibitor_Type() {
        return exhibitor_Type;
    }

    public void setExhibitor_Type(String exhibitor_Type) {
        this.exhibitor_Type = exhibitor_Type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLogin_name() {
        return login_name;
    }

    public void setLogin_name(String login_name) {
        this.login_name = login_name;
    }

    public String getLogin_telphone() {
        return login_telphone;
    }

    public void setLogin_telphone(String login_telphone) {
        this.login_telphone = login_telphone;
    }

    public String getSpecial_Booth_Information_Image() {
        return Special_Booth_Information_Image;
    }

    public void setSpecial_Booth_Information_Image(String special_Booth_Information_Image) {
        Special_Booth_Information_Image = special_Booth_Information_Image;
    }

    public String getStaff_Qualification_Certificate_Image() {
        return Staff_Qualification_Certificate_Image;
    }

    public void setStaff_Qualification_Certificate_Image(String staff_Qualification_Certificate_Image) {
        Staff_Qualification_Certificate_Image = staff_Qualification_Certificate_Image;
    }

    public String getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(String update_time) {
        this.update_time = update_time;
    }

    public Integer getUserid() {
        return userid;
    }

    public void setUserid(Integer userid) {
        this.userid = userid;
    }

    public String getCurrent_Audit_Status_Button() {
        return current_Audit_Status_Button;
    }

    public void setCurrent_Audit_Status_Button(String current_Audit_Status_Button) {
        this.current_Audit_Status_Button = current_Audit_Status_Button;
    }

    public Integer getCurrent_Status() {
        return current_Status;
    }

    public void setCurrent_Status(Integer current_Status) {
        this.current_Status = current_Status;
    }

    public Integer getFair_enable() {
        return fair_enable;
    }

    public void setFair_enable(Integer fair_enable) {
        this.fair_enable = fair_enable;
    }
}

