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

    css: "\
        .toggle-wrapper {\
            float: right;\
            position: relative;\
            top: -3px;\
            font-weight: normal;\
            margin-right: 8px;\
        }\
        .slide-toggle {\
            display: inline-block;\
            vertical-align: middle;\
            box-sizing: content-box;\
            margin: 2px 0;\
            padding: 0;\
            border: none;\
            height: 20px;\
            width: 34px;\
            cursor: pointer;\
        }\
        .slide-toggle input {\
            display: none;\
        }\
        .slide-toggle input + .slide-toggle-style {\
            position: relative;\
            width: 100%;\
            height: 100%;\
            border-radius: 50px;\
            background-color: #A3A3A3;\
            box-shadow: 0 0 2px 0px #555 inset;\
            transition-duration: 300ms;\
        }\
        .slide-toggle input + .slide-toggle-style:after {\
            content: \"\";\
            display: inline-block;\
            position: absolute;\
            left: 2px;\
            top: 2px;\
            height: 16px;\
            width: 16px;\
            border-radius: 50%;\
            background-color: #FFF;\
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);\
            transition-duration: 300ms;\
        }\
        .slide-toggle :checked + .slide-toggle-style {\
            background-color: #72CD52;\
            box-shadow: 0 0 2px 0px #498931 inset;\
        }\
        .slide-toggle :checked + .slide-toggle-style:after {\
            left: 16px;\
        }\
    ",

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

        var $calendar = $("#contributions-calendar");

        var $calDays = $(".js-calendar-graph-svg .day");

        if($calDays.length > 0 && $calendar.attr("data-heatmap") !== "heatmap") {

            $calendar.attr("data-heatmap", "heatmap");

            var $toggle = $("<div class=\"toggle-wrapper\">Heatmap: <label class=\"slide-toggle\"><input checked=\"checked\" type=\"checkbox\"><div class=\"slide-toggle-style\"></div></label></div>", {
            });

            $toggle.find("input").on("change", function() {

                GithubHeatmap.toggleHeatmap();
            });

            $("#contributions-calendar").siblings("h3").append($toggle);

            $calDays.each(function() {

                var contributionCount = parseInt(this.getAttribute("data-count"));

                if(contributionCount > 0) {

                    console.log(this);
                    this.setAttribute("data-fill", this.style.fill);
                    this.style.fill = GithubHeatmap.getFillColor(contributionCount);
                }
            });

            var contributionCount = 1;

            $(".contrib-legend li").each(function() {

                this.setAttribute("data-fill", $(this).css("background-color"));
                $(this).css("background-color", GithubHeatmap.getFillColor(contributionCount));
                contributionCount += 15;
            });
        }
    },

    toggleHeatmap: function() {

        $(".js-calendar-graph-svg .day").each(function() {
            var fill = this.getAttribute("data-fill");
            this.setAttribute("data-fill", this.style.fill);
            this.style.fill = fill;
        });

        $(".contrib-legend li").each(function() {
            var fill = this.getAttribute("data-fill");
            this.setAttribute("data-fill", $(this).css("background-color"));
            $(this).css("background-color", fill);
        });
    },

    init: function() {

        $("head").append("<style type='text/css' >" + GithubHeatmap.css + "</style>");
        $("body").append();
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