package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.EasyuiRequest;

/**
 * Created by wangxd on 2017-3-15.
 */
public class CreateExhibitionTypeInfoRequest extends EasyuiRequest {
	private String exhibitionName;
	private String exhibitionSort;

	public String getExhibitionName() {
		return exhibitionName;
	}

	public void setExhibitionName(String exhibitionName) {
		this.exhibitionName = exhibitionName;
	}

	public String getExhibitionSort() {
		return exhibitionSort;
	}

	public void setExhibitionSort(String exhibitionSort) {
		this.exhibitionSort = exhibitionSort;
	}
}
