package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-21.
 */
public class QueryFairBoothListRequest extends EasyuiRequest {
	private Integer id;
	private Integer userId;
	private Integer fairId;
	private Integer boothStatus;
	private String boothNumber;
	private String boothCompany;
	private String boothSetUpCompany;
	private Integer pageIndex;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getFairId() {
		return fairId;
	}

	public void setFairId(Integer fairId) {
		this.fairId = fairId;
	}

	public Integer getBoothStatus() {
		return boothStatus;
	}

	public void setBoothStatus(Integer boothStatus) {
		this.boothStatus = boothStatus;
	}

	public String getBoothNumber() {
		return boothNumber;
	}

	public void setBoothNumber(String boothNumber) {
		this.boothNumber = boothNumber;
	}

	public String getBoothCompany() {
		return boothCompany;
	}

	public void setBoothCompany(String boothCompany) {
		this.boothCompany = boothCompany;
	}

	public String getBoothSetUpCompany() {
		return boothSetUpCompany;
	}

	public void setBoothSetUpCompany(String boothSetUpCompany) {
		this.boothSetUpCompany = boothSetUpCompany;
	}

	public Integer getPageIndex() {
		return pageIndex;
	}

	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}
}
