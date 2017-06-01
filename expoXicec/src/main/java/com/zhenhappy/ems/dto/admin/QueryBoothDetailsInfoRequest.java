package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class QueryBoothDetailsInfoRequest extends EasyuiRequest {
	private Integer fairid;
	private Integer boothid;
	private String telphone;

	public Integer getFairid() {
		return fairid;
	}

	public void setFairid(Integer fairid) {
		this.fairid = fairid;
	}

	public Integer getBoothid() {
		return boothid;
	}

	public void setBoothid(Integer boothid) {
		this.boothid = boothid;
	}

	public String getTelphone() {
		return telphone;
	}

	public void setTelphone(String telphone) {
		this.telphone = telphone;
	}
}
