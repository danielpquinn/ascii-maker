define(function () {

  function AsciiGenerator() {};

  var i = AsciiGenerator.prototype;

  i.init = function () {
    this.canvas = document.createElement('canvas');
  }

  i.generateAscii = function (image) {
    console.log(image);
    var asciiString = 'some stuff';
    return asciiString;
  }

  return AsciiGenerator;

});