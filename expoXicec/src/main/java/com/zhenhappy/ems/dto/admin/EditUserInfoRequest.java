package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-3-15.
 */
public class EditUserInfoRequest extends EasyuiRequest {
	private Integer id;
	private String mobile;
	private String name;
	private String company;
	private String email;
	private String password;
	private Integer status;
	private Integer vip;
	private Integer smsNum;
	private boolean user_role;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Integer getSmsNum() {
		return smsNum;
	}

	public void setSmsNum(Integer smsNum) {
		this.smsNum = smsNum;
	}

	public boolean isUser_role() {
		return user_role;
	}

	public void setUser_role(boolean user_role) {
		this.user_role = user_role;
	}
}
