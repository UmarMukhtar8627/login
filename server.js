const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;

const app = express();
const port = process.env.PORT || 5500;

// Configure Passport
passport.use(new TwitterStrategy({
  consumerKey: '8rlnjxMEEcUuLmkcK4m50DkRJ',
  consumerSecret: 'zZjwi8LBrq27UfOZsV9xjgVBT9hFxVAuA3aoanonrJUSb',
  callbackURL: 'http://localhost:' + port + '/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
  // Here, you can handle user creation or login based on Twitter profile data.
  // 'profile' contains Twitter user information.
  return done(null, profile);
}));

// Initialize Passport
app.use(passport.initialize());

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Twitter login route
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter callback route
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
