$(document).ready(function () {
  var croppedImg;
  var cropperContainer = $('.cropper-container');
  var $currentThumb;

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
    $currentThumb = $thumb;

    if (!croppedImg) {
      croppedImg = cropperContainer.find('img').cropper({
        zoomable: false,
        autoCropArea: 1
      });
    }

    if (aspectRatio == 'original') {
      croppedImg.cropper('setAspectRatio', null);
      croppedImg.on('built.cropper', function () {
        console.log('initialized');
        croppedImg.on('dragstart.cropper', function (evt) {
          var mouseX = evt.originalEvent.offsetX;
          var mouseY = evt.originalEvent.offsetY;
          var cropBoxData = croppedImg.cropper('getCropBoxData');
          var left = mouseX - (cropBoxData.width / 2);
          var top = mouseY - (cropBoxData.height / 2);
          console.log('mouse', mouseX, mouseY, left, top);

          croppedImg.cropper('setCropBoxData', {
            top: top,
            left: left
          });

        });
        croppedImg.on('dragmove.cropper', function (evt) {
          var $clippedImg = $currentThumb.parent().find('.crop-preview img');
          var data = croppedImg.cropper('getData');
          var imageData = croppedImg.cropper('getImageData');
          var path = '';
          var width = $currentThumb.width();
          var height = $currentThumb.height();
          var top = data.y * (height / imageData.naturalHeight);
          var right = (imageData.naturalWidth - (data.x + data.width)) * (width / imageData.naturalWidth);
          var bottom = (imageData.naturalHeight - (data.y + data.height)) * (height / imageData.naturalHeight);
          var left = data.x * (width / imageData.naturalWidth);
          console.log(croppedImg.cropper('getData'));
          top = (100 * top) / height;
          right = (100 * right) / width;
          bottom = (100 * bottom) / height;
          left = (100 * left) / width;
          $clippedImg.css('-webkit-clip-path', 'inset(' + top + '% ' + right + '% ' + bottom + '% ' + left + '%)');

          var cropBoxData = croppedImg.cropper('getCropBoxData');
          Object.keys(cropBoxData).forEach(function (key) {
            $currentThumb.data('cropper-' + key, cropBoxData[key]);
          });
          $currentThumb.data('update', true);
        }.bind(this));
      }.bind(this));
    } else {
      croppedImg.cropper('setAspectRatio', aspectRatio);
      if ($currentThumb.data('update')) {
        var cropBoxData = {
          top: $currentThumb.data('cropper-top'),
          left: $currentThumb.data('cropper-left'),
          width: $currentThumb.data('cropper-width'),
          height: $currentThumb.data('cropper-height')
        };
        croppedImg.cropper('setCropBoxData', cropBoxData);
      }
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
