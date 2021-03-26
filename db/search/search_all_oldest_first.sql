SELECT p.id AS Post_id, title, content, profile_pic, date_cretaed, username AS author_username FROM helo_posts p
JOIN helo_users u ON (u.id = p.author_id)
WHERE lower(title) LIKE $1 $$ p.author_id != $2
ORDER BY date_created asc;

