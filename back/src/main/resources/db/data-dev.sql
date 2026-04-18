-- ==================== TOPICS ====================
INSERT INTO topics (title, description, created, last_modified) VALUES
    ('Java',       'Tout sur le langage Java : syntaxe, JVM, frameworks.',      NOW(), NOW()),
    ('Spring',     'Spring Boot, Spring Security, Spring Data et l''écosystème.', NOW(), NOW()),
    ('JavaScript', 'JS vanilla, ES2024, Node.js et outillage front-end.',        NOW(), NOW()),
    ('Angular',    'Framework front-end Angular, RxJS, NgRx.',                   NOW(), NOW()),
    ('DevOps',     'CI/CD, Docker, Kubernetes, cloud et infrastructure.',         NOW(), NOW());

-- ==================== USERS ====================
-- Passwords are BCrypt of "Password1!" 
INSERT INTO users (display_name, password, email, created, last_modified) VALUES
    ('alice',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'alice@example.com',   NOW(), NOW()),
    ('bob',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'bob@example.com',     NOW(), NOW()),
    ('charlie', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'charlie@example.com', NOW(), NOW());

-- ==================== POSTS ====================
INSERT INTO posts (title, content, user_id, topic_id, created, last_modified) VALUES
    ('Débuter avec Spring Boot',    'Spring Boot permet de créer des applications Java rapidement grâce à l''auto-configuration...', 1, 2, NOW(), NOW()),
    ('Les streams Java 8+',         'Les streams permettent de manipuler des collections de façon fonctionnelle et lisible...',      2, 1, NOW(), NOW()),
    ('Angular vs React en 2024',    'Comparatif des deux frameworks front-end les plus populaires du marché...',                     1, 4, NOW(), NOW()),
    ('Docker pour les débutants',   'Docker simplifie le déploiement en conteneurisant vos applications...',                         3, 5, NOW(), NOW()),
    ('Async/Await en JavaScript',   'La gestion de l''asynchrone en JS a évolué : callbacks, promises, async/await...',              2, 3, NOW(), NOW());

-- ==================== COMMENTS ====================
INSERT INTO comments (content, post_id, user_id, created, last_modified) VALUES
    ('Super article, merci !',                     1, 2, NOW(), NOW()),
    ('J''utilise Spring Boot depuis 2 ans, top.',  1, 3, NOW(), NOW()),
    ('Les streams ont changé ma façon de coder.',  2, 1, NOW(), NOW()),
    ('Je préfère React pour sa flexibilité.',       3, 3, NOW(), NOW()),
    ('Docker m''a sauvé la mise en prod.',          4, 1, NOW(), NOW());

-- ==================== SUBSCRIPTIONS ====================
INSERT INTO subscriptions (user_id, topic_id, created) VALUES
    (1, 1, NOW()),  -- alice    -> Java
    (1, 2, NOW()),  -- alice    -> Spring
    (2, 1, NOW()),  -- bob      -> Java
    (2, 3, NOW()),  -- bob      -> JavaScript
    (3, 4, NOW()),  -- charlie  -> Angular
    (3, 5, NOW());  -- charlie  -> DevOps
