package com.zhenhappy.ems.dto.admin;

/**
 * Created by wangxd on 2017-03-23.
 */
public class QueryExhibitionAuditInfo {
	private Integer id;
	private Integer auditStatus;
	private String exhibitionNum;
	private String exhibitionRegion;
	private String exhibitionCompany;
	private String exhibitionBuild;
	private String buildTelphone;
	private Integer exhibitionDocumentNum;

	public QueryExhibitionAuditInfo() {
		super();
	}

	public QueryExhibitionAuditInfo(Integer id) {
		super();
		this.id = id;
	}

	public QueryExhibitionAuditInfo(Integer id, Integer auditStatus, String exhibitionNum, String exhibitionRegion,
									String exhibitionCompany, String exhibitionBuild, String buildTelphone) {
		this.id = id;
		this.auditStatus = auditStatus;
		this.exhibitionNum = exhibitionNum;
		this.exhibitionRegion = exhibitionRegion;
		this.exhibitionCompany = exhibitionCompany;
		this.exhibitionBuild = exhibitionBuild;
		this.buildTelphone = buildTelphone;
	}

	public QueryExhibitionAuditInfo(Integer id, Integer auditStatus, String exhibitionNum, String exhibitionRegion,
									String exhibitionCompany, String exhibitionBuild, String buildTelphone, Integer exhibitionDocumentNum) {
		this.id = id;
		this.auditStatus = auditStatus;
		this.exhibitionNum = exhibitionNum;
		this.exhibitionRegion = exhibitionRegion;
		this.exhibitionCompany = exhibitionCompany;
		this.exhibitionBuild = exhibitionBuild;
		this.exhibitionDocumentNum = exhibitionDocumentNum;
		this.buildTelphone = buildTelphone;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getBuildTelphone() {
		return buildTelphone;
	}

	public void setBuildTelphone(String buildTelphone) {
		this.buildTelphone = buildTelphone;
	}

	public Integer getAuditStatus() {
		return auditStatus;
	}

	public void setAuditStatus(Integer auditStatus) {
		this.auditStatus = auditStatus;
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

	public Integer getExhibitionDocumentNum() {
		return exhibitionDocumentNum;
	}

	public void setExhibitionDocumentNum(Integer exhibitionDocumentNum) {
		this.exhibitionDocumentNum = exhibitionDocumentNum;
	}
}
