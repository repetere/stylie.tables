/*
 * stylie.tables
 * http://github.com/typesettin
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';

var classie = require('classie'),
	extend = require('util-extend'),
	events = require('events'),
	// Pushie = require('pushie'),
	util = require('util'),
	detectCSS = require('detectcss');

var getEventTarget = function (e) {
	e = e || window.event;
	return e.target || e.srcElement;
};

/**
 * A module that represents a full with slideshow componenet object, a stylie.tables is a slideshow.
 * @{@link https://github.com/typesettin/stylie.tables}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @constructor StylieTable
 * @requires module:util-extent
 * @requires module:util
 * @requires module:events
 * @requires module:hammerjs
 * @requires module:detectcss
 * @param {object} config {el -  element of tab container}
 * @param {object} options configuration options
 */
var StylieTable = function (config) {
	events.EventEmitter.call(this);
	this.options = extend(this.options, config);

	this._init(config);
};

util.inherits(StylieTable, events.EventEmitter);

/** module default configuration */
StylieTable.prototype.options = {
	tableClass: 'ts-table ts-table-padding-md ts-text-left ts-table-border ts-width-100 ts-table-cell-border ts-sans-serif',
	tableHeadClass: 'ts-table-head',
	tableBodyClass: 'ts-table-body',
	tableFootClass: 'ts-table-foot',
	createTableHead: true,
	mirrorTableHeaderFooter: true,
	elementWrapper: document.querySelector('body'),
	data: [{
		'title': 'stylie',
		'link': 'http://stylie.io',
		'desc': 'css style guide generator'
	}, {
		'title': 'nachie',
		'link': 'http://nachie.io',
		'desc': 'generate ache files in javascript'
	}],
	keyfilters: {},
	onCreateTable: function () {
		return false;
	},
	onOpen: function () {
		return false;
	}
};

/**
 * initializes slideshow and shows current slide.
 * @emits tableInitialized
 */
StylieTable.prototype._init = function (options) {
	options = options || {};
	this.options = extend(this.options, options);
	this._createTable();
	// this._initEvents(); // initialize/bind the events
	// Function to create a table as a child of el.
	this.emit('tableInitialized');
};

/**
 * initializes slideshow and shows current slide.
 * @emits slidesInitialized
 */
StylieTable.prototype._createTable = function () {
	var tableElement,
		TableHeaderRowObject = [],
		tHeadCells = [],
		footerRows = [],
		TableRowObject = [];

	var tableRowCreate = function (options) {
		for (var i = 0; i < options.tableRowData.length; ++i) {
			var tr = options.tbl.insertRow();
			for (var j = 0; j < options.tableRowData[i].length; ++j) {
				var td = tr.insertCell();
				if (typeof options.tableRowData[i][j].filterOptions !== 'undefined' && options.tableRowData[i][j].filterOptions.colstyle) {
					td.setAttribute('style', options.tableRowData[i][j].filterOptions.colstyle);
				}
				//td.innerHTML = 'k';
				console.log('options.tableRowData[i][j].filterOptions', options.tableRowData[i][j].filterOptions);
				td.innerHTML = (typeof options.tableRowData[i][j].val !== 'undefined') ? options.tableRowData[i][j].val.toString() : '';

				////options.tableRowData[i][j].val.toString(); //(document.createTextNode(options.tableRowData[i][j].toString()));
			}
		}
	}

	var tableCreate = function (options) {
		var el = options.el,
			tableRowData = options.tableBody,
			tableHeadRowData = options.tableHead;

		var tbl = document.createElement('table');
		tbl.setAttribute('class', this.options.tableClass);

		//create table body
		tableRowCreate({
			tableRowData: tableRowData,
			tbl: tbl
		});
		tbl.tBodies[0].setAttribute('class', this.options.tableBodyClass);

		//create table head
		if (this.options.createTableHead) {
			var tblHeader = tbl.createTHead();
			tblHeader.setAttribute('class', this.options.tableHeadClass);
			tableRowCreate({
				tableRowData: tableHeadRowData,
				tbl: tblHeader
			});
		}
		//create table foot
		if (this.options.mirrorTableHeaderFooter) {
			console.log('footer');
			var tblFooter = tbl.createTFoot();
			tblFooter.setAttribute('class', this.options.tableFootClass);
			tableRowCreate({
				tableRowData: tableHeadRowData,
				tbl: tblFooter
			});
		}

		el.appendChild(tbl);
		this.options.onCreateTable(tbl);
	}.bind(this);
	console.log(this.options.data);

	//create table body
	for (var i = 0; i < this.options.data.length; ++i) {
		var cells = [],
			dataObject = this.options.data[i];

		for (var key in dataObject) {
			if (typeof this.options.keyfilters[key] === 'undefined' || this.options.keyfilters[key].ignorekey !== true) {
				cells.push({
					val: dataObject[key] || '',
					filterOptions: this.options.keyfilters[key]
				});
				if (this.options.createTableHead && i === 0) {
					if (this.options.keyfilters[key] && typeof this.options.keyfilters[key].label !== 'undefined') {
						tHeadCells.push({
							val: this.options.keyfilters[key].label,
							filterOptions: this.options.keyfilters[key]
						});
					}
					else {
						tHeadCells.push({
							val: key,
							filterOptions: this.options.keyfilters[key]
						});
					}
				}
			}
		}
		TableRowObject.push(cells);
	}
	TableHeaderRowObject.push(tHeadCells);

	tableCreate({
		el: this.options.elementWrapper,
		tableBody: TableRowObject,
		tableHead: TableHeaderRowObject
	});
};

if (typeof window === 'object') {
	window.StylieTable = StylieTable;
}
if (typeof module === 'object') {
	module.exports = StylieTable;
}
