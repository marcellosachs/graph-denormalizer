'use strict';

var expect = require('chai').expect;
var graphDenormalizer = require('../../src/index').graphDenormalizer;

describe('graphDenormalizer', function () {

  var nodes = [{ this_id: 1, category: 'a' }, { this_id: 2, category: 'b' }, { this_id: 3, category: 'b' }, { this_id: 4, category: 'c' }, { this_id: 5, category: 'd' }];
  var edges = [{ parentId: 1, childId: 2 }, { parentId: 1, childId: 3 }, { parentId: 1, childId: 4 }, { parentId: 2, childId: 5 }];
  var typeFn = function typeFn(typeInput, ele) {
    return ele.category === typeInput;
  };

  var config = {
    typeFn: typeFn,
    nodeIdAttr: 'this_id',
    node1IdAttrOnEdge: 'parentId',
    node2IdAttrOnEdge: 'childId',
    isDirectedGraph: false
  };

  var graph = {
    nodes: nodes,
    edges: edges
  };

  var subject = graphDenormalizer(config)(graph);

  it('works', function () {
    var expected = {
      a: [{
        this_id: 1,
        category: 'a',
        b: [{
          this_id: 2,
          category: 'b',
          d: [{
            this_id: 5,
            category: 'd'
          }]
        }, {
          this_id: 3,
          category: 'b',
          d: []
        }],
        c: [{
          this_id: 4,
          category: 'c',
          d: []
        }]
      }]
    };
    var spec = {
      a: {
        b: {
          d: null
        },
        c: {
          d: null
        }
      }
    };
    var result = subject(spec);
    expect(result).to.deep.equal(expected);
  });
});