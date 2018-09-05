import bcrypt from 'bcrypt'

export default ({$elastic, $options, $indexSettings}) => {
  return (context, {id, email, password}) => {
    // Hash etc the password
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds).then(hash => {
      const user = {
        email: email,
        password: hash,
        projects: [],
      }

      // Store the user w/ hashed pw in the DB
      return $elastic.index({
        ...$indexSettings,
        id: id,
        body: user,
      }).then(response => {
        if (response.error) {
          throw new Error(response.error);
        }
        return {
          ...user,
          id: id
        }
      })
    })
  }
}
