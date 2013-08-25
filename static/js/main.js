require.config({
  paths: {
    'jquery': 'components/jquery/jquery'
  },
  shim: {
    'lib/jquery.form': {
      deps: [
        'jquery'
      ]
    }
  }
});

require([
  'app'
], function(App) {

  var app = window.APP = new App();

  $(function () {
    app.init();
  });

});