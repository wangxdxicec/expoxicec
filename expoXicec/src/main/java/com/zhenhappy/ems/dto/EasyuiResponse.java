package com.zhenhappy.ems.dto;

import java.util.List;

/**
 * Created by wangxd on 2017-03-21.
 */
public class EasyuiResponse extends BaseResponse {

    private List rows;

    private int total;

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
