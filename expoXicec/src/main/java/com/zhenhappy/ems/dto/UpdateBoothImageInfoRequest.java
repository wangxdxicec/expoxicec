package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017-02-20.
 */
public class UpdateBoothImageInfoRequest {
	private String type;
	private String boothId;
	private String tempId;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getBoothId() {
		return boothId;
	}

	public void setBoothId(String boothId) {
		this.boothId = boothId;
	}

	public String getTempId() {
		return tempId;
	}

	public void setTempId(String tempId) {
		this.tempId = tempId;
	}
}
