package com.zhenhappy.ems.dto.admin;

/**
 * Created by wangxd on 2017-03-23.
 */
public class QueryFairBoothInfo {
	private Integer id;
	private Integer boothStatus;
	private String boothNumber;
	private String boothCompany;
	private String boothSetUpUserName;
	private String boothSetUpCompany;
	private String mobilePhone;
	private Integer documentNum;

	public QueryFairBoothInfo() {
		super();
	}

	public QueryFairBoothInfo(Integer id) {
		super();
		this.id = id;
	}

	public QueryFairBoothInfo(Integer id, Integer boothStatus, String boothNumber, String boothCompany,
							  String boothSetUpUserName, String boothSetUpCompany, String mobilePhone) {
		this.id = id;
		this.boothStatus = boothStatus;
		this.boothNumber = boothNumber;
		this.boothCompany = boothCompany;
		this.boothSetUpUserName = boothSetUpUserName;
		this.boothSetUpCompany = boothSetUpCompany;
		this.mobilePhone = mobilePhone;
	}

	public QueryFairBoothInfo(Integer id, Integer boothStatus, String boothNumber, String boothCompany,
							  String boothSetUpUserName, String boothSetUpCompany, Integer documentNum, String mobilePhone) {
		this.id = id;
		this.boothStatus = boothStatus;
		this.boothNumber = boothNumber;
		this.boothCompany = boothCompany;
		this.boothSetUpUserName = boothSetUpUserName;
		this.boothSetUpCompany = boothSetUpCompany;
		this.documentNum = documentNum;
		this.mobilePhone = mobilePhone;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public String getBoothSetUpUserName() {
		return boothSetUpUserName;
	}

	public void setBoothSetUpUserName(String boothSetUpUserName) {
		this.boothSetUpUserName = boothSetUpUserName;
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

	public Integer getDocumentNum() {
		return documentNum;
	}

	public void setDocumentNum(Integer documentNum) {
		this.documentNum = documentNum;
	}

	public String getMobilePhone() {
		return mobilePhone;
	}

	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}
}
