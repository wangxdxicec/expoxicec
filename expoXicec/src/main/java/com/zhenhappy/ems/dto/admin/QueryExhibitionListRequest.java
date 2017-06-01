package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class QueryExhibitionListRequest extends EasyuiRequest {
	private Integer id;
	private String exhibitionNum;
	private Integer exhibitionStatus;
	private String exhibitionCompany;
	private String exhibitionType;
	private String exhibitionArea;
	private String exhibitionRegion;
	private Integer pageIndex;
	private Integer fairType;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getExhibitionNum() {
		return exhibitionNum;
	}

	public void setExhibitionNum(String exhibitionNum) {
		this.exhibitionNum = exhibitionNum;
	}

	public Integer getExhibitionStatus() {
		return exhibitionStatus;
	}

	public void setExhibitionStatus(Integer exhibitionStatus) {
		this.exhibitionStatus = exhibitionStatus;
	}

	public String getExhibitionCompany() {
		return exhibitionCompany;
	}

	public void setExhibitionCompany(String exhibitionCompany) {
		this.exhibitionCompany = exhibitionCompany;
	}

	public String getExhibitionType() {
		return exhibitionType;
	}

	public void setExhibitionType(String exhibitionType) {
		this.exhibitionType = exhibitionType;
	}

	public String getExhibitionArea() {
		return exhibitionArea;
	}

	public void setExhibitionArea(String exhibitionArea) {
		this.exhibitionArea = exhibitionArea;
	}

	public String getExhibitionRegion() {
		return exhibitionRegion;
	}

	public void setExhibitionRegion(String exhibitionRegion) {
		this.exhibitionRegion = exhibitionRegion;
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
