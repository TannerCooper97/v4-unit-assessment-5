select p.title, p.content, p.img, u.profile_pic as author_pic, u.username as author from helo_posts p 
join helo_users u on u.id = p.author_id
where p.id = $1;