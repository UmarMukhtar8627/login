const express = require('express');
const session = require('express-session');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();

app.use(express.static('public'));

// Session middleware
app.use(session({ secret: 'your_secret_key_here', resave: true, saveUninitialized: true }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Replace these with your Twitter API credentials
const TWITTER_CONSUMER_KEY = 'UXU3c0tVTUZ0NFNLMjBiV2t5NWM6MTpjaQ';
const TWITTER_CONSUMER_SECRET = '4DrQo7Un_2gsuE5MdUBbf2_DSIn_2sWV7Ft-DJYiYguVFPmOQ1';

// Passport configuration
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: 'http://localhost:5501/auth/twitter/callback/', // Change to your callback URL
    },
    (token, tokenSecret, profile, done) => {
      // Handle user authentication here
      return done(null, profile);
    }
  )
);

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback/',
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
