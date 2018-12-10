"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ImageLoader = /** @class */ (function () {
    function ImageLoader() {
        /**
         * @type {{[string]: Image}}
         */
        this.cache = {};
    }
    /**
     * Load an image
     *
     * @param {string} url
     * @returns {Promise<Image>}
     */
    ImageLoader.prototype.load = function (url) {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.cache.hasOwnProperty(url)) {
                return resolve(_this.cache[url]);
            }
            var image = new Image();
            image.onload = function () {
                _this.cache[url] = image;
                resolve(image);
            };
            image.src = url;
        });
    };
    return ImageLoader;
}());
exports.ImageLoader = ImageLoader;
//# sourceMappingURL=image-loader.js.map