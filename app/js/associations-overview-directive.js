angular.module('cttvDirectives')
    .directive ('associationsOverview', ['$log', 'cttvAPIservice', 'cttvUtils', function ($log, cttvAPIservice, cttvUtils) {
        'use strict';
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                scope.$watch (function() {return attrs.target;}, function (targetId) {
                    if (!targetId) {
                        return;
                    }
                    var colorScale = cttvUtils.colorScales.BLUE_0_1; //blue orig
                    var view = bubblesView()
                        .value("association_score")
                        .key("__disease_id")
                        .label("__disease_name")
                        .colorPalette(colorScale)
                        .maxVal(1)
                        .diameter(400);

                    cttvAPIservice.getAssociations({
                        target: targetId,
                        expandefo: false,
                        datastructure: "tree"
                    })
                    .then (function (resp) {
                        var data = resp.body.data;
                        console.log("DATA FOR BUBBLES OVERVIEW:");
                        console.log(resp);
                        processData(data);
                        var root = tnt.tree.node(data);
                        var children = root.children();
                        for (var i=0; i<children.length; i++) {
                            var child = children[i];
                            child.toggle();
                        }
                        view.data(root);
                        view.on("click", function (node) {
                            if (node.parent() && node.children(true)) {
                                node.toggle();
                                view.update();
                                setTimeout(function () {
                                    if (node.property("__focused")) {
                                        node.property("__focused", false);
                                        view.focus(root);
                                    } else {
                                        node.property("__focused", true);
                                        view.focus(node);
                                    }
                                }, 1000);
                            }
                        });
                        view(elem[0]);

                    });

                    // process data
                    // flattening the tree (duplicates?)
                    function processData (data) {
                        if (data === undefined) {
                            return [];
                        }

                        if (data.children === undefined) {
                            return data;
                        }
                        data.name = ""; // the root doesn't include a name
                        var therapeuticAreas = data.children;
                        for (var i=0; i<therapeuticAreas.length; i++) {
                            var tA = therapeuticAreas[i];
                            var taChildren = tA.children;
                            if (taChildren === undefined) {
                                // If the TA doesn't have a child, just create one for it with the same information as the TA
                                tA.children = [_.clone(tA)];
                                //continue;
                            }
                            //tA.__disease_id = tA.disease.id;
                            tA.__disease_id = tA.disease.id;
                            tA.__disease_name = tA.disease.name;
                            var ta_node = tnt.tree.node(tA);
                            var flattenChildren = ta_node.flatten(true).data().children;
                            var newChildren = [];
                            var nonRedundant = {};
                            for (var j=0; j<flattenChildren.length; j++) {
                                var childData = flattenChildren[j];
                                // Put some properties to have direct access to disease name and id (will be used by bubblesView)
                                //childData.name = childData.disease.id;
                                childData.__disease_id = childData.disease.id;
                                childData.__disease_name = childData.disease.name;
                                if (nonRedundant[childData.name] === undefined) {
                                    nonRedundant[childData.name] = 1;
                                    newChildren.push(childData);
                                }
                            }
                            tA.children = newChildren;
                        }
                        return data;
                    }
                });
            }
        };
    }]);
