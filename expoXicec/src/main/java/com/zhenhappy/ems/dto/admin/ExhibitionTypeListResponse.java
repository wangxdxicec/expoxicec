package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * Created by wangxd on 2016/4/18.
 */
public class ExhibitionTypeListResponse extends BaseResponse {
    public String tExhibitionTypeList;

    public ExhibitionTypeListResponse() {
    }

    public ExhibitionTypeListResponse(String tExhibitionTypeList) {
        this.tExhibitionTypeList = tExhibitionTypeList;
    }

    public String gettExhibitionTypeList() {
        return tExhibitionTypeList;
    }

    public void settExhibitionTypeList(String tExhibitionTypeList) {
        this.tExhibitionTypeList = tExhibitionTypeList;
    }
}
