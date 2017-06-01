package com.zhenhappy.ems.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-01-16.
 */
@Entity
@Table(name = "t_expoXicec")
public class TExpoXicec {

    private Integer id;
    private String mobilephone;  //注册手机号--登录帐号
    private String username;
    private String password;
    private String company;
    private String email;
    private Date create_Time;
    private Date update_Time;
    private Integer fair_type;
    private Integer user_role;  //0：普通用户；1：管理员
    private Integer status;     //0：未完成注册；1：完成注册；2：激活；3：锁定；4：禁用
    private Integer vip;        //评级
    private Integer email_num;  //发送邮件数量
    private Integer msg_num;    //发送短信数量
    private Integer register_type;//0：网页注册；1：手机注册

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "company")
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    @Column(name = "create_Time")
    public Date getCreate_Time() {
        return create_Time;
    }

    public void setCreate_Time(Date create_Time) {
        this.create_Time = create_Time;
    }

    @Column(name = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "mobilephone")
    public String getMobilephone() {
        return mobilephone;
    }

    public void setMobilephone(String mobilephone) {
        this.mobilephone = mobilephone;
    }

    @Column(name = "password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "update_Time")
    public Date getUpdate_Time() {
        return update_Time;
    }

    public void setUpdate_Time(Date update_Time) {
        this.update_Time = update_Time;
    }

    @Column(name = "username")
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Column(name = "fair_type")
    public Integer getFair_type() {
        return fair_type;
    }

    public void setFair_type(Integer fair_type) {
        this.fair_type = fair_type;
    }

    @Column(name = "user_role")
    public Integer getUser_role() {
        return user_role;
    }

    public void setUser_role(Integer user_role) {
        this.user_role = user_role;
    }

    @Column(name = "status")
    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @Column(name = "vip")
    public Integer getVip() {
        return vip;
    }

    public void setVip(Integer vip) {
        this.vip = vip;
    }

    @Column(name = "email_num")
    public Integer getEmail_num() {
        return email_num;
    }

    public void setEmail_num(Integer email_num) {
        this.email_num = email_num;
    }

    @Column(name = "msg_num")
    public Integer getMsg_num() {
        return msg_num;
    }

    public void setMsg_num(Integer msg_num) {
        this.msg_num = msg_num;
    }

    @Column(name = "register_type")
    public Integer getRegister_type() {
        return register_type;
    }

    public void setRegister_type(Integer register_type) {
        this.register_type = register_type;
    }
}

