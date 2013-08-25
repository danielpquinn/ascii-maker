define([
  'jquery',
  'lib/asciigenerator',
  'settings',
  'lib/jquery.form'
], function ($, AsciiGenerator, Settings) {

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
    this.$imageUploadForm = $e.find('#image-upload');
    this.$messageContainer = $e.find('#message-container');
    this.$message = $e.find('#message');
    this.$image = $e.find('#image');
    this.$output = $e.find('#output');
    this.$textColsInput = $e.find('#text-cols').val(Settings.textCols);
    this.$characterPaletteInput = $e.find('#character-palette').val(Settings.characterPalette);
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
    this.$textColsInput.on('change', function () { self.onTextColsInputChange.apply(self, arguments); });
    this.$characterPaletteInput.on('keyup', function () { self.onCharacterPaletteInputChange.apply(self, arguments); });
    this.$imageUploadForm.on('submit', function () { self.onImageUploadFormSubmit.apply(self, arguments); });
  }

  a.onTextColsInputChange = function (e) {
    Settings.textCols = e.target.value;
    this.updateOutput();
  }

  a.onCharacterPaletteInputChange = function (e) {
    Settings.characterPalette = e.target.value;
    this.updateOutput();
  }

  a.onFileDropDragEnter = function (e) {
    this.cancel(e);
    this.$fileDrop.addClass('hover');
  }

  a.onFileDropDragLeave = function (e) {
    this.cancel(e);
    this.$fileDrop.removeClass('hover');
  }

  a.onFileDropDragOver = function (e) {
    this.cancel(e);
  }

  a.onFileDropDrop = function (e) {
    var file = e.originalEvent.dataTransfer.files[0],
      src = URL.createObjectURL(file);
    
    this.cancel(e);

    this.setImage(src);
  }

  a.onImageUploadFormSubmit = function (e) {
    var self = this;
    console.log('submitting');

    self.$imageUploadForm.ajaxSubmit({
      error: function (xhr) {
        console.log('error: ' + xhr.status);
      },
      success: function (res) {
        console.log('success');
        self.setImage(res['image-file'].path.replace('static/', ''));
      }
    });

    self.cancel(e);
  }

  a.setImage = function (src) {
    var self = this,
      image = new Image();

    self.$image.css({
      'opacity': 0
    });
    
    image.onload = function () {
      self.resetMessage();
      self.$image.attr('src', src);
      self.$image.animate({
        'opacity': 1
      });
      self.image = image;
      self.updateOutput();
    }

    image.onerror = function (error) {
      console.log(arguments);
    }

    image.src = src;

    this.$fileDrop.removeClass('hover');
  }

  a.updateOutput = function () {
    if (!this.image) {
      return;
    }
    var self = this,
      string = self.asciiGenerator.generateAscii(self.image),
      h = string.match(/\n/g).length * 24;

    self.$output.css({
      height: h + 'px'
    }).text(string);
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

  a.resetMessage = function () {
    this.$messageContainer.removeClass();
    this.$message.html(''); 
  }

  return App;

});