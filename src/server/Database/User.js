import bcrypt from "bcrypt";
import { map } from "lodash";

export default ({ $Id, $logger, $config, $projects }) => {
  const UserContext = () => {
    return {
      User: $config.db.User,
      context: {
        $Id,
        $logger,
        $projects,
      }
    };
  };
  const rootUser =
    $config && $config.security && $config.security.rootUser
      ? $config.security.rootUser
      : undefined;

  return {
    forLogin: async ({ email, password }) => {
      if (rootUser && email === rootUser.id && password === rootUser.password)
        return Promise.resolve({
          id: rootUser.id,
          email: rootUser.email,
          projects: map($projects, p => ({
            id: p.id,
            name: p.name,
            permissions: ["own", "admin", "edit", "read"]
          }))
        });

      const { User, context } = UserContext();

      // Grab the user
      const user = await User.byEmail(context, {email});
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const matches = await bcrypt.compare(password, user.password)
      if (!matches) {
        throw new Error('Invalid credentials');
      }

      return user
    },

    signUp: async ({email, password}) => {
      const {User, context} = UserContext();

      // Check if there's a user already
      const user = await User.byEmail(context, {email});
      if (user) {
        throw new Error('User already exists');
      }

      return User.signUp(context, {
        id: $Id(),
        email,
        password
      })
    }
  };
};
