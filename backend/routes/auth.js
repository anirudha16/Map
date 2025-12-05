import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

router.post('/google', async (req, res) => {
  const { supabaseAdmin } = await import('../supabaseAdmin.js');
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Missing Google credential token'
      });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('❌ GOOGLE_CLIENT_ID not set');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: GOOGLE_CLIENT_ID not set'
      });
    }

    const googleClient = new OAuth2Client(googleClientId);

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId
      });
    } catch (verifyError) {
      console.error('❌ Google token verification failed:', verifyError.message);
      return res.status(400).json({
        success: false,
        error: 'Google token verification failed: ' + verifyError.message
      });
    }

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email not provided by Google'
      });
    }

    console.log('✅ Google login attempt for:', email);

    let user;
    try {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers.find(u => u.email === email);

      if (existingUser) {
        console.log('✅ User already exists:', email);
        user = existingUser;
      } else {
        console.log('📝 Creating new user:', email);
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
          console.error('❌ Failed to create user:', createError.message);
          return res.status(500).json({
            success: false,
            error: `Failed to create user: ${createError.message}`
          });
        }

        user = newUser;
      }

      console.log('🔑 Creating session for user:', user.id);
      const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.createSession(user.id);

      if (sessionError) {
        console.error('❌ Failed to create session:', sessionError.message);
        return res.status(500).json({
          success: false,
          error: `Failed to create session: ${sessionError.message}`
        });
      }

      console.log('✅ Google login successful for:', email);
      return res.status(200).json({
        success: true,
        session,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata
        }
      });
    } catch (supabaseError) {
      console.error('❌ Supabase error:', supabaseError.message);
      return res.status(500).json({
        success: false,
        error: 'Supabase error: ' + supabaseError.message
      });
    }
  } catch (error) {
    console.error('❌ Google OAuth error:', error.message || error);
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
