export declare class ImageLoader {
    /**
     * @type {{[string]: Image}}
     */
    private cache;
    /**
     * Load an image
     *
     * @param {string} url
     * @returns {Promise<Image>}
     */
    load(url: string): Promise<any>;
}
