import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { User, IUser } from '../models/User'

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user: IUser | null = await User.findOne({ username }).select('+password')

        if (!user) {
          return done(null, false, { message: 'Invalid username or password' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
          return done(null, false, { message: 'Invalid username or password' })
        }

        if (!user.isActive) {
          return done(null, false, { message: 'Account is deactivated' })
        }

        // We are returning the full user object here, but password will be removed by toJSON method if defined
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport 