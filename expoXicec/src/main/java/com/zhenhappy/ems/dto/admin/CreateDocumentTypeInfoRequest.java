package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-3-15.
 */
public class CreateDocumentTypeInfoRequest extends EasyuiRequest {
	private Integer documentFairId;
	private Integer documentTypeId;
	private String documentName;
	private String documentTemplate;
	private Integer documentSort;
	private String documentSize;
	private String documentType;
	private String documentRemark;
	private boolean documentRequeired;

	public Integer getDocumentFairId() {
		return documentFairId;
	}

	public void setDocumentFairId(Integer documentFairId) {
		this.documentFairId = documentFairId;
	}

	public Integer getDocumentTypeId() {
		return documentTypeId;
	}

	public void setDocumentTypeId(Integer documentTypeId) {
		this.documentTypeId = documentTypeId;
	}

	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String documentName) {
		this.documentName = documentName;
	}

	public String getDocumentTemplate() {
		return documentTemplate;
	}

	public void setDocumentTemplate(String documentTemplate) {
		this.documentTemplate = documentTemplate;
	}

	public Integer getDocumentSort() {
		return documentSort;
	}

	public void setDocumentSort(Integer documentSort) {
		this.documentSort = documentSort;
	}

	public String getDocumentSize() {
		return documentSize;
	}

	public void setDocumentSize(String documentSize) {
		this.documentSize = documentSize;
	}

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getDocumentRemark() {
		return documentRemark;
	}

	public void setDocumentRemark(String documentRemark) {
		this.documentRemark = documentRemark;
	}

	public boolean isDocumentRequeired() {
		return documentRequeired;
	}

	public void setDocumentRequeired(boolean documentRequeired) {
		this.documentRequeired = documentRequeired;
	}
}
