# Install
`npm install --save graph-denormalizer`

# Test
`npm run test`

# Usage

## Example 1
```
import graphDenormalizerHof from 'graph-denormalizer'

const nodes = [
    {this_id: 1, category: 'a'},
    {this_id: 2, category: 'b'},
    {this_id: 3, category: 'b'},
    {this_id: 4, category: 'c'},
    {this_id: 5, category: 'd'}
]
const edges = [
  {parentId: 1, childId: 2},
  {parentId: 1, childId: 3},
  {parentId: 1, childId: 4},
  {parentId: 2, childId: 5}
]

const typeHof = typeInput => ele => ele.category === typeInput

const config = {
  typeHof,
  nodeIdAttr: 'this_id',
  node1IdAttrOnEdge: 'parentId',
  node2IdAttrOnEdge: 'childId',
  isDirectedGraph: false,
}

const graph = {
  nodes,
  edges,
}

const graphDenormalizer = graphDenormalizerHof(config)(graph)
```
### Input
```
const nestSpec = {
  a: {
    b: {
      d: null,
    },
    c: {
      d: null,
    },
  },
}

const result = graphDenormalizer(nestSpec)
```
### Output
```

{
  a: [
    {
      this_id: 1,
      category: 'a',
      b: [
        {
          this_id: 2,
          category: 'b',
          d: [
            {
              this_id: 5,
              category: 'd',
            }
          ]
        },
        {
          this_id: 3,
          category: 'b',
          d: [],
        },
      ],
      c: [
        {
          this_id: 4,
          category: 'c',
          d: []
        }
      ]
    }
  ]
}
```
