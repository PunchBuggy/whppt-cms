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

      const hit = hits[0]
      return {
        ...hit._source,
        id: hit._source.id || hit._id
      }
    })
  }
}
