const bcrypt = require('bcryptjs');

module.exports = {

  register: async (req, res) => {
      //Get username, and pass off req.body
    const { username, password} = req.body;
      //Get database
    const db = req.app.get('db');
     //Set varible to find the username through SQLfile
    const result = await db.user.find_user_by_username([username]);
     //set an existing user to the the first result
    const existingUser = result[0];
    //Check if it is an existing user
    if (existingUser) {
      return res.status(409).send('Username taken');
    }
    //Salt and hash their password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    //Set newly created user to a registered user
    const registeredUser = await db.create_user([username, hash, `https://robohash.org/${username}.png`]);
    //Set current user to registered user
    const user = registeredUser[0];
    //Current user session is what was accessed
    req.session.user = { id: user.id, username: user.username, profilePic: user.profile_pic};
    return res.status(201).send(req.session.user);
  },

  login: async (req, res) => {
      //Get username and password off req.body
    const {username, password} = req.body;
        //Set new foundUser to the user serched through SQL file
    const foundUser = await req.app.get('db').user.find_user_by_username([username])
    //Set user to the newly FoundUser
    const user = foundUser[0];
    //If it is not the correct user login, tell to register an account.
    if(!user){
        return res.status(401).send('User not found. Register before logging in.');
    }
    //Compare password to the users.hased password
    const isAuthenticated = bycrpt.compareSync(password, user.hash);
    if(!isAuthenticated){
        return res.status(403).send('Incorrect Password')
    }
    //Set current user session to logged in user
    req.session.user = {id: user.id, username: user.username,
    profilePic: `https://robohash.org/${username}.png`};
    return res.send(req.session.user);
},
//Logout an DESTROY the session. 
  logout: (req, res) => {
      req.session.destroy();
      return res.sendStatus(200)
  },
//Get User
  getUser: (req, res) => {
      //If the session is not null(timed out), continue to use sesssion.
      if(req.session.user !== null){
          return res.send(req.session.user);
      }else{
        //Otherwise terminate session
          res.status(404).send('No user logged within current session')
      }
  }
}