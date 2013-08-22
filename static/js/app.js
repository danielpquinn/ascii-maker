define([
  'jquery',
  'lib/asciigenerator'
], function ($, AsciiGenerator) {

  function App() {};

  var a = App.prototype;

  a.init = function () {
    console.log(this);
    this.setup();
    this.bindEvents();
  }

  a.setup = function () {
    var $e = this.$el = $('#app');
    this.$fileDrop = $e.find('#file-drop');
    this.$messageContainer = $e.find('#message-container');
    this.$message = $e.find('#message');
    this.$image = $e.find('#image');
    this.$output = $e.find('#output');
    this.asciiGenerator = new AsciiGenerator();
  }

  a.bindEvents = function () {
    var self = this;

    this.$fileDrop.on('dragenter', function () { self.onFileDropDragEnter.apply(self, arguments); });
    this.$fileDrop.on('dragleave', function () { self.onFileDropDragLeave.apply(self, arguments); });
    this.$fileDrop.on('dragover', function () { self.onFileDropDragOver.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.cancel.apply(self, arguments); });
    this.$fileDrop.on('drop', function () { self.onFileDropDrop.apply(self, arguments); });
    this.$fileDrop.on('dragend', function () { self.cancel.apply(self, arguments); });
  }

  a.onFileDropDragEnter = function (e) {
    this.cancel(e);
  }

  a.onFileDropDragLeave = function (e) {
    this.cancel(e);
  }

  a.onFileDropDragOver = function (e) {
    this.cancel(e);
  }

  a.onFileDropDrop = function (e) {
    var self = this,
      file = e.originalEvent.dataTransfer.files[0],
      src = URL.createObjectURL(file),
      image = new Image();
    
    self.cancel(e);
    
    image.onload = function () {
      var string = self.asciiGenerator.generateAscii(image),
        h = string.match(/\n/g).length * 24;
      self.$output.html(string);
      self.$output.css({
        height: h + 'px'
      });
    }

    image.src = src;

    self.$image.attr('src', src);
  }

  a.cancel = function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  a.showMessage = function (message, type) {
    var type = type || 'info';
    this.$messageContainer.removeClass();
    this.$messageContainer.addClass('control-group ' + type);
    this.$message.html(message);
  }

  return App;

});