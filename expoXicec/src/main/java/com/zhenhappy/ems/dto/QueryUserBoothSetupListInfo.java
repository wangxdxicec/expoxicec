package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017-03-23.
 */
public class QueryUserBoothSetupListInfo {
	private String fairId;  //展会ID

	public QueryUserBoothSetupListInfo() {
		super();
	}

	public QueryUserBoothSetupListInfo(String fairId) {
		super();
		this.fairId = fairId;
	}

	public String getFairId() {
		return fairId;
	}

	public void setFairId(String fairId) {
		this.fairId = fairId;
	}
}
