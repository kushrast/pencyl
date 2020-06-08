package com.kushrastogi.pencyl.schema;

import javax.persistence.*;
import java.util.List;

/**
 * Entity class for Users
 */
@Entity
public class PencylUser {
    private @Id
    @GeneratedValue
    long id;

    @Column(columnDefinition = "TEXT")
    private String googleSSOId;

    @Column(columnDefinition = "varchar(255) default ''")
    private String email;

    private UserFlags userFlags;

    @Embeddable
    public static class UserFlags {
        @Column(columnDefinition = "bigint default 0")
        long lastReviewTimestamp;

        @Column(columnDefinition = "bigint default 0")
        long suggestedReviewTimestamp;

        @Column(columnDefinition = "boolean default false")
        boolean seenReflectMode = false;
        @Column(columnDefinition = "boolean default false")
        boolean showMiniReflectButton = false;
        @Column(columnDefinition = "boolean default false")
        boolean finishedSignOnTutorial = false;
        @Column(columnDefinition = "boolean default false")
        boolean finishedReviewTutorial = false;

        public UserFlags() {
            this.lastReviewTimestamp = 0;
            this.suggestedReviewTimestamp = 0;
            this.seenReflectMode = false;
            this.showMiniReflectButton = false;
            this.finishedSignOnTutorial = false;
            this.finishedReviewTutorial = false;
        }

        public UserFlags(long lastReviewTimestamp, long suggestedReviewTimestamp, boolean seenReflectMode, boolean showMiniReflectButton, boolean finishedSignOnTutorial, boolean finishedReviewTutorial) {
            this.lastReviewTimestamp = lastReviewTimestamp;
            this.suggestedReviewTimestamp = suggestedReviewTimestamp;
            this.seenReflectMode = seenReflectMode;
            this.showMiniReflectButton = showMiniReflectButton;
            this.finishedSignOnTutorial = finishedSignOnTutorial;
            this.finishedReviewTutorial = finishedReviewTutorial;
        }

        public long getLastReviewTimestamp() {
            return lastReviewTimestamp;
        }

        public void setLastReviewTimestamp(long lastReviewTimestamp) {
            this.lastReviewTimestamp = lastReviewTimestamp;
        }

        public long getSuggestedReviewTimestamp() {
            return suggestedReviewTimestamp;
        }

        public void setSuggestedReviewTimestamp(long suggestedReviewTimestamp) {
            this.suggestedReviewTimestamp = suggestedReviewTimestamp;
        }

        public boolean isFinishedSignOnTutorial() {
            return finishedSignOnTutorial;
        }

        public void setFinishedSignOnTutorial(boolean finishedSignOnTutorial) {
            this.finishedSignOnTutorial = finishedSignOnTutorial;
        }

        public boolean isFinishedReviewTutorial() {
            return finishedReviewTutorial;
        }

        public void setFinishedReviewTutorial(boolean finishedReviewTutorial) {
            this.finishedReviewTutorial = finishedReviewTutorial;
        }

        public boolean isSeenReflectMode() {
            return seenReflectMode;
        }

        public void setSeenReflectMode(boolean seenReflectMode) {
            this.seenReflectMode = seenReflectMode;
        }

        public boolean isShowMiniReflectButton() {
            return showMiniReflectButton;
        }

        public void setShowMiniReflectButton(boolean showMiniReflectButton) {
            this.showMiniReflectButton = showMiniReflectButton;
        }

        @Override
        public String toString() {
            return "UserFlags{" +
                    "lastReviewTimestamp=" + lastReviewTimestamp +
                    ", suggestedReviewTimestamp=" + suggestedReviewTimestamp +
                    ", seenReflectMode=" + seenReflectMode +
                    ", showMiniReflectButton=" + showMiniReflectButton +
                    ", finishedSignOnTutorial=" + finishedSignOnTutorial +
                    ", finishedReviewTutorial=" + finishedReviewTutorial +
                    '}';
        }
    }

    public PencylUser() {
    }

    public PencylUser(String googleSSOId, String email) {
        this.googleSSOId = googleSSOId;
        this.email = email;

        this.userFlags = new UserFlags();
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

    public UserFlags getUserFlags() {
        return userFlags;
    }

    public void setUserFlags(UserFlags userFlags) {
        this.userFlags = userFlags;
    }

    @Override
    public String toString() {
        return "PencylUser{" +
                "id=" + id +
                ", googleSSOId='" + googleSSOId + '\'' +
                ", email='" + email + '\'' +
                ", userFlags=" + userFlags +
                '}';
    }
}
