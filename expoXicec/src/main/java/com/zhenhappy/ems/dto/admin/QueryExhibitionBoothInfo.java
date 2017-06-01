package com.zhenhappy.ems.dto.admin;

/**
 * Created by wujianbin on 2014-07-14.
 */
public class QueryExhibitionBoothInfo {
	private Integer id;
	private String boothNum;
	private Integer status;
	private String company;
	private String boothArea;
	private String boothRegion;

	public QueryExhibitionBoothInfo() {
		super();
	}

	public QueryExhibitionBoothInfo(Integer id) {
		super();
		this.id = id;
	}

	public QueryExhibitionBoothInfo(Integer id, String boothNum, Integer status,
									String company, String boothArea,
									String boothRegion) {
		this.id = id;
		this.boothNum = boothNum;
		this.status = status;
		this.company = company;
		this.boothArea = boothArea;
		this.boothRegion = boothRegion;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getBoothNum() {
		return boothNum;
	}

	public void setBoothNum(String boothNum) {
		this.boothNum = boothNum;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getBoothArea() {
		return boothArea;
	}

	public void setBoothArea(String boothArea) {
		this.boothArea = boothArea;
	}

	public String getBoothRegion() {
		return boothRegion;
	}

	public void setBoothRegion(String boothRegion) {
		this.boothRegion = boothRegion;
	}
}
