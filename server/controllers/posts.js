module.exports = {
    readPosts: async (req, res) => {
      let { id } = req.session.user;
      let { mine, search, oldest } = req.query;
      const db = await req.app.get('db')
      if (mine && !search) {
        if (oldest) {
          db.post.read_all_oldest_first()
            .then(posts => res.status(200).send(posts))
        } else {
          db.post.read_all_posts()
            .then(posts => res.status(200).send(posts))
        }
      } else if (!mine && search) {
        if (oldest) {
          db.search.search_other_oldest_first([`%${search.toLowerCase()}%`, id])
            .then(posts => res.status(200).send(posts))
        } else {
          db.search.search_other_users_posts([`%${search.toLowerCase()}%`, id])
            .then(posts => res.status(200).send(posts))
        }
      } else if (mine && search) {
        if (oldest) {
          db.search.search_all_oldest_first([`%${search.toLowerCase()}%`])
            .then(posts => res.status(200).send(posts))
        } else {
          db.search.search_all_posts([`%${search.toLowerCase()}%`])
            .then(posts => res.status(200).send(posts))
        }
      } else {
        if (oldest) {
          db.post.read_other_oldest_first([id])
            .then(posts => res.status(200).send(posts))
        } else {
          db.post.read_other_users_posts([id])
            .then(posts => res.status(200).send(posts))
        }
      }
    },
    createPost: async (req, res) => {
      //Grab items off req.body 
      //title, content, img
      const { title, content, img} = req.body;
      //Get the current user
      const {id} = req.session.user;
      //Get database 
      const db = req.app.get('db')
      //Get the date value to create a new date
      const date_created = new Date
      //If statement to check if id is the correct user(checker)
      if(!id){
        return res.sendStatus(403)
      }
      // set variable to the post SQL statment to then post to the database as "new post" for that user
      const post = await db.post.create_post([ title, content, img, id, date_created])
      return res.status(200).send(post)
    },
    readPost: (req, res) => {
      req.app.get('db').post.read_post(req.params.id)
        .then(post => post[0] ? res.status(200).send(post[0]) : res.status(200).send({}))
    },
    deletePost: (req, res) => {
      req.app.get('db').post.delete_post(req.params.id)
        .then(_ => res.sendStatus(200))
    }
  }