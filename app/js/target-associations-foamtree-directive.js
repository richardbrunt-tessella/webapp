/* Directives */
angular.module('cttvDirectives')


/**
* FoamTree view for target associations
*/

.directive('cttvTargetAssociationsFoamtree', function ($timeout) {

    return {

        restrict: 'E',

        scope: {
            width: '=?',
            height: '=?',
            data: '=?',
            onCellSelect: '=?'
        },

        template: '<div id="foamtree" style="width: {{width}}px; height: {{height}}px"></div>',

        link: function (scope, element, attributes) {
        	
        	scope.width = angular.isDefined(scope.width) ? scope.width :  700; // set the default width
        	
        	scope.height = angular.isDefined(scope.height) ? scope.height : 500; // set the default height
			
        	scope.data = angular.isDefined(scope.data) ? scope.data : [{"groups": [{"label": "sod1"}, {"label": "mutant"}, {"label": "mutation"}, {"label": "mutant sod1"}, {"label": "al"}, {"label": "fals"}, {"label": "protein"}, {"label": "superoxide"}, {"label": "dismutase"}, {"label": "superoxide dismutase"}], "label": "sod1"}, {"groups": [{"label": "tdp-43"}, {"label": "fus"}, {"label": "c9orf72"}, {"label": "al"}, {"label": "repeat"}, {"label": "mutation"}, {"label": "ftld"}, {"label": "protein"}, {"label": "expansion"}, {"label": "inclusion"}], "label": "tdp-43"}, {"groups": [{"label": "motor"}, {"label": "al"}, {"label": "neuron"}, {"label": "mouse"}, {"label": "motor neuron"}, {"label": "spinal"}, {"label": "cord"}, {"label": "spinal cord"}, {"label": "cell"}, {"label": "model"}], "label": "motor"}, {"groups": [{"label": "patient"}, {"label": "al"}, {"label": "study"}, {"label": "al patient"}, {"label": "control"}, {"label": "use"}, {"label": "clinical"}, {"label": "group"}, {"label": "motor"}, {"label": "muscle"}], "label": "patient"}, {"groups": [{"label": "cell"}, {"label": "protein"}, {"label": "neurodegenerative"}, {"label": "brain"}, {"label": "disorder"}, {"label": "gene"}, {"label": "study"}, {"label": "use"}, {"label": "role"}, {"label": "human"}], "label": "cell"}]
        	
        	scope.onCellSelect = angular.isDefined(scope.onCellSelect) ? scope.onCellSelect: function(event) {console.log("clicked on ", event.group)};

			$timeout( function() {
				var foamtree = new CarrotSearchFoamTree({
					id: "foamtree",
					dataObject: {
						groups: scope.data
					},
					onGroupClick: scope.onCellSelect
				});
			});

        } // end link

    }; // end return

}); // end directive cttvTargetAssociationsFoamTree
