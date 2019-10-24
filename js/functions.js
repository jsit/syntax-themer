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


  // Set our hues

  bgHue = normalizeHue(baseHue);
  fgHue = normalizeHue(baseHue);

  var hue = [];

  hue[0] = normalizeHue(baseHue - distribution * 2);
  hue[1] = normalizeHue(baseHue - distribution);
  hue[2] = normalizeHue(baseHue);
  hue[3] = normalizeHue(baseHue + distribution);
  hue[4] = normalizeHue(baseHue + distribution * 2);
  hue[5] = normalizeHue(baseHue + distribution * 3);


  // Set our hexes

  bgHex = normalizeHsv({'h': bgHue, 's': bgSaturation, 'v': bgLuminance});
  fgHex = normalizeHsv({'h': bgHue, 's': bgSaturation / 2, 'v': fgLuminance});

  var hex = [];
  for (var i = 0; i < 6; i++) {
    hex[i] = normalizeHsv({'h': hue[i], 's': fgSaturation, 'v': fgLuminance});
  }

  var hsv = [];
  for (var i = 0; i < 6; i++) {
    hsv[i] = normalizeHsv({'h': hue[i], 's': fgSaturation, 'v': fgLuminance}, 'hsb');
  }


  // Set our custom properties

  for (var i = 0; i < 6; i++) {
    document.documentElement.style.setProperty('--color' + (i + 1), hex[i]);
  }


  // Put values in the swatches for copying
  
  if (document.getElementById("showAsHex").checked) {
    for (i = 0; i < 6; i++) {
      document.getElementById("sample" + (i + 1)).innerHTML = hex[i];
    }
  } else {
    for (i = 0; i < 6; i++) {
      document.getElementById("sample" + (i + 1)).innerHTML = printHsv(hsv[i]);
    }
  }

  document.documentElement.style.setProperty('--fgColor', fgHex);
  document.documentElement.style.setProperty('--bgColor', bgHex);
}
