define([
    'backbone',
    'snap',
    'text!app/tpl/Text.html'
], function(Backbone, Snap, Tpl) {
    'use strict';

    return Backbone.View.extend({

        className: 'app__canvas__text',

        events: {
            'keypress input': 'setText'
        },

        initialize: function(options) {
            // Compile Template
            this.options  = options;
            this.template = _.template(Tpl);
        },

        render: function() {
            var self = this;

            // Render Canvas
            this.$el.html(this.template());
            this.$('input').focus();
            return this;
        },

        /**
         * Set the Text on parent element
         * then discard this view.
         */
        setText: function(e) {
            var $el = $(e.target),
                val = $el.val();

            if( e.keyCode == 13 && $.trim(val) !== "" ) {
                this.options.textObj.attr({text: val});
                this.remove();
            }
        }

    });
});