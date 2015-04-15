define([
    'backbone',
    'app/views/Sidebar',
    'app/views/Canvas',
    'app/models/settings',
    'text!app/tpl/App.html'
], function(Backbone, SidebarView, CanvasView, Settings, Tpl) {
    'use strict';

    return Backbone.View.extend({

        el: '.app',

        initialize: function() {
            // Compile Template
            this.template = _.template(Tpl);

            // Global Settings
            // Save it in localstorage
            this.settings = new Settings({id: 1});
            this.settings.fetch({
                error: function(model) {
                    model.save();
                }
            });

            // Save all changes
            this.settings.on('change', function() {
                this.save();
            });

            // Add Other Views
            this.sidebarView = new SidebarView({appView: this});
            this.canvasView  = new CanvasView({appView: this});
        },

        render: function() {
            // Render Main Layout
            this.$el.html(this.template());

            // Render Attached Views
            this.$('.app__sidebar').append(this.sidebarView.render().el);
            this.$('.app__canvas').append(this.canvasView.render().el);

            // Chain
            return this;
        }

    });
});