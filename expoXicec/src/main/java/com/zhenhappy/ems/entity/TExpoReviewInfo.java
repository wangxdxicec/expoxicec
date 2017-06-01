package com.zhenhappy.ems.entity;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by wangxd on 2017-3-1.
 */
@Entity
@Table(name = "t_expoReviewInfo")
public class TExpoReviewInfo {

    private Integer id;
    private String booth_Number;     //展位号
    private String review_header;    //审核标题
    private String review_content;   //审核内容
    private Date review_time;        //审核时间
    private Integer fair_id;         //对应的展会id

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "booth_Number")
    public String getBooth_Number() {
        return booth_Number;
    }

    public void setBooth_Number(String booth_Number) {
        this.booth_Number = booth_Number;
    }

    @Column(name = "review_header")
    public String getReview_header() {
        return review_header;
    }

    public void setReview_header(String review_header) {
        this.review_header = review_header;
    }

    @Column(name = "review_content")
    public String getReview_content() {
        return review_content;
    }

    public void setReview_content(String review_content) {
        this.review_content = review_content;
    }

    @Column(name = "review_time")
    public Date getReview_time() {
        return review_time;
    }

    public void setReview_time(Date review_time) {
        this.review_time = review_time;
    }

    @Column(name = "fair_id")
    public Integer getFair_id() {
        return fair_id;
    }

    public void setFair_id(Integer fair_id) {
        this.fair_id = fair_id;
    }
}

