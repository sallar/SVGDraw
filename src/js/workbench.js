define([
    'backbone',
    'snap',
    'app/views/App'
], function (Backbone, Snap, AppView) {
    'use strict';

    /**
     * This is the main interface
     * intializable through config.js
     * @return {object}
     */
    return function() {

        /**
         * Add Capitalize to String object
         * I KNOW this is bad practice but for the sake of this 
         * project I’m going to do this just once. ;-)
         */
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

        /**
         * Show the App
         */
        var App = new AppView();
        App.render();

        /**
         * Make'em global
         */
        window.App = App;
    };
    
});