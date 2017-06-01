package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

public class BoothReviewInfoResponse extends BaseResponse {
	public String boothReviewInfoList;

	public BoothReviewInfoResponse() {
	}

	public BoothReviewInfoResponse(String boothReviewInfoList) {
		this.boothReviewInfoList = boothReviewInfoList;
	}

	public String getBoothReviewInfoList() {
		return boothReviewInfoList;
	}

	public void setBoothReviewInfoList(String boothReviewInfoList) {
		this.boothReviewInfoList = boothReviewInfoList;
	}
}
