const _ = require('lodash');
const dgraph = require_local('services/dgraph');


module.exports = (id) => {
  return dgraph.query(`
      {
        user(func: eq(id, "${id}"))
         {
            uid
            id
            email
            admin{
              name
              id
              key
            }
            read{
              name
              id
              key
            }
            edit{
              name
              id
              key
            }
            own {
              name
              id
              key
            }
          }
      }
    `).then(results => {
    return results.user[0]
  })
};