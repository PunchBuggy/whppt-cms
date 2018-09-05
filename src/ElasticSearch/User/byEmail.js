export default ({$elastic, $indexSettings}) => {
  return (context, {email}) => {
    return $elastic.search({
      ...$indexSettings,
      body: {
        query: {
          bool: {
            must: [
              {match: {email: email}}
            ]
          }
        }
      }
    }).then(response => {
      const hits = response.hits.hits
      if (!hits.length) {
        return null
      }
      return hits[0]._source
    })
  }
}
