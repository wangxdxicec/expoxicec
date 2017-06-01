package com.zhenhappy.ems.dto.admin;

/**
 * Created by wangxd on 2017-05-08.
 */
public class ExportExhibitionAuditInfo {
	private Integer id;
	private String auditStatus;		//审核状态
	private String exhibitionNum;		//展位号
	private String exhibitionType;		//展位类型
	private String exhibitionCompany;	//参展单位
	private String exhibitionArea;		//展位面积
	private String exhibitionRegion;	//展位区域
	private String exhibitionContact;	//展位联系方式
	private String buildName;			//用户姓名
	private String exhibitionBuild;		//用户单位
	private String buildTelphone;		//用户联系方式
	private Integer exhibitionDocumentNum;

	public ExportExhibitionAuditInfo(){

	}

	public ExportExhibitionAuditInfo(Integer id, String auditStatus, String exhibitionNum, String exhibitionType,
									 String exhibitionArea, String exhibitionRegion, String exhibitionContact,
									 String buildName, String exhibitionCompany, String exhibitionBuild, String buildTelphone,
									 Integer exhibitionDocumentNum) {
		this.id = id;
		this.auditStatus = auditStatus;
		this.exhibitionNum = exhibitionNum;
		this.exhibitionType = exhibitionType;
		this.exhibitionArea = exhibitionArea;
		this.exhibitionRegion = exhibitionRegion;
		this.exhibitionContact = exhibitionContact;
		this.buildName = buildName;
		this.exhibitionCompany = exhibitionCompany;
		this.exhibitionBuild = exhibitionBuild;
		this.buildTelphone = buildTelphone;
		this.exhibitionDocumentNum = exhibitionDocumentNum;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getAuditStatus() {
		return auditStatus;
	}

	public void setAuditStatus(String auditStatus) {
		this.auditStatus = auditStatus;
	}

	public String getExhibitionNum() {
		return exhibitionNum;
	}

	public void setExhibitionNum(String exhibitionNum) {
		this.exhibitionNum = exhibitionNum;
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

	public String getExhibitionContact() {
		return exhibitionContact;
	}

	public void setExhibitionContact(String exhibitionContact) {
		this.exhibitionContact = exhibitionContact;
	}

	public String getBuildName() {
		return buildName;
	}

	public void setBuildName(String buildName) {
		this.buildName = buildName;
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

	public String getBuildTelphone() {
		return buildTelphone;
	}

	public void setBuildTelphone(String buildTelphone) {
		this.buildTelphone = buildTelphone;
	}

	public Integer getExhibitionDocumentNum() {
		return exhibitionDocumentNum;
	}

	public void setExhibitionDocumentNum(Integer exhibitionDocumentNum) {
		this.exhibitionDocumentNum = exhibitionDocumentNum;
	}
}
