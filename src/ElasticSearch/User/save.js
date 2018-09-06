export default ({$elastic, $indexSettings}) => {
  return (context, {id, user}) => {
    // Just in case
    if (user.id) {
      delete user.id
    }
    return $elastic.update({
      ...$indexSettings,
      id,
      body: {
        doc: user
      }
    })
  }
}
