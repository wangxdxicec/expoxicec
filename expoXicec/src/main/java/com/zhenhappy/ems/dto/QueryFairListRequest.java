package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017-03-21.
 */
public class QueryFairListRequest extends EasyuiRequest {

	private Integer id;
	private String fair_name;
	private String fair_name_alias;
	private Integer fair_enable;
	private String fair_begin_time;
	private String fair_end_time;
	private String fair_qualification_notice_name;
	private String fair_booth_setup_approval_name;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFair_name() {
		return fair_name;
	}

	public void setFair_name(String fair_name) {
		this.fair_name = fair_name;
	}

	public String getFair_name_alias() {
		return fair_name_alias;
	}

	public void setFair_name_alias(String fair_name_alias) {
		this.fair_name_alias = fair_name_alias;
	}

	public Integer getFair_enable() {
		return fair_enable;
	}

	public void setFair_enable(Integer fair_enable) {
		this.fair_enable = fair_enable;
	}

	public String getFair_begin_time() {
		return fair_begin_time;
	}

	public void setFair_begin_time(String fair_begin_time) {
		this.fair_begin_time = fair_begin_time;
	}

	public String getFair_end_time() {
		return fair_end_time;
	}

	public void setFair_end_time(String fair_end_time) {
		this.fair_end_time = fair_end_time;
	}

	public String getFair_qualification_notice_name() {
		return fair_qualification_notice_name;
	}

	public void setFair_qualification_notice_name(String fair_qualification_notice_name) {
		this.fair_qualification_notice_name = fair_qualification_notice_name;
	}

	public String getFair_booth_setup_approval_name() {
		return fair_booth_setup_approval_name;
	}

	public void setFair_booth_setup_approval_name(String fair_booth_setup_approval_name) {
		this.fair_booth_setup_approval_name = fair_booth_setup_approval_name;
	}
}
