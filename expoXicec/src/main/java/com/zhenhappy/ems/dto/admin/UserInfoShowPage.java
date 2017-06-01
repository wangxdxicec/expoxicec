package com.zhenhappy.ems.dto.admin;

/**
 * Created by wangxd on 2017-03-23.
 */
public class UserInfoShowPage {
	private Integer id;
	private String mobilephone;  //注册手机号--登录帐号
	private String username;
	private String password;
	private String company;
	private String email;
	private String create_Time;
	private String update_Time;
	private String fair_type;
	private String user_role;  //0：普通用户；1：管理员
	private String status;     //0：未激活；1：激活
	private String vip;        //评级
	private String email_num;  //发送邮件数量
	private String msg_num;    //发送短信数量
	private String register_type;//0：网页注册；1：手机注册

	public UserInfoShowPage() {
		super();
	}

	public UserInfoShowPage(Integer id) {
		super();
		this.id = id;
	}

	public UserInfoShowPage(Integer id, String mobilephone, String username, String password, String company,
							String email, String create_Time, String update_Time, String fair_type, String user_role,
							String status, String vip, String email_num, String msg_num, String register_type) {
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

	public String getCreate_Time() {
		return create_Time;
	}

	public void setCreate_Time(String create_Time) {
		this.create_Time = create_Time;
	}

	public String getUpdate_Time() {
		return update_Time;
	}

	public void setUpdate_Time(String update_Time) {
		this.update_Time = update_Time;
	}

	public String getFair_type() {
		return fair_type;
	}

	public void setFair_type(String fair_type) {
		this.fair_type = fair_type;
	}

	public String getUser_role() {
		return user_role;
	}

	public void setUser_role(String user_role) {
		this.user_role = user_role;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getVip() {
		return vip;
	}

	public void setVip(String vip) {
		this.vip = vip;
	}

	public String getEmail_num() {
		return email_num;
	}

	public void setEmail_num(String email_num) {
		this.email_num = email_num;
	}

	public String getMsg_num() {
		return msg_num;
	}

	public void setMsg_num(String msg_num) {
		this.msg_num = msg_num;
	}

	public String getRegister_type() {
		return register_type;
	}

	public void setRegister_type(String register_type) {
		this.register_type = register_type;
	}
}
