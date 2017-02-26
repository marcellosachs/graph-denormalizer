const expect = require('chai').expect;
const relatedOfTypeHof = require('../../src/index').relatedOfTypeHof;

describe('relatedOfTypeHof', () => {

  const nodes = [{ this_id: 1, category: 'a' }, { this_id: 2, category: 'b' }, { this_id: 3, category: 'c' }];
  const edges = [{ parentId: 1, childId: 2 }, { parentId: 1, childId: 3 }];
  const typeFn = (typeInput, ele) => typeInput === ele.category;

  const args = {
    nodes,
    edges,
    typeFn,
    nodeIdAttr: 'this_id',
    node1IdAttrOnEdge: 'parentId',
    node2IdAttrOnEdge: 'childId',
    isDirectedGraph: false
  };

  const subject = relatedOfTypeHof(args);

  it('works when id=all', () => {
    const expected = [{ this_id: 1, category: 'a' }];
    const result = subject('all', 'a');
    expect(result).to.deep.equal(expected);
  });

  it('works in general case', () => {
    const expected = [{ this_id: 2, category: 'b' }];
    const result = subject(1, 'b');
    expect(result).to.deep.equal(expected);
  });
});