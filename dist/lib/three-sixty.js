"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var image_loader_1 = require("./image-loader");
var Hammer = require('hammerjs');
var ThreeSixty = /** @class */ (function () {
    /**
     * @param {HTMLCanvasElement} canvasElement
     * @param {ConfigurationInterface} configuration
     */
    function ThreeSixty(canvasElement, configuration) {
        var _this = this;
        this.canvasElement = canvasElement;
        this.configuration = configuration;
        /**
         * @type {HTMLElement[]}
         */
        this.hotspotElements = [];
        /**
         * Angle of the current image
         * Number between 0 and 360
         *
         * @type {number}
         */
        this.angle = 0;
        /**
         * Angle of the image before the drag process began
         *
         * @type {number}
         */
        this.preDragAngle = 0;
        this.canvas2dContext = this.canvasElement.getContext('2d');
        this.imageLoader = new image_loader_1.ImageLoader();
        window.onresize = function () { return _this.images = _this.getActiveImages(); };
    }
    /**
     * Initialize the three sixty widget
     *
     * @param {ImageSetInterface} imageSet - Array of image sprites
     * @param {number} startAngle - The initial angle to show (number between 0 and 360)
     */
    ThreeSixty.prototype.initialize = function (imageSet, startAngle) {
        var _this = this;
        if (startAngle === void 0) { startAngle = 0; }
        if (startAngle < 0 || startAngle > 360) {
            throw new Error('The specified start angle must be between 0 and 360.');
        }
        this.angle = startAngle;
        this.imageSet = imageSet;
        this.images = this.getActiveImages();
        // Wrap the canvas element
        this.containerElement = document.createElement('div');
        this.containerElement.classList.add(ThreeSixty.CONTAINER_CLASS);
        this.canvasElement.parentElement.insertBefore(this.containerElement, this.canvasElement);
        this.containerElement.appendChild(this.canvasElement);
        this.initializeHotspots();
        this.initializeEventListeners();
        var imageIndexes = this.getImageIndexesForCurrentAngle();
        this.imageLoader.load(this.images[imageIndexes.targetSpriteIndex])
            .then(function (image) { return _this.drawAngle(image, imageIndexes.targetImageIndex); });
    };
    /**
     * Update the configuration and re-render the hotspots
     *
     * @param {ConfigurationInterface} configuration
     */
    ThreeSixty.prototype.updateConfiguration = function (configuration) {
        this.configuration = configuration;
        this.hotspotElements.forEach(function (hotspotElement) { return hotspotElement.parentElement.removeChild(hotspotElement); });
        this.hotspotElements = [];
        this.initializeHotspots();
    };
    /**
     * Update and re-render the images
     *
     * @param {ImageSetInterface} imageSet
     */
    ThreeSixty.prototype.updateImages = function (imageSet) {
        var _this = this;
        this.imageSet = imageSet;
        this.images = this.getActiveImages();
        var imageIndexes = this.getImageIndexesForCurrentAngle();
        this.imageLoader.load(this.images[imageIndexes.targetSpriteIndex])
            .then(function (image) { return _this.drawAngle(image, imageIndexes.targetImageIndex); });
    };
    /**
     * Preload all images
     *
     * @returns {Promise<null>}
     */
    ThreeSixty.prototype.preload = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var imagesLoaded = 0;
            /**
             * Preload a single image
             * Resolve the Promise if all images were loaded
             *
             * @param {string} url
             */
            var preloadImage = function (url) {
                _this.imageLoader.load(url)
                    .then(function () {
                    imagesLoaded++;
                    if (imagesLoaded === _this.images.length) {
                        resolve();
                    }
                });
            };
            _this.images.forEach(preloadImage.bind(_this));
        });
    };
    /**
     * Get the active images for the current browser width
     *
     * @returns {string[]}
     */
    ThreeSixty.prototype.getActiveImages = function () {
        var width = window.outerWidth;
        var breakpoints = Object.keys(this.imageSet);
        var activeBreakpoint = breakpoints.sort().reverse().find(function (breakpoint) {
            if (parseFloat(breakpoint) <= width) {
                return true;
            }
        });
        return this.imageSet[activeBreakpoint];
    };
    /**
     * Initialize the hotspots
     */
    ThreeSixty.prototype.initializeHotspots = function () {
        var _this = this;
        if (this.configuration.hotspots) {
            this.configuration.hotspots.forEach(function (hotspot) {
                var hotspotElement = document.createElement('div');
                hotspotElement.classList.add(ThreeSixty.HOTSPOT_CLASS);
                hotspotElement.innerText = hotspot.text;
                if (hotspot.top) {
                    hotspotElement.style.top = hotspot.top;
                }
                if (hotspot.left) {
                    hotspotElement.style.left = hotspot.left;
                }
                _this.hotspotElements.push(hotspotElement);
            });
            this.hotspotElements.forEach(function (hotSpotElement) { return _this.containerElement.appendChild(hotSpotElement); });
            this.showActiveHotspots();
        }
    };
    /**
     * Show the active hotspots
     */
    ThreeSixty.prototype.showActiveHotspots = function () {
        var _this = this;
        if (this.configuration.hotspots) {
            this.configuration.hotspots.forEach(function (hotspot, i) {
                if (hotspot.angle <= _this.angle && hotspot.endAngle >= _this.angle) {
                    _this.hotspotElements[i].classList.add(ThreeSixty.HOTSPOT_ACTIVE_CLASS);
                }
                else {
                    _this.hotspotElements[i].classList.remove(ThreeSixty.HOTSPOT_ACTIVE_CLASS);
                }
            });
        }
    };
    /**
     * Initialize the event listeners
     */
    ThreeSixty.prototype.initializeEventListeners = function () {
        this.hammer = new Hammer(this.canvasElement);
        this.hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });
        this.hammer.on('pan', this.onDrag.bind(this));
        this.hammer.on('panstart', this.onDragStart.bind(this));
    };
    /**
     * Get the target image indexes for the current angle
     */
    ThreeSixty.prototype.getImageIndexesForCurrentAngle = function () {
        var targetImageIndex = Math.round(this.angle / (360 / this.configuration.angles));
        var targetSpriteIndex = Math.floor(targetImageIndex / this.configuration.anglesPerImage);
        return { targetImageIndex: targetImageIndex % this.configuration.anglesPerImage, targetSpriteIndex: targetSpriteIndex };
    };
    /**
     * Draw a specific angle
     *
     * @param {Image} image
     * @param {number} imageIndex
     */
    ThreeSixty.prototype.drawAngle = function (image, imageIndex) {
        var _this = this;
        var loaded = false;
        var _drawAngle = function () {
            _this.canvas2dContext.drawImage(image, 0, -_this.canvasElement.height * imageIndex, _this.canvasElement.width, _this.canvasElement.height * _this.configuration.anglesPerImage);
            if (!loaded) {
                window.requestAnimationFrame(_drawAngle.bind(_this));
                loaded = true;
            }
        };
        window.requestAnimationFrame(_drawAngle.bind(this));
    };
    /**
     * Drag the angle
     *
     * @param {{deltaX: number}} e
     */
    ThreeSixty.prototype.onDrag = function (e) {
        var _this = this;
        // Calculate new image angle
        this.adaptAngle(-e.deltaX);
        var imageIndexes = this.getImageIndexesForCurrentAngle();
        // Load and render new image angle
        this.imageLoader.load(this.images[imageIndexes.targetSpriteIndex])
            .then(function (image) { return _this.drawAngle(image, (imageIndexes.targetImageIndex)); });
        this.showActiveHotspots();
    };
    /**
     * Cache the angle before the drag starts
     */
    ThreeSixty.prototype.onDragStart = function () {
        this.preDragAngle = this.angle;
    };
    /**
     * Recalculate the canvas angle
     *
     * @param {number} distance
     */
    ThreeSixty.prototype.adaptAngle = function (distance) {
        distance = Math.ceil(distance * (this.configuration.speedFactor ? this.configuration.speedFactor : 5));
        var width = window.innerWidth;
        var dx = (distance / width);
        var tmpAngle = ((1 - (this.preDragAngle / 360)) + dx * 1.5);
        while (tmpAngle < 0) {
            tmpAngle++;
        }
        tmpAngle = tmpAngle % 1;
        this.angle = -360 * tmpAngle + 360;
    };
    /**
     * @type {string}
     */
    ThreeSixty.CONTAINER_CLASS = 'three-sixty-container';
    /**
     * @type {string}
     */
    ThreeSixty.HOTSPOT_CLASS = 'three-sixty__hotspot';
    /**
     * @type {string}
     */
    ThreeSixty.HOTSPOT_ACTIVE_CLASS = 'three-sixty__hotspot--active';
    return ThreeSixty;
}());
exports.default = ThreeSixty;
//# sourceMappingURL=three-sixty.js.map