package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-21.
 */
public class QueryFairDetailRequest extends EasyuiRequest {

	private String fairid;

	public String getFairid() {
		return fairid;
	}

	public void setFairid(String fairid) {
		this.fairid = fairid;
	}
}
