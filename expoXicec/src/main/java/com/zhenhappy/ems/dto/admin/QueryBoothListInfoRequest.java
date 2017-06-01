package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class QueryBoothListInfoRequest extends EasyuiRequest {
	private String telphone;
	private Integer fairid;

	public String getTelphone() {
		return telphone;
	}

	public void setTelphone(String telphone) {
		this.telphone = telphone;
	}

	public Integer getFairid() {
		return fairid;
	}

	public void setFairid(Integer fairid) {
		this.fairid = fairid;
	}
}
