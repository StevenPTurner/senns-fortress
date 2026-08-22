--seed data
INSERT INTO users (id, username, email, firstname, lastname, active)
VALUES (1, '<username>', '<email>', '<first name>', '<last name>', true);

INSERT INTO auth_method (id, user_id, provider, email, provider_id)
VALUES (1, 1, 'GOOGLE', '<gmail>', '<google_id>');

INSERT INTO list_site (id, name, link, image, image_alt, low_quality)
VALUES (1, 'Comic Book Resources', 'https://www.cbr.com/category/lists/', 'cbr-logo.svg', 'CBR logo', false),
       (2, 'Collider', 'https://collider.com/tag/lists/', 'collider-logo.svg', 'Collider logo', false),
       (3, 'Comic Book', 'https://comicbook.com/tag/list-feature/', 'comicbook-logo.svg', 'Comic Book logo', false),
       (4, 'Movie Web', 'https://movieweb.com/lists/', 'movieweb-logo.svg', 'Movie Web logo', true),
       (5, 'Screen Rant', 'https://screenrant.com/lists/', 'screenrant-logo.svg', 'Screen Rant logo', false),
       (6, 'The Gamer', 'https://www.thegamer.com/category/lists/', 'thegamer-logo.svg', 'The Gamer logo', true),
       (7, 'Dual Shockers', 'https://www.dualshockers.com/lists/', 'dualshockers-logo.svg', 'Dual Shockers logo',false);

INSERT INTO quiz_site(id, name, link, image, image_alt, low_quality)
VALUES (1, 'AniGuessr', 'https://aniguessr.com/', 'aniguessr-logo.png', 'AniGuessr logo', false),
       (2, 'Gamedle', 'https://gamedle.wtf/', 'gamedle-logo.png', 'Gamdele logo', false);

INSERT INTO quiz_stat(id, quiz_site_id, score )
VALUES (1, 1, 58500),
       (2, 2, 1);

SELECT setval(
    pg_get_serial_sequence('users', 'id'),
    (SELECT MAX(id) FROM users)
);

SELECT setval(
    pg_get_serial_sequence('auth_method', 'id'),
    (SELECT MAX(id) FROM auth_method)
);

SELECT setval(
    pg_get_serial_sequence('list_site', 'id'),
    (SELECT MAX(id) FROM list_site)
);

SELECT setval(
    pg_get_serial_sequence('quiz_site', 'id'),
    (SELECT MAX(id) FROM quiz_site)
);

SELECT setval(
    pg_get_serial_sequence('quiz_stat', 'id'),
    (SELECT MAX(id) FROM quiz_stat)
);