const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();
const port = process.env.PORT || 5500;

// Serve static files from a directory (e.g., 'public')
app.use(express.static('public'));

// Configure Passport
passport.use(new TwitterStrategy({
  consumerKey: 'UXU3c0tVTUZ0NFNLMjBiV2t5NWM6MTpjaQ',
  consumerSecret: '0ng_i2zT3kmCNBGAj_t9GQqYhC13j1DtCnGuZzUTLGCenooDjv',
  callbackURL: 'http://localhost:' + port + '/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
  // Here, you can handle user creation or login based on Twitter profile data.
  // 'profile' contains Twitter user information.
  return done(null, profile);
}));

// Initialize Passport
app.use(passport.initialize());

// Define routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
