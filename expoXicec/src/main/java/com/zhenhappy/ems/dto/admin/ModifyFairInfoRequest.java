package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseRequest;

import java.util.Date;

/**
 * Created by wangxd on 2017-03-22.
 */
public class ModifyFairInfoRequest extends BaseRequest {
	private Integer projectId;
	private String projectname;
	private String organization;
	private String beginDate;
	private String endDate;
	private Integer status;
	private String boothCreateMethod;
	private String boothHintMinimumInputLength;
	private String extendLoginUrl;
	private String boothNameAutoCapitalization;
	private String useTemplateCompany;
	private String sendAuditSMS;
	private String sMSShowOrgSign;

	public Integer getProjectId() {
		return projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}

	public String getProjectname() {
		return projectname;
	}

	public void setProjectname(String projectname) {
		this.projectname = projectname;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public String getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getBoothCreateMethod() {
		return boothCreateMethod;
	}

	public void setBoothCreateMethod(String boothCreateMethod) {
		this.boothCreateMethod = boothCreateMethod;
	}

	public String getBoothHintMinimumInputLength() {
		return boothHintMinimumInputLength;
	}

	public void setBoothHintMinimumInputLength(String boothHintMinimumInputLength) {
		this.boothHintMinimumInputLength = boothHintMinimumInputLength;
	}

	public String getExtendLoginUrl() {
		return extendLoginUrl;
	}

	public void setExtendLoginUrl(String extendLoginUrl) {
		this.extendLoginUrl = extendLoginUrl;
	}

	public String getBoothNameAutoCapitalization() {
		return boothNameAutoCapitalization;
	}

	public void setBoothNameAutoCapitalization(String boothNameAutoCapitalization) {
		this.boothNameAutoCapitalization = boothNameAutoCapitalization;
	}

	public String getUseTemplateCompany() {
		return useTemplateCompany;
	}

	public void setUseTemplateCompany(String useTemplateCompany) {
		this.useTemplateCompany = useTemplateCompany;
	}

	public String getSendAuditSMS() {
		return sendAuditSMS;
	}

	public void setSendAuditSMS(String sendAuditSMS) {
		this.sendAuditSMS = sendAuditSMS;
	}

	public String getsMSShowOrgSign() {
		return sMSShowOrgSign;
	}

	public void setsMSShowOrgSign(String sMSShowOrgSign) {
		this.sMSShowOrgSign = sMSShowOrgSign;
	}
}
