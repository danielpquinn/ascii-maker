define([
  'settings'
], function (Settings) {

  /**
   * Creates ascii art string from native JavaSript Image object
   * @class AsciiGenerator
   * @name AsciiGenerator
   * @constructor
   */
  function AsciiGenerator() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  };

  var a = AsciiGenerator.prototype;

  /**
   * Generates ascii string from image by drawing the image to a canvas and
   * then extracting image data and passing it to rgbaToBw
   * @memberOf AsciiGenerator
   * @param  {Image} image Native JavaScript image to be converted to ascii
   * @return {undefined}
   */
  a.generateAscii = function (image) {
    var w = Settings.textCols,
      h = Math.floor(image.height * (Settings.textCols / image.width) / 2),
      imgData;

    image.crossOrigin = '';

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0, w, h);
    imgData = this.ctx.getImageData(0, 0, w, h).data;
    return this.rgbaToBw(imgData, w, h);
  }

  /**
   * Takes image data object, width and height, converts data to a string of characters
   * based on global Settings.characterPallet string
   * @memberOf AsciiGenerator
   * @param  {Array} image Native JavaScript image to be converted to ascii
   * @return {String}
   */
  a.rgbaToBw = function (imgData, w, h) {
    var i = 0,
      chars = Settings.characterPalette.split(''),
      string = '';

    for (i; i < h; i += 1) {
      var n = 0;

      for (n; n < w; n += 1) {
        var index = (n * 4) + (i * (w * 4)),
          r = imgData[index],
          b = imgData[index + 1],
          g = imgData[index + 2],
          a = imgData[index + 3],
          val = (((r * 77) + (b * 28) + (g * 151)) / 65280);

        string += chars[Math.floor(val * (chars.length - 1))];
      }
      string += '\n';
    }

    return string;
  }

  return AsciiGenerator;

});