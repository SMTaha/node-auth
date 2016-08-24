var multer = require('multer');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    'title': 'Login'
  });
})

router.post('/register', multer().single('profileImage'), function (req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.file){
    console.log('Uploading File...');

    // File Info
    var profileImageOriginalName  = req.file.originalname;
    var profileImageName          = req.file.name;
    var profileImagePath          = req.file.path;
    var profileImageMime          = req.file.mimetype;
    var profileImageExt           = req.file.extension;
    var profileImageSize          = req.file.size;
  } else {
    // Set a Default Image
    var profileImageName = 'noimage.jpg';
  }

  // Form Validation

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check for Errors

  var errors = req.validationErrors();
  if(errors){
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    })
  }else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileImage: profileImageName
    });

    // Create User
    User.createUser(newUser, function (err, user) {
      if (err) throw err
        console.log(user);
    });

    // Success Message
    req.flash('success', 'You are now registered and may login');
    res.location('/');
    res.redirect('/');
  }
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if(err) throw err;
      if(!user){
        console.log('Unkown User');
        return done(null, false, { message: 'Unknown User' });
      }
    })
  }
));


// router.post('/login', function (req, res) {
//   console.log(req.body);
// })



router.post('/login',
          passport.authenticate('local', {
                failureRedirect: '/users/login',
                failureFlash: 'Invalid Username or Password'
          }),
          function (req, res) {
                console.log('Authentication Successful');
                req.flash('success', 'Y ou are logged in');
                res.redirect('/');
            });



module.exports = router;
