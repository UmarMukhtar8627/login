const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(session({ secret: 'your_secret_key_here', resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Replace these with your Twitter API credentials
const TWITTER_CONSUMER_KEY = 'UXU3c0tVTUZ0NFNLMjBiV2t5NWM6MTpjaQ';
const TWITTER_CONSUMER_SECRET = '9Tqhfk0PcMvowfzLZgZPTCfb1OdBjHzFRx4ntpr8W8D6giqvJX';

// Passport configuration
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:5501/auth/twitter/callback',
    },
    (token, tokenSecret, profile, done) => {
      // Here, you would typically perform user authentication and store user data in your database.
      // For this example, we'll simply log the user's Twitter profile.
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/auth/twitter/login', passport.authenticate('twitter'), (req, res) => {
  // This route is for processing the login form. It will redirect to Twitter for authentication.
  // After successful authentication, it will redirect back to your callback URL.
  // You can handle any necessary post-authentication logic here.
});

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, you can redirect or respond as needed.
    res.redirect('/success');
  }
);

app.get('/success', (req, res) => {
  res.send('Logged in successfully!');
});

// Start the server
const port = process.env.PORT || 5501;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
