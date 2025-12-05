import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { supabaseAdmin } from '../supabaseAdmin.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Missing Google credential token'
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email not provided by Google'
      });
    }

    let user;
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers.find(u => u.email === email);

    if (existingUser) {
      user = existingUser;
    } else {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          avatar_url: picture,
          provider: 'google',
          google_id: sub
        }
      });

      if (createError) {
        return res.status(500).json({
          success: false,
          error: `Failed to create user: ${createError.message}`
        });
      }

      user = newUser;
    }

    const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.createSession(user.id);

    if (sessionError) {
      return res.status(500).json({
        success: false,
        error: `Failed to create session: ${sessionError.message}`
      });
    }

    return res.status(200).json({
      success: true,
      session,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Google authentication failed'
    });
  }
});

router.get('/google/callback', (req, res) => {
  res.send('Google OAuth callback working');
});

export default router;
