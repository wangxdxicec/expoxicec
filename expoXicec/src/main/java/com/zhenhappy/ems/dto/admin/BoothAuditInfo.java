package com.zhenhappy.ems.dto.admin;

public class BoothAuditInfo {
	private Integer value;
	private String color;
	private String hightlight;
	private String label;

	public BoothAuditInfo(){

	}

	public BoothAuditInfo(Integer value, String color, String hightlight, String label) {
		this.value = value;
		this.color = color;
		this.hightlight = hightlight;
		this.label = label;
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getHightlight() {
		return hightlight;
	}

	public void setHightlight(String hightlight) {
		this.hightlight = hightlight;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
}
