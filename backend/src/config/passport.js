import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Agora procuramos pelo ID do Google para ser mais robusto
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          // Se o utilizador não existe, verificamos se o email já está em uso
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user);
          }
          
          // Se for mesmo um novo utilizador, criamo-lo com os dados do Google
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName, // Capturamos o nome do perfil do Google
            email: profile.emails[0].value,
          });
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);