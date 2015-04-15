define([
    'backbone',
    'snap',
    'app/views/Text',
    'text!app/tpl/Canvas.html',
    'app/helpers/transform',
], function(Backbone, Snap, TextView, Tpl) {
    'use strict';

    return Backbone.View.extend({

        className: 'app__canvas__screen',

        /**
         * Initialize the view
         */
        initialize: function(options) {
            // Compile Template
            this.options  = options;
            this.template = _.template(Tpl);

            // Cache
            this.doms = {};

            // Listen
            this.listenTo(this.options.appView.settings, 'change', this.changeCursor);
            this.changeCursor();
        },

        /**
         * Render the UI
         */
        render: function() {
            var self = this;

            // Render Canvas
            this.$el.html(this.template());
            this.$svg = this.$('svg');

            // Append Canvas
            this.prepareBaseEl();
            this.attachDrawEvents();

            // Chain
            return this;
        },

        /**
         * Prepare and Size Base Element
         */
        prepareBaseEl: function() {
            var $el     = this.$('svg'),
                $canvas = $('.app__canvas');

            $el.attr('width', $canvas.width());
            $el.attr('height', $canvas.height() - 10);

            this.snap = new Snap($el[0]);
        },

        /**
         * Draw Event
         * Everything Comes Down to This
         */
        attachDrawEvents: function() {

            var drawingID,
                self = this,
                shape,
                isBool;

            this.snap.drag(
                /**
                 * Drag Move
                 * Update the location and size of the object
                 */
                function(w, h, ox, oy, e) {
                    
                    var dom      = self.doms[drawingID],
                        x        = (w < 0) ? e.offsetX : dom.attr('x'),
                        y        = (h < 0) ? e.offsetY : dom.attr('y'),
                        duration = 1;

                    if( shape == 'circle' ) {
                        self.doms[drawingID].animate({
                            r: Math.abs(w)
                        }, duration);
                    }
                    else if( shape == 'ellipse' ) {
                        self.doms[drawingID].animate({
                            rx: Math.abs(w),
                            ry: Math.abs(h)
                        }, duration);
                    }
                    else{
                        self.doms[drawingID].animate({
                            width: Math.abs(w),
                            height: Math.abs(isBool ? w : h),
                            x: x,
                            y: y
                        }, duration);
                    }

                },

                /**
                 * Drag Start
                 * Create an object and save it in cache
                 */
                function(x, y, e) {
                    // New Settings
                    var dom;
                    shape   = self.options.appView.settings.get('shape');
                    isBool  = (shape == 'square' || shape == 'circle');

                    // Draw a cirlce
                    if( shape == 'circle' ) {
                        dom = self.snap.circle(e.offsetX, e.offsetY, 0);
                    }
                    // ... Or ellipse
                    else if( shape == 'ellipse' ) {
                        dom = self.snap.ellipse(e.offsetX, e.offsetY, 0, 0);
                    }
                    // or anything else.
                    else{
                        dom = self.snap.rect(e.offsetX, e.offsetY, 0, 0);
                    }

                    // Make it like we’re moving...
                    dom.attr({
                        strokeWidth     : 1,
                        strokeDasharray : 2,
                        stroke          : '#ccc',
                        fill            : 'transparent'
                    });

                    // Save
                    self.doms[dom.id] = dom;
                    drawingID         = dom.id; 
                },

                /**
                 * Drag End
                 * Destroy an object if it doesn’t have dimentions
                 * Stylize otherwise.
                 */
                function() {

                    // Destroy
                    if( drawingID &&
                        (
                            self.doms[drawingID].attr('width')  === 0 ||
                            self.doms[drawingID].attr('height') === 0 ||
                            self.doms[drawingID].attr('r')      === 0 ||
                            self.doms[drawingID].attr('rx')     === 0 ||
                            self.doms[drawingID].attr('ry')     === 0
                        )
                    ) {
                        self.doms[drawingID].remove();
                        self.doms[drawingID] = null;
                    }

                    // Finalize
                    else {
                        // Stylize if it’s shape
                        if( shape != 'text' ) {
                            self.doms[drawingID].attr({
                                fill            : self.options.appView.settings.get('fill'),
                                strokeWidth     : self.options.appView.settings.get('strokeWidth'),
                                stroke          : self.options.appView.settings.get('strokeColor'),
                                strokeDasharray : 0
                            });
                        }
                        // Or make text
                        else {
                            // Save new vars
                            var textVars = {
                                width  : self.doms[drawingID].attr('width'),
                                height : self.doms[drawingID].attr('height'),
                                x      : self.doms[drawingID].attr('x'),
                                y      : self.doms[drawingID].attr('y')
                            };
                            
                            // Convert the shape to text
                            self.doms[drawingID].remove();
                            self.doms[drawingID] = self.createTextNode(textVars);
                        }

                        // Create Transform Handlers
                        self.doms[drawingID].dblclick(function() {
                            this.ftCreateHandles();
                        });

                        // Log to Console
                        console.log('Object (' + shape + ') ID' + drawingID + ' has been created.');
                    }
                    
                }
            );
        },

        /**
         * Change Cursor
         */
        changeCursor: function() {
            this.$el.toggleClass('textEdit', (this.options.appView.settings.get('shape') == 'text'));
        },

        /**
         * Create a text node, 
         * since it’s complicated it’s separated from the logic
         */
        createTextNode: function(vars) {
            // Make a text node
            var text = this.snap.text(vars.x, (parseFloat(vars.y) + parseFloat(vars.height)), '');

            // Font Style
            text.attr({
                fontSize    : vars.height,
                fontFamily  : this.options.appView.settings.get('fontFamily'),
                fill        : this.options.appView.settings.get('fill'),
                strokeWidth : this.options.appView.settings.get('strokeWidth'),
                stroke      : this.options.appView.settings.get('strokeColor')
            });

            // Set Text
            var textView = new TextView({textObj: text});
            this.$el.append(textView.render().el);

            // Return to normal
            return text;
        }

    });
});