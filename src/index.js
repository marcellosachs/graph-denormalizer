const relatedOfTypeHof = args => (id, typeInput) => {
  const {
    entities,
    idAttr,
    typeHof,
    edges,
    edgeIdAttr1,
    edgeIdAttr2,
    isDirected,
  } = args

  const typeFn = typeHof(typeInput)

  console.log('relatedOfType', id, typeInput)

  if (id === 'all') {
    return entities.filter(typeFn)
  } else {
    const edges1 = edges.filter(e => {
      if (isDirected) {
        return (e[edgeIdAttr1] === id)
      } else {
        return ([e[edgeIdAttr1], e[edgeIdAttr2]].includes(id))
      }
    })
    const childIds = edges1.map(e => e[edgeIdAttr1] === id ? e[edgeIdAttr2] : e[edgeIdAttr1])
    return entities.filter(e => {
      return childIds.includes(e[idAttr]) && typeFn(e)
    })
  }
}


const graphDenormalizer =  args => spec => {

  const relatedOfType = relatedOfTypeHof(args)


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
          const deeperParentId = entity[args.idAttr]
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
