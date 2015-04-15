define([
    'backbone',
    'snap'
], function() {
    'use strict';

    /**
     * Free Transform Plugin
     * Rewritten from scratch based on this plugin:
     * https://groups.google.com/forum/#!topic/snapsvg/peQU1iJG8R8
     * 
     * by Sallar Kaboli
     */
    Snap.plugin(function(Snap, Element, Paper, global)
    {
        var ftOption = {
            handleFill        : 'silver',
            handleStrokeDash  : 3,
            handleStrokeWidth : 1,
            handleLength      : 30,
            handleRadius      : 5,
            handleLineWidth   : 2,
        };

        /**
         * Create the transform handles
         */
        Element.prototype.ftCreateHandles = function() {

            // Init 
            this.ftInit();

            // Make Elements
            var freetransEl      = this,
                bb               = freetransEl.getBBox(),
                rotateDragger    = this.paper.circle(bb.cx + bb.width + ftOption.handleLength, bb.cy, ftOption.handleRadius).attr({fill: ftOption.handleFill}),
                translateDragger = this.paper.circle(bb.cx, bb.cy, ftOption.handleRadius).attr({fill: ftOption.handleFill}),
                joinLine         = freetransEl.ftDrawJoinLine(rotateDragger),
                handlesGroup     = this.paper.g(joinLine, rotateDragger, translateDragger);

            // Set Data
            freetransEl.data('handlesGroup', handlesGroup);
            freetransEl.data('joinLine', joinLine);
            freetransEl.data('scaleFactor', calcDistance(bb.cx, bb.cy, rotateDragger.attr('cx'), rotateDragger.attr('cy')));

            // Attach Move Event
            translateDragger.drag(
                elementMove.move.bind(translateDragger, freetransEl),
                elementMove.start.bind(translateDragger, freetransEl),
                elementMove.end.bind(translateDragger, freetransEl)
            );

            // Attach Rotate Event
            rotateDragger.drag( 
                elementRotate.move.bind(rotateDragger, freetransEl),
                elementRotate.start.bind(rotateDragger, freetransEl),
                elementRotate.end.bind(rotateDragger, freetransEl)
            );
            freetransEl.ftStoreInitialTransformMatrix();

            // Attach Events on DoubleClick
            freetransEl.undblclick();
            freetransEl.data('dblclick', freetransEl.dblclick(function() {
                this.ftRemoveHandles();
            }));

            // Highlight
            freetransEl.ftHighlightBB();
            return this;
        };

        /**
         * Init Data
         */
        Element.prototype.ftInit = function() {
            this.data('angle', 0);
            this.data('scale', 1);
            this.data('tx', 0);
            this.data('ty', 0);
            return this;
        };

        Element.prototype.ftCleanUp = function() {
            var myClosureEl = this,
                myData      = ["angle", "scale", "scaleFactor", "tx", "ty", "otx", "oty", "bb", "bbT", "initialTransformMatrix", "handlesGroup", "joinLine"];
            myData.forEach(function(el) {
                myClosureEl.removeData([el]);
            });
            return this;
        };

        Element.prototype.ftStoreStartCenter = function() {
            this.data('ocx', this.attr('cx') );
            this.data('ocy', this.attr('cy') );
            return this;
        };
        
        Element.prototype.ftStoreInitialTransformMatrix = function() {
            this.data('initialTransformMatrix', this.transform().localMatrix );
            return this;
        };

        Element.prototype.ftGetInitialTransformMatrix = function() {
            return this.data('initialTransformMatrix');
        };

        Element.prototype.ftRemoveHandles = function() {
            this.undblclick();
            this.data('handlesGroup').remove();
            if(this.data('bbT')) {
                this.data('bbT').remove();
            }
            if(this.data('bb')) {
                this.data('bb').remove();
            }
            this.dblclick(function() {
                this.ftCreateHandles();
            });
            this.ftCleanUp();

            return this;
        };

        /**
         * Draw Join Lines
         */
        Element.prototype.ftDrawJoinLine = function(handle) {

            var lineAttributes = {
                stroke          : ftOption.handleFill,
                strokeWidth     : ftOption.handleStrokeWidth,
                strokeDasharray : ftOption.handleStrokeDash
            };

            var rotateHandle = handle.parent()[1],
                thisBB       = this.getBBox(),
                objtps       = this.ftTransformedPoint(thisBB.cx, thisBB.cy);

            if( this.data('joinLine') ) {
                this.data('joinLine').attr({
                    x1: objtps.x,
                    y1: objtps.y,
                    x2: rotateHandle.attr('cx'),
                    y2: rotateHandle.attr('cy')
                });
            }
            else {
                return this.paper.line(thisBB.cx, thisBB.cy, handle.attr('cx'), handle.attr('cy')).attr(lineAttributes);
            }

            return this;
        };

        Element.prototype.ftTransformedPoint = function(x, y) {
            var transform = this.transform().diffMatrix;
            return {
                x: transform.x(x, y),
                y: transform.y(x, y)
            };
        };
        
        Element.prototype.ftUpdateTransform = function() {
            var tstring = 't' + this.data('tx') + ',' + this.data('ty') + this.ftGetInitialTransformMatrix().toTransformString() + 'r' + this.data("angle") + 'S' + this.data('scale');        
            this.attr({transform: tstring});
            /*jshint -W030 */
            this.data('bbT') && this.ftHighlightBB();
            return this;
        };

        /**
         * Highlight BBox
         */
        Element.prototype.ftHighlightBB = function() {
            /*jshint -W030 */
            this.data('bbT') && this.data('bbT').remove();
            this.data('bb') && this.data('bb').remove();
            this.data('bbT', this.paper.rect(rectObjFromBB(this.getBBox(1)))
                            .attr({
                                fill            : 'none',
                                stroke          : ftOption.handleFill,
                                strokeDasharray : ftOption.handleStrokeDash
                            })
                            .transform(this.transform().global.toString())
            );
            this.data('bb', this.paper.rect(rectObjFromBB(this.getBBox()))
                            .attr({
                                fill            : 'none',
                                stroke          : ftOption.handleFill,
                                strokeDasharray : ftOption.handleStrokeDash
                            })
            );

            return this;
        };
        
    });

    /**
     * Helpers
     */
    var rectObjFromBB = function(bb) {
        return {
            x      : bb.x,
            y      : bb.y,
            width  : bb.width,
            height : bb.height
        }; 
    };

    var calcDistance = function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    };

    /**
     * Move Handlers
     */
    var elementMove = {
        move: function(mainEl, dx, dy, x, y) {
            var dragHandle = this;

            this.parent().selectAll('circle').forEach(function(el, i) {
                el.attr({
                    cx: +el.data('ocx') + dx,
                    cy: +el.data('ocy') + dy
                });
            });

            mainEl.data('tx', mainEl.data('otx') + (+dx));
            mainEl.data('ty', mainEl.data('oty') + (+dy));
            mainEl.ftUpdateTransform();
            mainEl.ftDrawJoinLine(dragHandle);
        },

        start: function(mainEl, x, y, e) {
            e.stopPropagation();

            this.parent().selectAll('circle').forEach(function(el, i) {
                el.ftStoreStartCenter();
            });

            mainEl.addClass('moving');

            mainEl.data('otx', mainEl.data('tx') || 0);
            mainEl.data('oty', mainEl.data('ty') || 0);
        },

        end: function(mainEl, dx, dy, x, y) {
            mainEl.removeClass('moving');
        }
    };

    /**
     * Rotate Handlers
     */
    var elementRotate = {
        move: function(mainEl, dx, dy, x, y, event) {
            var handle = this;
            var mainBB = mainEl.getBBox();

            handle.attr({
                cx: +handle.data('ocx') + dx,
                cy: +handle.data('ocy') + dy
            });
            mainEl.data('angle', Snap.angle(mainBB.cx, mainBB.cy, handle.attr('cx'), handle.attr('cy')) - 180);

            var distance = calcDistance(mainBB.cx, mainBB.cy, handle.attr('cx'), handle.attr('cy'));
            mainEl.data('scale', distance / mainEl.data('scaleFactor'));

            mainEl.ftUpdateTransform();
            mainEl.ftDrawJoinLine(handle);    
        },

        start: function(mainElement, x, y , e) {
            e.stopPropagation();
            this.ftStoreStartCenter();
            this.addClass('rotating');
        },

        end: function(mainElement) {
            this.removeClass('rotating');
        }
    };

});