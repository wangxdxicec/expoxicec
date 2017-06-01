package com.zhenhappy.ems.dto.admin;

public class BoothRegisterInfo {
	private String Region;
	private String Area;
	private String Checked;
	private Integer Count;

	public BoothRegisterInfo(){

	}

	public BoothRegisterInfo(String region, String area, String checked, Integer count) {
		Region = region;
		Area = area;
		Checked = checked;
		Count = count;
	}

	public String getRegion() {
		return Region;
	}

	public void setRegion(String region) {
		Region = region;
	}

	public String getArea() {
		return Area;
	}

	public void setArea(String area) {
		Area = area;
	}

	public String getChecked() {
		return Checked;
	}

	public void setChecked(String checked) {
		Checked = checked;
	}

	public Integer getCount() {
		return Count;
	}

	public void setCount(Integer count) {
		Count = count;
	}
}
