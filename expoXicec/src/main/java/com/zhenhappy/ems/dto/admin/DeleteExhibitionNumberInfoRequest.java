package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-3-15.
 */
public class DeleteExhibitionNumberInfoRequest extends EasyuiRequest {
	private Integer expoBuildInfoId;

	public Integer getExpoBuildInfoId() {
		return expoBuildInfoId;
	}

	public void setExpoBuildInfoId(Integer expoBuildInfoId) {
		this.expoBuildInfoId = expoBuildInfoId;
	}
}
