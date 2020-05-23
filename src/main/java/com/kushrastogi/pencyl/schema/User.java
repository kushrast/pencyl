package com.kushrastogi.pencyl.schema;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.List;

/**
 * Entity class for Users
 */
@Entity
public class User {
    private @Id
    @GeneratedValue
    long id;

    private String googleSSOId;
    private String email;

    @ElementCollection
    private List<Long> thoughtsInReview;

    public User() {
    }

    public User(long id, String email, List<Long> thoughtsInReview) {
        this.id = id;
        this.email = email;
        this.thoughtsInReview = thoughtsInReview;
    }

    public User(String googleSSOId, String email) {
        this.googleSSOId = googleSSOId;
        this.email = email;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getGoogleSSOId() {
        return googleSSOId;
    }

    public void setGoogleSSOId(String googleSSOId) {
        this.googleSSOId = googleSSOId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getThoughtsInReview() {
        return thoughtsInReview;
    }

    public void setThoughtsInReview(List<Long> thoughtsInReview) {
        this.thoughtsInReview = thoughtsInReview;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", googleSSOId='" + googleSSOId + '\'' +
                ", email='" + email + '\'' +
                ", thoughtsInReview=" + thoughtsInReview +
                '}';
    }
}
