package com.kushrastogi.thoughtbank.schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

/**
 * Entity class for Thoughts
 */
@Entity
public class Thought {
    public enum Categories {
        REGULAR,
        ACTION_ITEM
    }

    private @Id @GeneratedValue Long id;
    private long user_id;
    private String title;
    private String content;
    private long creation_timestamp_ms;

    private List<String> tags;
    private int category;

    @Embeddable
    class Reply {
        private String reply_content;
        private long reply_timestamp_ms;

        public String getReply_content() {
            return reply_content;
        }

        public void setReply_content(String reply_content) {
            this.reply_content = reply_content;
        }

        public long getReply_timestamp_ms() {
            return reply_timestamp_ms;
        }

        public void setReply_timestamp_ms(long reply_timestamp_ms) {
            this.reply_timestamp_ms = reply_timestamp_ms;
        }
    }

    @ElementCollection
    private List<Reply> replies;
    private int stars;
    private long last_edited_timestamp_ms;
    private long last_reviewed_timestamp_ms;
    private boolean deleted;

    private @Version
    @JsonIgnore
    Long version;

    public Thought() {
    }

    public Thought(String title, String content, long creation_timestamp_ms, int category) {
        this.title = title;
        this.content = content;
        this.creation_timestamp_ms = creation_timestamp_ms;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getCreation_timestamp_ms() {
        return creation_timestamp_ms;
    }

    public void setCreation_timestamp_ms(int creation_timestamp_ms) {
        this.creation_timestamp_ms = creation_timestamp_ms;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }

    public int getStars() {
        return stars;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public long getLast_edited_timestamp_ms() {
        return last_edited_timestamp_ms;
    }

    public void setLast_edited_timestamp_ms(int last_edited_timestamp_ms) {
        this.last_edited_timestamp_ms = last_edited_timestamp_ms;
    }

    public long getLast_reviewed_timestamp_ms() {
        return last_reviewed_timestamp_ms;
    }

    public void setLast_reviewed_timestamp_ms(int last_reviewed_timestamp_ms) {
        this.last_reviewed_timestamp_ms = last_reviewed_timestamp_ms;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Thought thought = (Thought) o;
        return user_id == thought.user_id &&
                creation_timestamp_ms == thought.creation_timestamp_ms &&
                category == thought.category &&
                stars == thought.stars &&
                last_edited_timestamp_ms == thought.last_edited_timestamp_ms &&
                last_reviewed_timestamp_ms == thought.last_reviewed_timestamp_ms &&
                deleted == thought.deleted &&
                id.equals(thought.id) &&
                Objects.equals(title, thought.title) &&
                Objects.equals(content, thought.content) &&
                Objects.equals(tags, thought.tags) &&
                Objects.equals(replies, thought.replies) &&
                Objects.equals(version, thought.version);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user_id, title, content, creation_timestamp_ms, tags, category, replies, stars, last_edited_timestamp_ms, last_reviewed_timestamp_ms, deleted, version);
    }
}
