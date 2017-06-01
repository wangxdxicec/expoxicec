package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-03-29.
 */
public class EditBoothInfoRequest extends EasyuiRequest {
	private Integer expoxicecBuildId;		//对应修改展位id
	private Integer expoxicecId;			//展位搭建联系id
	private Integer expoxicecFairId;		//对应的展会id
	private String boothTypeId;				//展位类型
	private String boothName;				//展位号
	private String boothCompany;			//参展单位
	private String boothArea;				//展位面积
	private String expoxicecFairContact;	//展位搭建联系人
	private String expoxicecFairMobile;		//展位搭建联系电话

	public Integer getExpoxicecBuildId() {
		return expoxicecBuildId;
	}

	public void setExpoxicecBuildId(Integer expoxicecBuildId) {
		this.expoxicecBuildId = expoxicecBuildId;
	}

	public Integer getExpoxicecId() {
		return expoxicecId;
	}

	public void setExpoxicecId(Integer expoxicecId) {
		this.expoxicecId = expoxicecId;
	}

	public Integer getExpoxicecFairId() {
		return expoxicecFairId;
	}

	public void setExpoxicecFairId(Integer expoxicecFairId) {
		this.expoxicecFairId = expoxicecFairId;
	}

	public String getBoothTypeId() {
		return boothTypeId;
	}

	public void setBoothTypeId(String boothTypeId) {
		this.boothTypeId = boothTypeId;
	}

	public String getBoothName() {
		return boothName;
	}

	public void setBoothName(String boothName) {
		this.boothName = boothName;
	}

	public String getBoothCompany() {
		return boothCompany;
	}

	public void setBoothCompany(String boothCompany) {
		this.boothCompany = boothCompany;
	}

	public String getBoothArea() {
		return boothArea;
	}

	public void setBoothArea(String boothArea) {
		this.boothArea = boothArea;
	}

	public String getExpoxicecFairContact() {
		return expoxicecFairContact;
	}

	public void setExpoxicecFairContact(String expoxicecFairContact) {
		this.expoxicecFairContact = expoxicecFairContact;
	}

	public String getExpoxicecFairMobile() {
		return expoxicecFairMobile;
	}

	public void setExpoxicecFairMobile(String expoxicecFairMobile) {
		this.expoxicecFairMobile = expoxicecFairMobile;
	}
}
