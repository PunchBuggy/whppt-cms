// const sec = require_local("services/security");
// const createCommand = require_local("domain/User/commands/create");

export default ({ $JsonRouter, $security }) => {
  const router = $JsonRouter();

  router.post("/api/signup", req => {
    return $security.signUp(req.body)
  });

  router.post("/api/login", req => {
    return $security.login(req.body);
  });

  router.get("/sessions/test", $security.authenticate(), () => {
    return Promise.resolve({ test: "Success" });
  });

  return router;
};
