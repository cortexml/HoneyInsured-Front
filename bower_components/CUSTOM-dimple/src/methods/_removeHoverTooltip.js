    // Copyright: 2014 PMSI-AlignAlytics
    // License: "https://github.com/PMSI-AlignAlytics/dimple/blob/master/MIT-LICENSE.txt"
    // Source: /src/methods/_removeTooltip.js
    /*jslint unparam: true */
    dimple._removeHoverTooltip = function (e, shape, chart, series) {
        if (chart._hoverTooltipGroup) {
            chart._hoverTooltipGroup.remove();
        }
    };
    /*jslint unparam: false */
