// ==UserScript==
// @name        Github Contributions Heatmap
// @description Permettant de changer les couleurs du graphe de contributions Github pour quelquechose de plus parlant et d'absolu.        
// @author      Dorian MARCHAL
// @namespace   http://dorian-marchal.com
// @include     https://github.com/*
// @version     1
// @run-at document-end
// ==/UserScript==

"use strict";
/* jshint unused: false */
/* jshint multistr: true */
/* jshint newcap: false */


var GithubHeatmap = {

    COLDEST_HUE: 240,
    HOTTEST_HUE: 0,
    MAX_CONTRIBUTION_COUNT: 100,

    getCssColor: function(hue, saturation, luminosity) {
        return "hsl(" + hue + ", " + saturation + "%, " + luminosity + "%)";
    },

    adjustFunction: function(x) {
        return Math.pow((x - 1), 3) + 1;
    },

    adjustValue: function(x, max) {

        if(x < 0 || max === 0) {
            return;
        }

        //On repasse la valeur sur [0, 1] avant d'appliquer la fonction
        var value = x / max;

        return Math.floor(GithubHeatmap.adjustFunction(value) * max);
    },

    getFillColor: function(contributionCount) {

        if(contributionCount === 0) {
            return null;
        }

        contributionCount = Math.min(contributionCount, GithubHeatmap.MAX_CONTRIBUTION_COUNT);

        var hue = Math.floor(((GithubHeatmap.adjustValue(contributionCount, GithubHeatmap.MAX_CONTRIBUTION_COUNT) / 
            (GithubHeatmap.adjustValue(GithubHeatmap.MAX_CONTRIBUTION_COUNT, GithubHeatmap.MAX_CONTRIBUTION_COUNT))) * 
            (GithubHeatmap.HOTTEST_HUE - GithubHeatmap.COLDEST_HUE)) + GithubHeatmap.COLDEST_HUE);

        return GithubHeatmap.getCssColor(hue, 70, 50);
    },

    addHeatmap: function() {
        var $calDays = $(".js-calendar-graph-svg .day");


        if($calDays.length > 0) {

            $calDays.each(function() {

                var contributionCount = parseInt(this.getAttribute("data-count"));

                if(contributionCount > 0) {

                    this.style.fill = GithubHeatmap.getFillColor(contributionCount);
                }
            });

            var contributionCount = 1;

            $(".contrib-legend li").each(function() {
                $(this).css("background-color", GithubHeatmap.getFillColor(contributionCount));
                contributionCount += 15;
            });
        }
    },

    init: function() {

        GithubHeatmap.addHeatmap();

        var target = document.querySelector(".site");

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                GithubHeatmap.addHeatmap();
            });    
        });

        observer.observe(target, { subtree: true, childList: true });
    }

};

GithubHeatmap.init();