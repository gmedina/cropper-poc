$(document).ready(function () {
  /*
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
  */
  var croppedImg;
  var cropperContainer = $('.cropper-container');

  function getAspectRatio($img) {
    var ar = $img.data('aspect-ratio').split(':');
    if (ar.length > 1) {
      return ar[0] / ar[1];
    } else {
      return 'original';
    }
  }

  function initCropper($img, $thumb) {
    var aspectRatio = getAspectRatio($thumb); 

    if (!croppedImg) {
      croppedImg = cropperContainer.find('img').cropper({
        zoomable: false,
        autoCropArea: 1
      });
    }

    if (aspectRatio == 'original') {
      croppedImg.cropper('setAspectRatio', null);
      croppedImg.on('built.cropper', function () {
        //croppedImg.cropper('clear');
      });
    } else {
      croppedImg.cropper('setAspectRatio', aspectRatio);
    }
  }

  function addMask($img) {
    var aspectRatio = getAspectRatio($img);

    if (aspectRatio === 'original') {
      return;
    }

    var cropPreview;
    var $parent = $img.parent();
    var height = $img.height();
    var width = $img.width();
    var clipWidth = width;
    var clipHeight = clipWidth / aspectRatio;
    var x = 0;
    var xPercent = 0;
    var y = ((height - clipHeight) / 2);
    var yPercent = (100 * y) / height;

    var $clippedImg = $('<img src="' + $img.attr('src') + '" >');

    if (y < 0) {
      clipHeight = height;
      clipWidth = clipHeight * aspectRatio;
      x = ((width - clipWidth) / 2);
      xPercent = (100 * x) / width;
      y = 0;
      yPercent = 0;
    }
    
    $clippedImg.css('-webkit-clip-path', 'inset(' + yPercent + '% ' + xPercent + '%)');

    console.log('==================');
    console.log('y', y);
    console.log('yPercent', yPercent);
    console.log('x', x);
    console.log('xPercent', xPercent);


    $parent.append('<div class="mask"></div>');
    $parent.append('<div class="crop-preview"></div>');
    $parent.find('.crop-preview').append($clippedImg);
    
  }
  
  var thumbs = $('.thumb-container > img');

  $('.thumb-container').on('click', function (evt) {
    var thumb = $(this).find('> img');
    var aspectRatio = getAspectRatio(thumb); 

    cropperContainer.find('.aspect-ratio').html(thumb.data('aspect-ratio'));
    thumbs.removeClass('selected');
    thumb.addClass('selected');

    initCropper(cropperContainer.find('img'), thumb);
  });

  thumbs.each(function (i, thumb) {
    addMask($(thumb));
  });


  initCropper(cropperContainer.find('img'), $('img[data-aspect-ratio="original"]'));
});
