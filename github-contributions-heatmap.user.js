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

var timeout = setInterval(function() {

	var $calDays = $(".js-calendar-graph-svg .day");

	if($calDays.length > 0) {

		clearInterval(timeout);

		console.log("ok");

		$calDays.each(function() {
			this.style.fill = "#FF00FF";
		});
	}

}, 100);