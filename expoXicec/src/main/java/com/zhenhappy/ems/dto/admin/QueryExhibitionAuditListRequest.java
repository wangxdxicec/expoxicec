package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class QueryExhibitionAuditListRequest extends EasyuiRequest {
	private Integer id;
	private Integer boothAuditStatus;
	private String exhibitionNum;
	private String exhibitionRegion;
	private String exhibitionCompany;
	private String exhibitionBuild;
	private Integer pageIndex;
	private Integer fairType;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getBoothAuditStatus() {
		return boothAuditStatus;
	}

	public void setBoothAuditStatus(Integer boothAuditStatus) {
		this.boothAuditStatus = boothAuditStatus;
	}

	public String getExhibitionNum() {
		return exhibitionNum;
	}

	public void setExhibitionNum(String exhibitionNum) {
		this.exhibitionNum = exhibitionNum;
	}

	public String getExhibitionRegion() {
		return exhibitionRegion;
	}

	public void setExhibitionRegion(String exhibitionRegion) {
		this.exhibitionRegion = exhibitionRegion;
	}

	public String getExhibitionCompany() {
		return exhibitionCompany;
	}

	public void setExhibitionCompany(String exhibitionCompany) {
		this.exhibitionCompany = exhibitionCompany;
	}

	public String getExhibitionBuild() {
		return exhibitionBuild;
	}

	public void setExhibitionBuild(String exhibitionBuild) {
		this.exhibitionBuild = exhibitionBuild;
	}

	public Integer getPageIndex() {
		return pageIndex;
	}

	public void setPageIndex(Integer pageIndex) {
		this.pageIndex = pageIndex;
	}

	public Integer getFairType() {
		return fairType;
	}

	public void setFairType(Integer fairType) {
		this.fairType = fairType;
	}
}
