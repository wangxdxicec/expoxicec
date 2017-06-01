package com.zhenhappy.ems.entity;

import javax.persistence.*;

/**
 * Created by wangxd on 2017-01-16.
 */
@Entity
@Table(name = "t_user_fair")
public class TUserFair {

    private Integer id;
    private Integer user_id;    //对应的用户ID
    private Integer fair_id;    //对应的展会ID
    private String bak_field;

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(name = "user_id")
    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    @Column(name = "fair_id")
    public Integer getFair_id() {
        return fair_id;
    }

    public void setFair_id(Integer fair_id) {
        this.fair_id = fair_id;
    }

    @Column(name = "bak_field")
    public String getBak_field() {
        return bak_field;
    }

    public void setBak_field(String bak_field) {
        this.bak_field = bak_field;
    }
}

