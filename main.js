$(document).ready(function () {
  var mainImg = $('.cropper-container > img').cropper({
    aspectRatio: 16 / 9,
    zoomable: false
  });

  var thumbs = $('.col-md-3 > img').cropper({
    aspectRatio: 16 / 9,
    zoomable: false
  });

  mainImg.on('dragend.cropper', function (e) {
    console.log(mainImg.cropper('getData'));
  });

  setTimeout(function () {
    thumbs.on('dragend.cropper', function (e) {
      console.log($(this).cropper('getData'));
    });
  }, 2000);
});
