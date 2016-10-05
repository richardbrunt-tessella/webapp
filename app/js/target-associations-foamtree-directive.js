/* Directives */ angular.module('cttvDirectives')

/**
* FoamTree view for target associations
*/

.directive('cttvTargetAssociationsFoamtree', ['$timeout', 'cttvAPIservice', function ($timeout, cttvAPIservice) {

    var whoiam = 'foamtree';

    return {

        restrict: 'E',

        scope: {
            width: '=?',
            height: '=?',
            clusterData: '=',
            onCellSelect: '=?',
            target: '@',
            active: '@',
            tab: '=?' // use this if the directive is in a tab
        },

        template: '<div id="foamtree" style="width: {{width}}px; height: {{height}}px"></div>',

        link: function (scope, element, attribute) {

        	var foamtree = {};

        	scope.width = angular.isDefined(scope.width) ? scope.width :  500; // set the default width

        	scope.height = angular.isDefined(scope.height) ? scope.height : 500; // set the default height

        	if (!angular.isDefined(scope.clusterData && !angular.isDefined(scope.target))) {
        		console.log("Foamtree Error: No data to display, please include a cluster-data or target attribute");
        	}

        	scope.onCellSelect = angular.isDefined(scope.onCellSelect) ? scope.onCellSelect: function(event) {console.log("clicked on ", event.group);};

        	// if(!angular.isDefined(scope.tab)) {
        	// 	drawFoamTree();
        	// }

        	function drawFoamTree(id, clusterData) {
				// need the timeout so the template can load and we have an id to use to display the foamtree
                console.log("Starting foamtree with this data...");
                console.log(clusterData);
				$timeout( function() {
					foamtree = new CarrotSearchFoamTree({
						id: id,
                    //     dataObject: {
                    //       groups: [
                    //         { label: "Your", groups: [
                    //             {label: "one"},
                    //             {label: "two"}
                    //         ]},
                    //         { label: "First"},
                    //         { label: "FoamTree"},
                    //         { label: "Visualization"}
                    //       ]
                    //   },

						dataObject: clusterData,
						onGroupClick: scope.onCellSelect
					});
				},0);
        	}

			// scope.$watch('tab', function() {
			// 	if(scope.tab) {
			// 		drawFoamTree();
			// 	}
			// });

            // when the target changes, redraw the foamtree
            scope.$watchGroup(['target', 'active'], function () {
                if (!scope.target || !scope.active) {
                    return;
                }

                if (scope.active !== whoiam) {
                    return;
                }

                var opts = {
                    target: scope.target,
                    outputstructure: "false",
                    direct: true,
                    facets: false,
                    size: 1000
                };

                cttvAPIservice.getAssociations (opts)
                    .then (function (resp) {
                        // var data = resp.body.data;
                        var data = cttvAPIservice.flat2tree({data: resp.body, childrenProperty: "groups"});
                        console.log("foamtree data...");
                        console.log(data);

                        // var mockData = {
                        //     groups: [
                        //         { label:"Group 1"},
                        //         { label:"Group 2"},
                        //         { label:"Group 3" }
                        //     ]
                        // };

                        drawFoamTree("foamtree", data);
                        // drawFoamTree("foamtree", mockData);
                        // if(angular.isDefined(foamtree.set)) {
        				// 	foamtree.set({
        				// 		dataObject: {
        				// 			groups: scope.clusterData
        				// 		}
        				// 	});
        				// 	foamtree.redraw();
        				// }
                    },cttvAPIservice.defaultErrorHandler);
            });

			// when the cluster data changes, redraw the foamtree
			scope.$watch('clusterData', function() {
				if(angular.isDefined(foamtree.set)) {
					foamtree.set({
						dataObject: {
							groups: scope.clusterData
						}
					});
					foamtree.redraw();
				}
			});

        } // end link

    }; // end return

}]); // end directive cttvTargetAssociationsFoamTree
