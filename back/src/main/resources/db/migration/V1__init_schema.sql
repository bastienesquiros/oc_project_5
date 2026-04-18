CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    display_name  VARCHAR(25)  NOT NULL,
    password      VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uq_users_display_name UNIQUE (display_name),
    CONSTRAINT uq_users_email        UNIQUE (email)
);

CREATE INDEX idx_email ON users (email);

CREATE TABLE topics (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    title         VARCHAR(50)  NOT NULL,
    description   TEXT         NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_topics       PRIMARY KEY (id),
    CONSTRAINT uq_topics_title UNIQUE (title)
);

CREATE TABLE posts (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    title         VARCHAR(50)  NOT NULL,
    content       TEXT         NOT NULL,
    user_id       BIGINT       NOT NULL,
    topic_id      BIGINT       NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_posts PRIMARY KEY (id),
    CONSTRAINT fk_posts_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_posts_topic FOREIGN KEY (topic_id) REFERENCES topics (id)
);

CREATE TABLE comments (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    content       TEXT   NOT NULL,
    post_id       BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_comments PRIMARY KEY (id),
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts (id),
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE subscriptions (
    id       BIGINT NOT NULL AUTO_INCREMENT,
    user_id  BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    created  DATETIME,
    CONSTRAINT pk_subscriptions           PRIMARY KEY (id),
    CONSTRAINT uq_subscriptions_user_topic UNIQUE (user_id, topic_id),
    CONSTRAINT fk_subscriptions_user  FOREIGN KEY (user_id)  REFERENCES users (id),
    CONSTRAINT fk_subscriptions_topic FOREIGN KEY (topic_id) REFERENCES topics (id)
);
