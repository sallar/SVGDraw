define([
    'backbone',
    'text!app/tpl/Sidebar.html'
], function(Backbone, Tpl) {
    'use strict';

    return Backbone.View.extend({

        events: {
            'change input,select': 'saveSettings'
        },

        initialize: function(options) {
            // Compile Template
            this.options  = options;
            this.template = _.template(Tpl);
        },

        render: function() {
            // Render Sidebar
            this.$el.html(this.template(this.options.appView.settings.toJSON()));
            return this;
        },

        /**
         * Shape Action
         */
        saveSettings: function(e) {
            e.preventDefault();
            var $el   = $(e.target);
            
            this.options.appView.settings.set($el.attr('name'), $el.val());
        }

    });
});