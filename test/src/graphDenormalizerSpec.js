const expect = require('chai').expect
const graphDenormalizer = require('../../src/index').graphDenormalizer

describe('graphDenormalizer', () => {

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

  const subject = graphDenormalizer(args)


  it('works', () => {
    const expected = {
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
    const result = subject(spec)
    expect(result).to.deep.equal(expected)
  })

})
