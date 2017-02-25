# Install
`npm install --save graph-denormalizer`

# Test
`npm run test`

# Usage
```
import graphDenormalizerHof from 'graph-denormalizer'

const entities = [
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

const args = {
  entities,
  edges,
  typeHof,
  idAttr: 'this_id',
  edgeIdAttr1: 'parentId',
  edgeIdAttr2: 'childId',
  isDirected: false,
}

const graphDenormalizer = graphDenormalizerHof(args)
```
## Input
```
const spec = {
  a: {
    b: {
      d: null,
    },
    c: {
      d: null,
    },
  },
}

const result = graphDenormalizer(spec)
```
## Output
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
