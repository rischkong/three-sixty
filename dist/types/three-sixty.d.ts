import {ConfigurationInterface} from './interfaces/configuration.interface';
import {ImageSetInterface} from './interfaces/image-set.interface';

export default class ThreeSixty {
  private canvasElement;
  private configuration;
  /**
   * @type {string}
   */
  static CONTAINER_CLASS: string;
  /**
   * @type {string}
   */
  static HOTSPOT_CLASS: string;
  /**
   * @type {string}
   */
  static HOTSPOT_ACTIVE_CLASS: string;
  /**
   * Array of image sprites
   *
   * @type {string[]}
   */
  private images;
  /**
   * Image configuration
   *
   * @type {ImageSetInterface}
   */
  private imageSet;
  /**
   * @type {Hammer}
   */
  private hammer;
  /**
   * @type {HTMLElement}
   */
  private containerElement;
  /**
   * @type {HTMLElement[]}
   */
  private hotspotElements;
  /**
   * @type {CanvasRenderingContext2D}
   */
  private canvas2dContext;
  /**
   * @type {ImageLoader}
   */
  private imageLoader;
  /**
   * Angle of the current image
   * Number between 0 and 360
   *
   * @type {number}
   */
  public angle;
  /**
   * Angle of the image before the drag process began
   *
   * @type {number}
   */
  private preDragAngle;

  /**
   * @param {HTMLCanvasElement} canvasElement
   * @param {ConfigurationInterface} configuration
   */
  constructor(canvasElement: HTMLCanvasElement, configuration: ConfigurationInterface);

  /**
   * Initialize the three sixty widget
   *
   * @param {ImageSetInterface} imageSet - Array of image sprites
   * @param {number} startAngle - The initial angle to show (number between 0 and 360)
   */
  initialize(imageSet: ImageSetInterface, startAngle?: number): void;

  /**
   * Update the configuration and re-render the hotspots
   *
   * @param {ConfigurationInterface} configuration
   */
  updateConfiguration(configuration: ConfigurationInterface): void;

  /**
   * Update and re-render the images
   *
   * @param {ImageSetInterface} imageSet
   */
  updateImages(imageSet: ImageSetInterface): void;

  /**
   * Preload all images
   *
   * @returns {Promise<null>}
   */
  preload(): Promise<null>;

  /**
   * Get the active images for the current browser width
   *
   * @returns {string[]}
   */
  private getActiveImages();

  /**
   * Initialize the hotspots
   */
  private initializeHotspots();

  /**
   * Show the active hotspots
   */
  private showActiveHotspots();

  /**
   * Initialize the event listeners
   */
  private initializeEventListeners();

  /**
   * Get the target image indexes for the current angle
   */
  private getImageIndexesForCurrentAngle();

  /**
   * Draw a specific angle
   *
   * @param {Image} image
   * @param {number} imageIndex
   */
  private drawAngle(image, imageIndex);

  /**
   * Drag the angle
   *
   * @param {{deltaX: number}} e
   */
  private onDrag(e);

  /**
   * Cache the angle before the drag starts
   */
  private onDragStart();

  /**
   * Recalculate the canvas angle
   *
   * @param {number} distance
   */
  private adaptAngle(distance);

  /**
   * Goto the angle
   *
   * @param {{angle: number}} e
   */
  public gotoAngle(desiredAngle);

  /**
   * Goto the angle with distance (from mouse simulation)
   *
   * @param {{angle: number}} e
   */
  public gotoAngleWithDistance(desiredAngle);

  /**
   * Goto the angle
   *
   * @param {{angle: number}} e
   */
  public getAngle(): number;
}
