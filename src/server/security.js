const jwt = require("jsonwebtoken");
const authorization = require("auth-header");
const uniqid = require("uniqid");
const _ = require("lodash");

module.exports = ({ $db, $logger, $config }) => {
  const secret = _.get($config, "security.token.secret", "insecure");
  const issuer = _.get($config, "security.token.issuer", "whppt");
  const audience = _.get($config, "security.token.audience", "");

  return {
    createIdToken(user) {
      return jwt.sign(user, secret, { expiresIn: 60 * 60 * 24 });
    },

    createAccessToken(user, expiresInDays) {
      expiresInDays = expiresInDays || 4;

      const uid = uniqid();
      const scope = {
        account: user.id,
        email: user.email,
        rootUser: user.rootUser,
        projects: user.projects
      };

      const token_details = {
        iss: issuer,
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * expiresInDays, // 4 days
        scope,
        jti: uid,
        alg: "HS256"
      };
      const token = jwt.sign(token_details, secret);

      $logger.info("Auth token issued %o", token, token_details);
      return token;
    },

    decodeAccessToken(token) {
      $logger.info("Auth Token %o", token);
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          $logger.info("Auth Token Decoded %o", decoded, err);
          resolve(decoded);
        });
      });
    },

    authenticate() {
      return (req, res, next) => {
        let auth;
        try {
          auth = authorization.parse(req.get("authorization"));
        } catch (err) {
          $logger.error(
            "No Header, Could not get Authentication header. Please ensure that it is included."
          );
          return res.sendStatus(401);
        }

        this.decodeAccessToken(auth.token)
          .then(token => {
            req.token = token;
            req.user = token.scope;
            next();
          })
          .catch(err => {
            console.log("ERR", err);
            // if (err.name == 'TokenExpiredError')
            res.sendStatus(401);
          });
      };
    },

    authorise: {
      root() {
        return (req, res, next) => {
          const permissions = req.token.scope;
          if (!permissions.rootUser) {
            return res.sendStatus(403);
          }
          next();
        }
      },

      account(accountParam) {
        return (req, res, next) => {
          const requestedAccount = req.params[accountParam];

          const permissions = req.token.scope;
          if (permissions.account !== requestedAccount)
            return res.sendStatus(403);
          next();
        };
      },

      project(project_param, role) {
        return (req, res, next) => {
          const permissions = req.token.scope;
          const projectId = req.params[project_param];
          const projectPermission = _.find(permissions.projects, {
            id: projectId
          });

          const hasProjectAccess =
            !!projectPermission &&
            _.includes(projectPermission.permissions, role);

          if (hasProjectAccess) return next();

          return res.sendStatus(403);
        };
      }
    },

    login(creds) {
      return $db.User.forLogin(creds).then(this._generateUserResponse.bind(this));
    },

    signUp(creds) {
      return $db.User.signUp(creds).then(this._generateUserResponse.bind(this))
    },

    _generateUserResponse(user) {
      return {
        user: {
          id: user.id,
          email: user.email,
          rootUser: user.rootUser,
        },
        access_token: this.createAccessToken(user)
      }
    },

    ROLES: {
      READ: "read",
      EDIT: "edit",
      OWN: "own",
      ADMIN: "admin"
    }
  };
};
