CREATE TABLE user (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    username      VARCHAR(25)  NOT NULL,
    password      VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT uq_user_username UNIQUE (username),
    CONSTRAINT uq_user_email    UNIQUE (email)
);

CREATE INDEX idx_email ON user (email);

CREATE TABLE topic (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    title         VARCHAR(50)  NOT NULL,
    description   TEXT         NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_topic       PRIMARY KEY (id),
    CONSTRAINT uq_topic_title UNIQUE (title)
);

CREATE TABLE post (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    title         VARCHAR(50)  NOT NULL,
    content       TEXT         NOT NULL,
    user_id       BIGINT       NOT NULL,
    topic_id      BIGINT       NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_post PRIMARY KEY (id),
    CONSTRAINT fk_post_user  FOREIGN KEY (user_id)  REFERENCES user (id),
    CONSTRAINT fk_post_topic FOREIGN KEY (topic_id) REFERENCES topic (id)
);

CREATE TABLE comment (
    id            BIGINT AUTO_INCREMENT NOT NULL,
    content       TEXT   NOT NULL,
    post_id       BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    created       DATETIME,
    last_modified DATETIME,
    CONSTRAINT pk_comment PRIMARY KEY (id),
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post (id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE subscription (
    id       BIGINT NOT NULL AUTO_INCREMENT,
    user_id  BIGINT NOT NULL,
    topic_id BIGINT NOT NULL,
    created  DATETIME,
    CONSTRAINT pk_subscription           PRIMARY KEY (id),
    CONSTRAINT uq_subscription_user_topic UNIQUE (user_id, topic_id),
    CONSTRAINT fk_subscription_user  FOREIGN KEY (user_id)  REFERENCES user (id),
    CONSTRAINT fk_subscription_topic FOREIGN KEY (topic_id) REFERENCES topic (id)
);
