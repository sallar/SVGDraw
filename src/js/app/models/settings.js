define([
    'backbone',
    'localstorage'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("SettingsModel"),

        defaults: {
            shape: 'rectangle',
            fill: '#EAD98B',
            strokeWidth: 0,
            strokeColor: '#4E6E38',
            fontFamily: 'Georgia'
        }
    });

});