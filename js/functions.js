function normalizeHsv(hsL, type, log) {

  nextLab = Color.hsv2lab(hsL);
  nextHsv = Color.lab2hsv({'l': hsL.v * 100, 'a': nextLab.a, 'b': nextLab.b});

  i = 0;

  // Keep hue and luminance fixed, but don't try more than 100 times
  while (i < 100) {
    nextLab = Color.hsv2lab({'h': hsL.h, 's': nextHsv.s, 'v': Math.min(1, nextHsv.v)});
    nextHsv = Color.lab2hsv({'l': hsL.v * 100, 'a': nextLab.a, 'b': nextLab.b});
    i++;
  }

  if (document.getElementById("prioritizeSat").checked) {
    nextHsv = {'h': nextHsv.h, 's': hsL.s, 'v': nextHsv.v};
  }

  if (document.getElementById("prioritizeSplit").checked) {
    nextHsv = {'h': nextHsv.h, 's': (hsL.s + nextHsv.s) / 2, 'v': nextHsv.v};
  }

  if (type == 'hsb') {
    return nextHsv;
  } else {
    return Color.hsv2hex(nextHsv);
  }
}

function normalizeHue(hue) {
  if (hue > 360) {
    return hue - 360;
  } else if (hue < 0) {
    return hue + 360;
  } else {
    return hue;
  }
}

function printHsv(hsv) {
  return Math.round(hsv.h) + '<br>' + Math.round(hsv.s * 100) + '<br>' + Math.round(hsv.v * 100);
}

function getHexes() {
  baseHue = parseInt(document.getElementById('baseHue').value);
  distribution = parseInt(document.getElementById('distribution').value);
  contrast = Math.min(100, parseInt(document.getElementById('contrast').value));

  bgLuminance = parseInt(document.getElementById('bgLuminance').value) / 100;
  fgLuminance = Math.min(100, (bgLuminance * 100 + contrast)) / 100;

  fgSaturation = parseInt(document.getElementById('fgSaturation').value) / 100;
  bgSaturation = parseInt(document.getElementById('bgSaturation').value) / 100;

  nbDiff = parseInt(document.getElementById('nbDiff').value) / 100;


  // Set our hues

  var hue = [];

  hue[1] = normalizeHue(baseHue - distribution * 2);
  hue[2] = normalizeHue(baseHue - distribution);
  hue[3] = normalizeHue(baseHue);
  hue[4] = normalizeHue(baseHue + distribution);
  hue[5] = normalizeHue(baseHue + distribution * 2);
  hue[6] = normalizeHue(baseHue + distribution * 3);


  // Set our hexes

  var hex = [];
  var hsv = [];

  for (var i = 1; i < 7; i++) {
    hex[i] = normalizeHsv({'h': hue[i], 's': fgSaturation, 'v': fgLuminance});
    hsv[i] = normalizeHsv({'h': hue[i], 's': fgSaturation, 'v': fgLuminance}, 'hsb');
  }

  for (var i = 9; i < 15; i++) {
    hex[i] = normalizeHsv({'h': hue[i - 8], 's': fgSaturation, 'v': fgLuminance + nbDiff});
    hsv[i] = normalizeHsv({'h': hue[i - 8], 's': fgSaturation, 'v': fgLuminance + nbDiff}, 'hsb');
  }


  if (document.getElementById("complement").checked) {
    hex[6] = normalizeHsv({'h': normalizeHue(baseHue + 180), 's': fgSaturation, 'v': fgLuminance});
    hsv[6] = normalizeHsv({'h': normalizeHue(baseHue + 180), 's': fgSaturation, 'v': fgLuminance}, 'hsb');
    hex[14] = normalizeHsv({'h': normalizeHue(baseHue + 180), 's': fgSaturation, 'v': fgLuminance + nbDiff});
    hsv[14] = normalizeHsv({'h': normalizeHue(baseHue + 180), 's': fgSaturation, 'v': fgLuminance + nbDiff}, 'hsb');
  }


  // Grayscale hexes
  hex[0] = normalizeHsv({'h': baseHue, 's': bgSaturation, 'v': bgLuminance});
  hsv[0] = normalizeHsv({'h': baseHue, 's': bgSaturation, 'v': bgLuminance}, 'hsb');

  hex[7] = normalizeHsv({'h': baseHue, 's': bgSaturation / 2, 'v': fgLuminance});
  hsv[7] = normalizeHsv({'h': baseHue, 's': bgSaturation / 2, 'v': fgLuminance}, 'hsb');

  hex[8] = normalizeHsv({'h': baseHue, 's': bgSaturation, 'v': bgLuminance + nbDiff});
  hsv[8] = normalizeHsv({'h': baseHue, 's': bgSaturation, 'v': bgLuminance + nbDiff}, 'hsb');

  hex[15] = normalizeHsv({'h': baseHue, 's': bgSaturation / 2, 'v': fgLuminance + nbDiff});
  hsv[15] = normalizeHsv({'h': baseHue, 's': bgSaturation / 2, 'v': fgLuminance + nbDiff}, 'hsb');


  // Set our custom properties

  for (var i = 0; i < 16; i++) {
    document.documentElement.style.setProperty('--color' + i, hex[i]);
  }


  // Put values in the swatches for copying
  
  if (document.getElementById("showAsHex").checked) {
    for (i = 0; i < 16; i++) {
      document.getElementById("sample" + i).innerHTML = hex[i];
    }
  } else {
    for (i = 0; i < 16; i++) {
      document.getElementById("sample" + i).innerHTML = printHsv(hsv[i]);
    }
  }

  document.documentElement.style.setProperty('--fgColor', hex[7]);
  document.documentElement.style.setProperty('--bgColor', hex[0]);
}
