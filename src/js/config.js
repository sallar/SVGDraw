/**
 * RequireJS Config
 */
require.config({
    baseUrl: 'src/js',
    waitSeconds: 100,
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'jquery',
                'underscore'
            ],
            exports: 'Backbone'
        },
        snap: {
            exports: 'Snap'
        }
    },
    paths: {
        app: './app',
        underscore: '../../bower_components/underscore/underscore',
        text: '../../bower_components/text/text',
        backbone: '../../bower_components/backbone/backbone',
        jquery: '../../bower_components/jquery/dist/jquery',
        snap: '../../bower_components/Snap.svg/dist/snap.svg',
        localstorage: '../../bower_components/backbone.localstorage/backbone.localStorage'
    }
});

/**
 * Initialize the application
 */
require(['workbench'], function(SVGDrawApp) {
    SVGDrawApp();
});