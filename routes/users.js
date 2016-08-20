var express = require('express');
var router = express.Router();

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

router.post('/register', function (req, res, next) {
  // Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.files && req.files.profileImage){
    console.log('Uploading File...');

    // File Info
    var profileImageOriginalName = req.files.profileImage.originalname;
    var profileImageName = req.files.profileImage.name;
    var profileImageMime = req.files.profileImage.mimetype;
    var profileImagePath = req.files.profileImage.path;
    var profileImageExt = req.files.profileImage.extension;
    var profileImageSize = req.files.profileImage.size;
  }else{
    // Set a Default Image
    var profileImage = 'noimage.jpg';
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
    User.creatUser(newUser, function (err, user) {
      if (err) throw err
        console.log(user);
    });

    // Success Message
    req.flash('success', 'You are now registered and may login');
    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
