const relatedOfTypeHof = args => (id, typeInput) => {
  const {
    nodes,
    edges,
    nodeIdAttr,
    typeHof,
    node1IdAttrOnEdge,
    node2IdAttrOnEdge,
    isDirectedGraph,
  } = args

  const typeFn = typeHof(typeInput)

  if (id === 'all') {
    return nodes.filter(typeFn)
  } else {
    const edges1 = edges.filter(e => {
      if (isDirectedGraph) {
        return (e[node1IdAttrOnEdge] === id)
      } else {
        return ([e[node1IdAttrOnEdge], e[node2IdAttrOnEdge]].includes(id))
      }
    })
    const childIds = edges1.map(e => e[node1IdAttrOnEdge] === id ? e[node2IdAttrOnEdge] : e[node1IdAttrOnEdge])
    return nodes.filter(e => {
      return childIds.includes(e[nodeIdAttr]) && typeFn(e)
    })
  }
}


const graphDenormalizer = config => graph => spec => {

  const relatedOfType = relatedOfTypeHof(Object.assign({}, config, graph))


  const helper = (parentId, typeInput, typeSpec) => {
    const entities = relatedOfType(parentId, typeInput)
    return entities.map(entity => {
      let extra
      if (typeSpec === null) {
        extra = {}
      } else {
        extra = Object.keys(typeSpec).reduce((acc, key) => {
          const deeperTypeInput = key
          const deeperTypeSpec = typeSpec[key]
          const deeperParentId = entity[config.nodeIdAttr]
          acc[key] = helper(deeperParentId, deeperTypeInput, deeperTypeSpec)
          return acc
        }, {})
      }
      return Object.assign({}, entity, extra)
    })
  }

  const keys = Object.keys(spec)
  return Object.keys(spec).reduce((acc, key) => {
    const typeInput = key
    const typeSpec = spec[key]
    acc[key] = helper('all', typeInput, typeSpec)
    return acc
  }, {})
}

module.exports.graphDenormalizer = graphDenormalizer
module.exports.relatedOfTypeHof = relatedOfTypeHof
