(function (window) {
  var app = window.document.getElementById('app');

  app.apiKey = '<<YOUR API KEY>>';

  app.maxResults = 1;
  app.features = [{
    type: 'FACE_DETECTION',
    name: 'Face detection',
    active: true
  }, {
    type: 'LANDMARK_DETECTION',
    name: 'Landmark detection',
    active: false
  }, {
    type: 'LOGO_DETECTION',
    name: 'Logo detection',
    active: false
  }, {
    type: 'LABEL_DETECTION',
    name: 'Label detection',
    active: false
  }, {
    type: 'TEXT_DETECTION',
    name: 'OCR',
    active: false
  }, {
    type: 'SAFE_SEARCH_DETECTION',
    name: 'Safe Search',
    active: false
  }, {
    type: 'IMAGE_PROPERTIES',
    name: 'Image properties',
    active: false
  }];

  app._analysePhoto = function (data) {
    if (!data) { return; }
    var request = app.$.request;
    var features = [];

    app.$.chosenPhoto.src = data;

    data = data.split(',')[1];

    app.features.forEach(function (f) {
      if (f.active) {
        features.push({
          type: f.type,
          maxResults: app.maxResults
        });
      }
    });

    request.body = {
      requests: [
        {
          image: {
            content: data
          },
          features: features
        }
      ]
    };

    app.$.results.innerHTML = 'Requesting data, please wait...';
    request.go();
  };

  app.takePhoto = function () {
    var video = app.$.video;

    video.pause();

    var data = video.capture();

    app._analysePhoto(data);
  };

  app.choosePhoto = function () {
    window.document.getElementById('upload').click();
  };

  window.document.getElementById('upload').addEventListener('change', function (e) {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      var reader = new window.FileReader();
      reader.onload = function (re) {
        app._analysePhoto(re.target.result);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }, false);

  app.apiResponse = function (r) {
    var details = r.detail;

    app.$.results.innerHTML = JSON.stringify(details, null, 2);

    app.$.video.play();
  };

  app.apiError = function(e) {
    app.$.results.innerHTML = e.detail.message;
    app.$.video.play();
  };

  app.videoError = function (e) {
    app.$.videoError.innerHTML = 'Error accessing webcam: ' + (e.detail.message || e.detail.name || '');
  };

  app.captureError = function (e) {
    app.$.videoError.innerHTML = 'Error capturing webcam image: ' + (e.detail || '');
  };

}(this));