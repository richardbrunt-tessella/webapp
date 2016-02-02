/** Add to the OT controllers module */
angular.module('cttvControllers')

    .controller('TargetOverviewCtrl', ["$scope", "$location", "$log", "cttvAPIservice", "$http", "$q", function ($scope, $location, $log, cttvAPIservice, $http, $q) {

        "use strict";
        $log.log('OverviewCtrl');

        var q = $location.path().split('/')[2];
        $scope.search = {
    	    query : q
    	};

        // Info about the target
        cttvAPIservice.getTarget( {
                target_id:q
            } ).
            then(
                function(resp) {
                    console.log("TARGET RESP");
                    console.log(resp);
                    $scope.search.label = resp.body.approved_symbol;
                    console.log($scope.search);
                },
                cttvAPIservice.defaultErrorHandler
            );

        // diseases tree
        // cttvAPIservice.getAssociations ({
        //     target: q,
        //     datastructure: "tree"
        // })
        // .then (function (resp) {
        //     console.log("ASSOCIATIONS TREE");
        //     console.log(resp);
        //     console.log(tnt);
        //     var root = tnt.tree.node(resp.body.data);
        //     console.log(root);
        // });

        // diseases flat
        cttvAPIservice.getAssociations ({
                target:q,
                datastructure: "flat"
            })
            .then(function(resp) {
                    console.log("ASSOCIATIONS FLAT");
                    console.log(resp);

                    // disease count
                    $scope.search.count = resp.body.total;

                    // Max score
                    var maxScore = d3.max(resp.body.data, function (o) {
                        return o.association_score;
                    });
                    $scope.search.maxScore = maxScore;

                    // histogram
                    var buckets = resp.body.facets.data_distribution.buckets;
                    var histogramData = [];
                    for (var b in buckets) {
                        histogramData.push({
                            "label": b,
                            "value": buckets[b].value
                        });
                    }
                    histogramData = _.sortBy(histogramData, function (o) {
                        return o.value;
                    });
                    $scope.search.histogram = histogramData;

                    // Main Diseases
                    var sortedDiseases = _.chain(resp.body.data).sortBy(function (o) {
                        return o.disease.therapeutic_area.codes.length;
                    }).sortBy(function (o) {
                        return o.association_score;
                    }).reverse().value();
                    $scope.search.main = _.slice(sortedDiseases, 0, 10);

                    // expression
                    $http.get("/proxy/www.ebi.ac.uk/gxa/widgets/heatmap/multiExperiment?geneQuery=" + $scope.search.query + "&species=homo%20sapiens")
                        .then (function (resp) {
                            var flattened = _.chain(resp.data.profiles.rows)
                            .map("expressions")
                            .flatten()
                            .sortBy(function (o) {
                                return -o.value;
                            })
                            .uniq("factorName")
                            .value();
                            $scope.search.tissues = _.slice(flattened, 0, 10);
                            // $scope.search.tissues = _.slice(_.sortBy(resp.data.profiles.rows[0].expressions,function (o) {
                            //     return -o.value;
                            // }), 0, 10);
                        });
                },
                cttvAPIservice.defaultErrorHandler
            );

    }]);
