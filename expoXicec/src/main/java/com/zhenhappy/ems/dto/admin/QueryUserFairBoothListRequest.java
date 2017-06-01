package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd9 on 2017-03-29.
 */
public class QueryUserFairBoothListRequest extends EasyuiRequest {
	private Integer fairid;

	public Integer getFairid() {
		return fairid;
	}

	public void setFairid(Integer fairid) {
		this.fairid = fairid;
	}
}
