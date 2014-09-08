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

var getCssColor = function(hue, saturation, luminosity) {
	return "hsl(" + hue + ", " + saturation + "%, " + luminosity + "%)";
};

var timeout = setInterval(function() {

	var $calDays = $(".js-calendar-graph-svg .day");
	var coldestHue = 240;
	var hottestHue = 0;
	var maxContributionCount = 100;


	if($calDays.length > 0) {

		clearInterval(timeout);

		$calDays.each(function() {

			var contributionCount = Math.min(parseInt(this.getAttribute("data-count")), maxContributionCount);

			if(contributionCount > 0) {

				var hue = ((contributionCount / (maxContributionCount)) * (hottestHue - coldestHue)) + coldestHue; 
				this.style.fill = getCssColor(hue, 70, 50);
			}
		});
	}

}, 100);