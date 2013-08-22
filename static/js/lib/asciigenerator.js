define([
  'settings'
], function (Settings) {

  function AsciiGenerator() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.defaultChars = '$&%#+=-. '.split('');
    this.numChars = this.defaultChars.length;
  };

  var i = AsciiGenerator.prototype;

  i.generateAscii = function (image) {
    var w = Settings.textCols,
      h = Math.floor(image.height * (Settings.textCols / image.width) / 2),
      imgData;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0, w, h);
    imgData = this.ctx.getImageData(0, 0, w, h).data;
    return this.rgbaToBw(imgData, w, h);
  }

  i.rgbaToBw = function (imgData, w, h) {
    var i = 0,
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

        string += this.defaultChars[Math.floor(val * (this.numChars - 1))];
      }
      string += '\n'
    }

    return string;
  }

  return AsciiGenerator;

});