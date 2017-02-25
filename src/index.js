
const relatedOfTypeHof = args => (id, typeInput) => {
  {
    entities,
    idAttr,
    typeHof,
    edges,
    edgeIdAttr1,
    edgeIdAttr2,
    isDirected,
  } = args

  const typeFn = typeHof(typeInput)

  const edges1 = edges.filter(e => {
    if (isDirected) {
      return (e[edgeIdAttr1] === id)
    } else {
      return ([e[edgeIdAttr1], e[edgeIdAttr2]].includes(id))
    }
  }
  const childIds = edges1.map(e => e[edgeIdAttr1] === id ? e[edgeIdAttr2] : e[edgeIdAttr1])
  const children = entities.filter(e => {
    childIds.includes(e[idAttr]) && typeFn(e)
  })
  return children
}

const fn = args => spec => {


  const relatedOfType = relatedOfTypeHof(args)


  const helper = (parentId, typeInput, typeSpec) => {
    const entities = relatedOfType(parentId, typeInput)
    return entities.map(entity => {
      const extra = Object.keys(typeSpec).reduce({}, (acc, key) => {
        const deeperTypeInput = key
        const deeperTypeSpec = typeSpec[key]
        const deeperParentId = entity.id
        acc[key] = helper(deeperParentId, deeperTypeInput, deeperTypeSpec)
        return acc
      })
      return {...entity, ...extra}
    })
  }

  return Object.keys(spec).reduce({}, (acc, key) => {
    const typeInput = key
    const typeSpec = spec[key]
    acc[key] = helper('all', typeInput, typeSpec)
    return acc
  })
}
