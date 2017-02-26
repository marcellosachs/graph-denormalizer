# Install
`npm install --save graph-denormalizer`

# Test
`npm run test`

# Usage

## Example 1
```
import graphDenormalizerHof from 'graph-denormalizer'

const typeHof = typeInput => ele => ele.category === typeInput

const config = {
  typeHof,
  nodeIdAttr: 'this_id',
  node1IdAttrOnEdge: 'parentId',
  node2IdAttrOnEdge: 'childId',
  isDirectedGraph: false,
}

const configuredGraphDenormalizerHof = graphDenormalizer(config)

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

const graphDenormalizer = configuredGraphDenormalizerHof({nodes, edges})
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
## Example 2
```
import graphDenormalizerHof from 'graph-denormalizer'

const typeHof = typeInput => ele => ele.assignmentType.name === typeInput

const config = {
  typeHof,
  nodeIdAttr: 'id',
  node1IdAttrOnEdge: 'assignment1Id',
  node2IdAttrOnEdge: 'assignment2Id',
  isDirectedGraph: false,
}

const configuredGraphDenormalizerHof = graphDenormalizerHof(config)

const nodes = [
    {id: 1, name: 'Hostos', assignmentType: {id: 1, name: 'site'}},
    {id: 2, name: '101', assignmentType: {id: 2, name: 'route'}},
    {id: 3, name: '102', assignmentType: {id: 2, name: 'route'}},
    {id: 4, name: 'Team 1', assignmentType: {id: 3, name: 'team'}},    
]

const edges = [
  {assignment1Id: 1, assignment2Id: 2},
  {assignment1Id: 1, assignment2Id: 3},
  {assignment1Id: 4, assignment2Id: 2},  
]

const graphDenormalizer = configuredGraphDenormalizerHof({nodes, edges})
```
### Input
```
const nestSpec = {
  site: {
    route: {
      team: null,
    },
  }
}

const result = graphDenormalizer(nestSpec)
```
### Output
```
{
  site: [
    {
      id: 1,
      name: 'Hostos',
      assignmentType: {id: 1, name: 'site'},
      route: [
        {
          id: 2,
          name: '101',
          assignmentType: {id: 2, name: 'route'},
          team: [
            {
              id: 4,
              name: 'Team 1',
              assignmentType: {id: 4, name: 'team'},
            }
          ]
        },
        {
          id: 3,
          name: '102',
          assignmentType: {id: 3, name: 'route'},
          team: []
        }
      ]
    }
  ]
}
```
