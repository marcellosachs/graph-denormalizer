'use strict';

var relatedOfTypeHof = function relatedOfTypeHof(args) {
  return function (id, typeInput) {
    var nodes = args.nodes,
        edges = args.edges,
        nodeIdAttr = args.nodeIdAttr,
        typeFn = args.typeFn,
        node1IdAttrOnEdge = args.node1IdAttrOnEdge,
        node2IdAttrOnEdge = args.node2IdAttrOnEdge,
        isDirectedGraph = args.isDirectedGraph;


    var typeFn2 = function typeFn2(ele) {
      return typeFn(typeInput, ele);
    };

    if (id === 'all') {
      return nodes.filter(typeFn2);
    } else {
      var edges1 = edges.filter(function (e) {
        if (isDirectedGraph) {
          return e[node1IdAttrOnEdge] === id;
        } else {
          return [e[node1IdAttrOnEdge], e[node2IdAttrOnEdge]].includes(id);
        }
      });
      var childIds = edges1.map(function (e) {
        return e[node1IdAttrOnEdge] === id ? e[node2IdAttrOnEdge] : e[node1IdAttrOnEdge];
      });
      return nodes.filter(function (e) {
        return childIds.includes(e[nodeIdAttr]) && typeFn2(e);
      });
    }
  };
};

var graphDenormalizer = function graphDenormalizer(config) {
  return function (graph) {
    return function (spec) {

      var relatedOfType = relatedOfTypeHof(Object.assign({}, config, graph));

      var helper = function helper(parentId, typeInput, typeSpec) {
        var entities = relatedOfType(parentId, typeInput);
        return entities.map(function (entity) {
          var extra = void 0;
          if (typeSpec === null) {
            extra = {};
          } else {
            extra = Object.keys(typeSpec).reduce(function (acc, key) {
              var deeperTypeInput = key;
              var deeperTypeSpec = typeSpec[key];
              var deeperParentId = entity[config.nodeIdAttr];
              acc[key] = helper(deeperParentId, deeperTypeInput, deeperTypeSpec);
              return acc;
            }, {});
          }
          return Object.assign({}, entity, extra);
        });
      };

      var keys = Object.keys(spec);
      return Object.keys(spec).reduce(function (acc, key) {
        var typeInput = key;
        var typeSpec = spec[key];
        acc[key] = helper('all', typeInput, typeSpec);
        return acc;
      }, {});
    };
  };
};

module.exports.graphDenormalizer = graphDenormalizer;
module.exports.relatedOfTypeHof = relatedOfTypeHof;