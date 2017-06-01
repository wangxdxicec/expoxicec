package com.zhenhappy.ems.dto;

/**
 * Created by wangxd on 2017/5/15.
 */
public class ExpoBoothTemplateInfoResponse extends BaseResponse {
    public String tExpoBuildTemplateInfoList;

    public ExpoBoothTemplateInfoResponse() {
    }

    public ExpoBoothTemplateInfoResponse(String tExpoBuildTemplateInfoList) {
        this.tExpoBuildTemplateInfoList = tExpoBuildTemplateInfoList;
    }

    public String gettExpoBuildTemplateInfoList() {
        return tExpoBuildTemplateInfoList;
    }

    public void settExpoBuildTemplateInfoList(String tExpoBuildTemplateInfoList) {
        this.tExpoBuildTemplateInfoList = tExpoBuildTemplateInfoList;
    }
}
