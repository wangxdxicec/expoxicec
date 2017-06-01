package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class QueryExhibitorBoothInfoRequest extends EasyuiRequest {
	private Integer fairid;
	private String boothid;
	private String telphone;
	private String bootharea;

	public Integer getFairid() {
		return fairid;
	}

	public void setFairid(Integer fairid) {
		this.fairid = fairid;
	}

	public String getBoothid() {
		return boothid;
	}

	public void setBoothid(String boothid) {
		this.boothid = boothid;
	}

	public String getTelphone() {
		return telphone;
	}

	public void setTelphone(String telphone) {
		this.telphone = telphone;
	}

	public String getBootharea() {
		return bootharea;
	}

	public void setBootharea(String bootharea) {
		this.bootharea = bootharea;
	}
}
