package com.zhenhappy.ems.dto.admin;

import java.util.Date;

/**
 * Created by wangxd on 2017-03-23.
 */
public class QueryUserInfo {
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
	private Integer status;     //0：未激活；1：激活
	private Integer vip;        //评级
	private Integer email_num;  //发送邮件数量
	private Integer msg_num;    //发送短信数量
	private Integer register_type;//0：网页注册；1：手机注册

	public QueryUserInfo() {
		super();
	}

	public QueryUserInfo(Integer id) {
		super();
		this.id = id;
	}

	public QueryUserInfo(Integer id, String mobilephone, Integer status, String username, String email, String company,
						 Integer vip,Date create_Time, Integer register_type) {
		this.id = id;
		this.mobilephone = mobilephone;
		this.username = username;
		this.company = company;
		this.email = email;
		this.create_Time = create_Time;
		this.status = status;
		this.vip = vip;
		this.register_type = register_type;
	}

	public QueryUserInfo(Integer id, String mobilephone, String username, String password, String company, String email,
						 Date create_Time, Date update_Time, Integer fair_type, Integer user_role, Integer status,
						 Integer vip, Integer email_num, Integer msg_num, Integer register_type) {
		this.id = id;
		this.mobilephone = mobilephone;
		this.username = username;
		this.password = password;
		this.company = company;
		this.email = email;
		this.create_Time = create_Time;
		this.update_Time = update_Time;
		this.fair_type = fair_type;
		this.user_role = user_role;
		this.status = status;
		this.vip = vip;
		this.email_num = email_num;
		this.msg_num = msg_num;
		this.register_type = register_type;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMobilephone() {
		return mobilephone;
	}

	public void setMobilephone(String mobilephone) {
		this.mobilephone = mobilephone;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Date getCreate_Time() {
		return create_Time;
	}

	public void setCreate_Time(Date create_Time) {
		this.create_Time = create_Time;
	}

	public Date getUpdate_Time() {
		return update_Time;
	}

	public void setUpdate_Time(Date update_Time) {
		this.update_Time = update_Time;
	}

	public Integer getFair_type() {
		return fair_type;
	}

	public void setFair_type(Integer fair_type) {
		this.fair_type = fair_type;
	}

	public Integer getUser_role() {
		return user_role;
	}

	public void setUser_role(Integer user_role) {
		this.user_role = user_role;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getVip() {
		return vip;
	}

	public void setVip(Integer vip) {
		this.vip = vip;
	}

	public Integer getEmail_num() {
		return email_num;
	}

	public void setEmail_num(Integer email_num) {
		this.email_num = email_num;
	}

	public Integer getMsg_num() {
		return msg_num;
	}

	public void setMsg_num(Integer msg_num) {
		this.msg_num = msg_num;
	}

	public Integer getRegister_type() {
		return register_type;
	}

	public void setRegister_type(Integer register_type) {
		this.register_type = register_type;
	}
}
