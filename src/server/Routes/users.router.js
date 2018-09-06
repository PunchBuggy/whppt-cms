export default ({$JsonRouter, $security, $db}) => {
  const router = $JsonRouter();

  router.get('/api/users',
    $security.authenticate(),
    $security.authorise.root(),
    () => {
      return $db.User.list().then(list => list.map(user => ({
        id: user.id,
        email: user.email,
        projects: user.projects,
      })))
    }
  );

  return router
}
