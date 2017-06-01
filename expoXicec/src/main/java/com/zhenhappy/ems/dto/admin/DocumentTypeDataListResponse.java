package com.zhenhappy.ems.dto.admin;

import com.zhenhappy.ems.dto.BaseResponse;

/**
 * Created by wangxd on 2017/5/08.
 */
public class DocumentTypeDataListResponse extends BaseResponse {
    public String documentTypeInfoList;

    public DocumentTypeDataListResponse() {
    }

    public DocumentTypeDataListResponse(String documentTypeInfoList) {
        this.documentTypeInfoList = documentTypeInfoList;
    }

    public String getDocumentTypeInfoList() {
        return documentTypeInfoList;
    }

    public void setDocumentTypeInfoList(String documentTypeInfoList) {
        this.documentTypeInfoList = documentTypeInfoList;
    }
}
