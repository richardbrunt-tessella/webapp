angular.module('cttvDirectives')
    .directive('donut', function () {
        'use strict';
        return {
            restrict: 'E',

            link: function (scope, elem, attrs) {
                var myDonut = donut()
                    .radius(30)
                    .colors(["steelblue", "#eeeeee"]);

                scope.$watchGroup (
                    [function () {return attrs.val;},
                     function () {return attrs.max;}], function () {
                    if (!attrs.val) {
                        return;
                    }
                    myDonut
                        .value(parseInt(attrs.val))
                        .max(parseInt(attrs.max));
                    myDonut(elem[0]);
                });
            }
        };
    });
