package com.zhenhappy.ems.dto.admin;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-3-1.
 */
public class TExpoReviewInfoForAdmin {

    private Integer id;
    private String booth_Number;     //展位号
    private String review_header;    //审核标题
    private String review_content;   //审核内容
    private String review_time;      //审核时间
    private Integer fair_id;         //对应的展会id
    private Integer reviewStatus;    //审核状态

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBooth_Number() {
        return booth_Number;
    }

    public void setBooth_Number(String booth_Number) {
        this.booth_Number = booth_Number;
    }

    public String getReview_header() {
        return review_header;
    }

    public void setReview_header(String review_header) {
        this.review_header = review_header;
    }

    public String getReview_content() {
        return review_content;
    }

    public void setReview_content(String review_content) {
        this.review_content = review_content;
    }

    public String getReview_time() {
        return review_time;
    }

    public void setReview_time(String review_time) {
        this.review_time = review_time;
    }

    public Integer getFair_id() {
        return fair_id;
    }

    public void setFair_id(Integer fair_id) {
        this.fair_id = fair_id;
    }

    public Integer getReviewStatus() {
        return reviewStatus;
    }

    public void setReviewStatus(Integer reviewStatus) {
        this.reviewStatus = reviewStatus;
    }
}

