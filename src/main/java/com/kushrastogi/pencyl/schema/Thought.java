package com.kushrastogi.pencyl.schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Entity class for Thoughts
 */
@Entity
public class Thought {
    private @Id
    @GeneratedValue
    Long id;
    private long user_id;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
    private long creation_timestamp_ms;

    @Embeddable
    public static class Tag {
        private String tag_key;
        private String tag_content;

        public Tag() {

        }

        public Tag(String tag_key, String tag_content) {
            this.tag_key = tag_key;
            this.tag_content = tag_content;
        }

        public String getTag_key() {
            return tag_key;
        }

        public void setTag_key(String tag_key) {
            this.tag_key = tag_key;
        }

        public String getTag_content() {
            return tag_content;
        }

        public void setTag_content(String tag_content) {
            this.tag_content = tag_content;
        }
    }

    @ElementCollection
    private List<Tag> tags = new ArrayList<>();

    @Embeddable
    public static class Reply {
        private String reply_content;
        private long reply_timestamp_ms;

        public Reply() {

        }

        public Reply(String reply_content, long reply_timestamp_ms) {
            this.reply_content = reply_content;
            this.reply_timestamp_ms = reply_timestamp_ms;
        }

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
    private List<Reply> replies = new ArrayList<>();
    private int plusOnes;
    private long last_edited_timestamp_ms;
    private long last_reviewed_timestamp_ms;
    private boolean completed;

    private @Version
    @JsonIgnore
    Long version;

    public Thought() {
    }

    public Thought(long userId, String title, String content, long creation_timestamp_ms, List<Tag> tags, List<Reply> replies, int plusOnes) {
        this.user_id = userId;
        this.title = title;
        this.content = content;
        this.creation_timestamp_ms = creation_timestamp_ms;
        this.tags = tags;
        this.replies = replies;
        this.plusOnes = plusOnes;
        this.completed = false;
        this.last_edited_timestamp_ms = creation_timestamp_ms;
        this.last_reviewed_timestamp_ms = creation_timestamp_ms;
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

    public void setCreation_timestamp_ms(long creation_timestamp_ms) {
        this.creation_timestamp_ms = creation_timestamp_ms;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }

    public int getPlusOnes() {
        return plusOnes;
    }

    public void setPlusOnes(int plusOnes) {
        this.plusOnes = plusOnes;
    }

    public long getLast_edited_timestamp_ms() {
        return last_edited_timestamp_ms;
    }

    public void setLast_edited_timestamp_ms(long last_edited_timestamp_ms) {
        this.last_edited_timestamp_ms = last_edited_timestamp_ms;
    }

    public long getLast_reviewed_timestamp_ms() {
        return last_reviewed_timestamp_ms;
    }

    public void setLast_reviewed_timestamp_ms(long last_reviewed_timestamp_ms) {
        this.last_reviewed_timestamp_ms = last_reviewed_timestamp_ms;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
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
                plusOnes == thought.plusOnes &&
                last_edited_timestamp_ms == thought.last_edited_timestamp_ms &&
                last_reviewed_timestamp_ms == thought.last_reviewed_timestamp_ms &&
                completed == thought.completed &&
                id.equals(thought.id) &&
                Objects.equals(title, thought.title) &&
                Objects.equals(content, thought.content) &&
                Objects.equals(tags, thought.tags) &&
                Objects.equals(replies, thought.replies) &&
                Objects.equals(version, thought.version);
    }

    @Override
    public String toString() {
        return "Thought{" +
                "id=" + id +
                ", user_id=" + user_id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", creation_timestamp_ms=" + creation_timestamp_ms +
                ", tags=" + tags +
                ", replies=" + replies +
                ", plusOnes=" + plusOnes +
                ", last_edited_timestamp_ms=" + last_edited_timestamp_ms +
                ", last_reviewed_timestamp_ms=" + last_reviewed_timestamp_ms +
                ", completed=" + completed +
                ", version=" + version +
                '}';
    }

    public void updateFrom(Thought updated) {
        setTitle(updated.title);
        setContent(updated.content);
        setTags(updated.tags);
        setReplies(updated.replies);
        setPlusOnes(updated.plusOnes);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user_id, title, content, creation_timestamp_ms, tags, replies, plusOnes, last_edited_timestamp_ms, last_reviewed_timestamp_ms, completed, version);
    }
}
