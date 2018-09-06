export default ({$elastic, $indexSettings}) => {
  return context => {
    return $elastic.search({
      ...$indexSettings,
      body: {query: {match_all: {}}},
      size: 4000,
    }).then(response => {
      return response.hits.hits.map(hit => ({
        ...hit._source,
        id: hit._source.id || hit._id,
      }))
    })
  }
}
