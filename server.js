const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const { getOrCreateUserByGithub } = require('./lib/db/queries');

const app = express();
app.use(cors());
app.use(express.json());

async function githubAuthHandler(req, res) {
  const { code } = req.body;
  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(400).json({ error: 'No access token received from GitHub.' });
    }

    // 2. Fetch user info from GitHub
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const githubUser = await userRes.json();

    if (!githubUser || !githubUser.id) {
      return res.status(400).json({ error: 'Failed to fetch GitHub user.' });
    }

    // 3. Find or create user in your DB
    const user = await getOrCreateUserByGithub(githubUser);

    // 4. Return user info (or session token, etc.)
    req.session.userId = user.id;
    res.json({ userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.post('/api/auth/github', githubAuthHandler);

app.listen(8081, () => {
  console.log('Backend listening on http://localhost:8081');
});

