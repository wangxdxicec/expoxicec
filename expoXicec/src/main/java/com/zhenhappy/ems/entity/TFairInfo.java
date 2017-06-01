package com.zhenhappy.ems.entity;

import javax.persistence.*;

/**
 * Created by wangxd on 2017-01-16.
 */
@Entity
@Table(name = "t_fair_info")
public class TFairInfo {

    private Integer id;
    private String fair_name;                           //展会名称--用于前台界面显示
    private String fair_name_alias;                     //展会别名
    private Integer fair_enable;                        //是否激活该展会  0：停用；1：可上传资料；2：已截止上传
    private String fair_begin_time;                     //展会开始时间
    private String fair_end_time;                       //展会结束时间
    private String fair_qualification_notice_name;      //展位资质审核通知文件
    private String fair_booth_setup_approval_name;      //报审操作流程文件
    private Integer fair_send_audit_sms;                //是否发送审核短信
    private String fair_organization;                   //组委会
    private Integer fair_booth_create_method;           //创建展位方式   0：任意创建；1：单个展位模板；2：多个展位模板
    private Integer fair_booth_hint_input_length;       //展位提示字符
    private String fair_extend_login_url;               //自定义登陆页
    private Integer fair_booth_name_auto_capitalization;//展位号自动大写
    private Integer fair_use_template_company;          //客户不可修改公司名称
    private Integer fair_sms_show_org_sign;             //短信末尾显示组委会名称

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "fair_enable")
    public Integer getFair_enable() {
        return fair_enable;
    }

    public void setFair_enable(Integer fair_enable) {
        this.fair_enable = fair_enable;
    }

    @Column(name = "fair_name")
    public String getFair_name() {
        return fair_name;
    }

    public void setFair_name(String fair_name) {
        this.fair_name = fair_name;
    }

    @Column(name = "fair_name_alias")
    public String getFair_name_alias() {
        return fair_name_alias;
    }

    public void setFair_name_alias(String fair_name_alias) {
        this.fair_name_alias = fair_name_alias;
    }


    @Column(name = "fair_begin_time")
    public String getFair_begin_time() {
        return fair_begin_time;
    }

    public void setFair_begin_time(String fair_begin_time) {
        this.fair_begin_time = fair_begin_time;
    }

    @Column(name = "fair_end_time")
    public String getFair_end_time() {
        return fair_end_time;
    }

    public void setFair_end_time(String fair_end_time) {
        this.fair_end_time = fair_end_time;
    }

    @Column(name = "fair_qualification_notice_name")
    public String getFair_qualification_notice_name() {
        return fair_qualification_notice_name;
    }

    public void setFair_qualification_notice_name(String fair_qualification_notice_name) {
        this.fair_qualification_notice_name = fair_qualification_notice_name;
    }

    @Column(name = "fair_booth_setup_approval_name")
    public String getFair_booth_setup_approval_name() {
        return fair_booth_setup_approval_name;
    }

    public void setFair_booth_setup_approval_name(String fair_booth_setup_approval_name) {
        this.fair_booth_setup_approval_name = fair_booth_setup_approval_name;
    }

    @Column(name = "fair_send_audit_sms")
    public Integer getFair_send_audit_sms() {
        return fair_send_audit_sms;
    }

    public void setFair_send_audit_sms(Integer fair_send_audit_sms) {
        this.fair_send_audit_sms = fair_send_audit_sms;
    }

    @Column(name = "fair_organization")
    public String getFair_organization() {
        return fair_organization;
    }

    public void setFair_organization(String fair_organization) {
        this.fair_organization = fair_organization;
    }

    @Column(name = "fair_booth_create_method")
    public Integer getFair_booth_create_method() {
        return fair_booth_create_method;
    }

    public void setFair_booth_create_method(Integer fair_booth_create_method) {
        this.fair_booth_create_method = fair_booth_create_method;
    }

    @Column(name = "fair_booth_hint_input_length")
    public Integer getFair_booth_hint_input_length() {
        return fair_booth_hint_input_length;
    }

    public void setFair_booth_hint_input_length(Integer fair_booth_hint_input_length) {
        this.fair_booth_hint_input_length = fair_booth_hint_input_length;
    }

    @Column(name = "fair_extend_login_url")
    public String getFair_extend_login_url() {
        return fair_extend_login_url;
    }

    public void setFair_extend_login_url(String fair_extend_login_url) {
        this.fair_extend_login_url = fair_extend_login_url;
    }

    @Column(name = "fair_booth_name_auto_capitalization")
    public Integer getFair_booth_name_auto_capitalization() {
        return fair_booth_name_auto_capitalization;
    }

    public void setFair_booth_name_auto_capitalization(Integer fair_booth_name_auto_capitalization) {
        this.fair_booth_name_auto_capitalization = fair_booth_name_auto_capitalization;
    }

    @Column(name = "fair_use_template_company")
    public Integer getFair_use_template_company() {
        return fair_use_template_company;
    }

    public void setFair_use_template_company(Integer fair_use_template_company) {
        this.fair_use_template_company = fair_use_template_company;
    }

    @Column(name = "fair_sms_show_org_sign")
    public Integer getFair_sms_show_org_sign() {
        return fair_sms_show_org_sign;
    }

    public void setFair_sms_show_org_sign(Integer fair_sms_show_org_sign) {
        this.fair_sms_show_org_sign = fair_sms_show_org_sign;
    }
}

