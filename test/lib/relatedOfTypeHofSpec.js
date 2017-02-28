'use strict';

var expect = require('chai').expect;
var relatedOfTypeHof = require('../../src/index').relatedOfTypeHof;

describe('relatedOfTypeHof', function () {

  var nodes = [{ this_id: 1, category: 'a' }, { this_id: 2, category: 'b' }, { this_id: 3, category: 'c' }];
  var edges = [{ parentId: 1, childId: 2 }, { parentId: 1, childId: 3 }];
  var typeFn = function typeFn(typeInput, ele) {
    return typeInput === ele.category;
  };

  var args = {
    nodes: nodes,
    edges: edges,
    typeFn: typeFn,
    nodeIdAttr: 'this_id',
    node1IdAttrOnEdge: 'parentId',
    node2IdAttrOnEdge: 'childId',
    isDirectedGraph: false
  };

  var subject = relatedOfTypeHof(args);

  it('works when id=all', function () {
    var expected = [{ this_id: 1, category: 'a' }];
    var result = subject('all', 'a');
    expect(result).to.deep.equal(expected);
  });

  it('works in general case', function () {
    var expected = [{ this_id: 2, category: 'b' }];
    var result = subject(1, 'b');
    expect(result).to.deep.equal(expected);
  });
});