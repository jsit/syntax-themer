// Conversion formulas based on http://www.easyrgb.com/index.php?X=MATH, copyright 2012 IRO Group Limited
// Distance formula based on "CMC l:c" from http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html

// http://www.easyrgb.com/index.php?X=MATH&H=15#text15
Color = {
	"A"  :{"2":[109.85,100.0,35.585], "10":[111.144,100.0,35.2]},
	"C"  :{"2":[98.074,100.0,118.232],"10":[97.285,100.0,116.145]},
	"D50":{"2":[96.422,100.0,82.521], "10":[96.72,100.0,81.427]},
	"D55":{"2":[95.682,100.0,92.149], "10":[95.799,100.0,90.926]},
	"D65":{"2":[95.047,100.0,108.883],"10":[94.811,100.0,107.304]},
	"D75":{"2":[94.972,100.0,122.638],"10":[94.416,100.0,120.641]},
	"F2" :{"2":[99.187,100.0,67.395], "10":[103.28,100.0,69.026]},
	"F7" :{"2":[95.044,100.0,108.755],"10":[95.792,100.0,107.687]},
	"F11":{"2":[100.966,100.0,64.37], "10":[103.866,100.0,65.627]}
};

// Aliases
Color.Incandescent = Color.A;
Color.Daylight     = Color.D65;
Color.Fluorescent  = Color.F2;

// Set the Lab conversion
Color.REF = Color.Daylight[2];

// ************************************************************

Color.hex2rgb = function hex2rgb(hex){
	hex = hex.replace(/^#/,'').replace(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i,'$1$1$2$2$3$3');
	if (hex.length!=6) return;
	return {
		r:parseInt(hex.substr(0,2),16),
		g:parseInt(hex.substr(2,2),16),
		b:parseInt(hex.substr(4,2),16)
	};
}

Color.rgb2hex = function rgb2hex(rgb){
	var r = Math.round(rgb.r).toString(16),
	    g = Math.round(rgb.g).toString(16),
	    b = Math.round(rgb.b).toString(16);
	return '#'+(r.length==1?('0'+r):r)+(g.length==1?('0'+g):g)+(b.length==1?('0'+b):b);
}

// ************************************************************

Color.rgb2hsv = function rgb2hsv(rgb){
	var r = rgb.r / 255,
	    g = rgb.g / 255,
	    b = rgb.b / 255;
	var h,s,v,max,min,d;

	max=min=r;
	if (g>max) max=g; if (g<min) min=g;
	if (b>max) max=b; if (b<min) min=b;
	d=max-min;
	v=max;
	s=(max>0)?d/max:0;

	if (s==0) h=0;
	else {
		h=60*((r==max)?(g-b)/d:((g==max)?2+(b-r)/d:4+(r-g)/d));
		if (h<0) h+=360;
	}
	return {h:h,s:s,v:v};
}

Color.hsv2rgb = function hsv2rgb(hsv){
	var h = hsv.h,
	    s = hsv.s,
	    v = hsv.v;
	var r,g,b,i,f,p,q,t;
	while (h<0) h+=360;
	h%=360;
	s=s>1?1:s<0?0:s;
	v=v>1?1:v<0?0:v;

	if (s==0) r=g=b=v;
	else {
		h/=60;
		f=h-(i=Math.floor(h));
		p=v*(1-s);
		q=v*(1-s*f);
		t=v*(1-s*(1-f));
		switch (i) {
			case 0:r=v; g=t; b=p; break;
			case 1:r=q; g=v; b=p; break;
			case 2:r=p; g=v; b=t; break;
			case 3:r=p; g=q; b=v; break;
			case 4:r=t; g=p; b=v; break;
			case 5:r=v; g=p; b=q; break;
		}
	}
	return {r:r*255,g:g*255,b:b*255};
}

// ************************************************************

Color.rgb2xyz = function rgb2xyz(rgb){
	var r = rgb.r / 255,
	    g = rgb.g / 255,
	    b = rgb.b / 255

	r = 100 * ( (r>0.04045) ? Math.pow( (r+0.055)/1.055, 2.4 ) : r/12.92 );
	g = 100 * ( (g>0.04045) ? Math.pow( (g+0.055)/1.055, 2.4 ) : g/12.92 );
	b = 100 * ( (b>0.04045) ? Math.pow( (b+0.055)/1.055, 2.4 ) : b/12.92 );

	return {
		x : r * 0.4124 + g * 0.3576 + b * 0.1805,
		y : r * 0.2126 + g * 0.7152 + b * 0.0722,
		z : r * 0.0193 + g * 0.1192 + b * 0.9505,
	};
};

Color.xyz2rgb = function xyz2rgb(xyz){
	var x = xyz.x / 100,        //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
	    y = xyz.y / 100,        //Y from 0 to 100.000
	    z = xyz.z / 100;        //Z from 0 to 108.883

	var r = x *  3.2406 + y * -1.5372 + z * -0.4986;
	var g = x * -0.9689 + y *  1.8758 + z *  0.0415;
	var b = x *  0.0557 + y * -0.2040 + z *  1.0570;

	return {
		r : 255 * (r>0.0031308 ? (1.055*Math.pow(r,1/2.4)-0.055) : 12.92*r),
		g : 255 * (g>0.0031308 ? (1.055*Math.pow(g,1/2.4)-0.055) : 12.92*g),
		b : 255 * (b>0.0031308 ? (1.055*Math.pow(b,1/2.4)-0.055) : 12.92*b)
	};
};

// ************************************************************

Color.xyz2lab = function xyz2lab(xyz){
	var x = xyz.x / Color.REF[0],
	    y = xyz.y / Color.REF[1],
	    z = xyz.z / Color.REF[2];

	x = (x>0.008856) ? Math.pow(x,1/3) : 7.787*x + 16/116 ;
	y = (y>0.008856) ? Math.pow(y,1/3) : 7.787*y + 16/116 ;
	z = (z>0.008856) ? Math.pow(z,1/3) : 7.787*z + 16/116 ;

	return {
		l : 116*y - 16,
		a : 500*(x - y),
		b : 200*(y - z)
	};
};

Color.lab2xyz = function lab2xyz(lab){
	var y = (lab.l + 16) / 116,
	    x = lab.a / 500 + y,
	    z = y - lab.b / 200;

	y = Math.pow(y,3)>0.008856 ? Math.pow(y,3) : (y-16/116)/7.787;
	x = Math.pow(x,3)>0.008856 ? Math.pow(x,3) : (x-16/116)/7.787;
	z = Math.pow(z,3)>0.008856 ? Math.pow(z,3) : (z-16/116)/7.787;

	return {
		x : Color.REF[0] * x,
		y : Color.REF[1] * y,
		z : Color.REF[2] * z
	};
};

// ************************************************************

Color.lab2lch = function lab2lch(lab){
	var h = Math.atan2( lab.b, lab.a )
	h = (h>0) ? (h/Math.PI * 180) : 360 - (Math.abs(h)/Math.PI) & 180;
	return {
		l : lab.l,
		c : Math.sqrt( lab.a*lab.a + lab.b*lab.b ),
		h : h
	};
};

Color.lch2lab = function lch2lab(lch){
	var h = Math.PI * lch.h / 180;
	return {
		l : lch.l,
		a : Math.cos(h)*lch.c,
		b : Math.sin(h)*lch.c
	};
};

// ************************************************************
// ************************************************************
// ************************************************************

Color.hexDistance = function hexDistance( hex1, hex2, lightness, chroma ){
	return Color.labDistance( Color.hex2lab(hex1), Color.hex2lab(hex2), lightness, chroma );
}

Color.rgbDistance = function rgbDistance( rgb1, rgb2, lightness, chroma ){
	return Color.labDistance( Color.rgb2lab(rgb1), Color.rgb2lab(rgb2), lightness, chroma );
}

// http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
Color.labDistance = function labDistance( lab1, lab2, lightness, chroma ){
	if (!lightness) lightness = 2;
	if (!chroma)    chroma    = 1;
	var deltaL = lab1.l-lab2.l,
	    deltaA = lab1.a-lab2.a,
	    deltaB = lab1.b-lab2.b;
	var C1 = Math.sqrt(lab1.a*lab1.a + lab1.b*lab1.b),
	    C2 = Math.sqrt(lab2.a*lab2.a + lab2.b*lab2.b);
	var deltaC = C1-C2;
	var deltaH = Math.sqrt( deltaA*deltaA + deltaB*deltaB - deltaC*deltaC );

	var H1 = (180*Math.atan2(lab1.b,lab1.a)/Math.PI + 360) % 360;

	var C1_4 = C1*C1*C1*C1;
	var F = Math.sqrt( C1_4/(C1_4 + 1900) );
	var T = (H1>345 || H1<164) ? (0.36 + Math.abs(0.4*Math.cos(Math.PI*(H1+35)/180))) : (0.56 + Math.abs(0.2*Math.cos(Math.PI*(H1+168)/180)));
	var SL = lab1.l<16 ? 0.511 : (0.040975 * lab1.l) / (1 + 0.01765*lab1.l),
	    SC = (0.0638*C1) / (1 + 0.0131*C1) + 0.638,
	    SH = SC*(F*T + 1 - F);
	return Math.sqrt( Math.pow(deltaL/(lightness*SL),2) + Math.pow(deltaC/(chroma*SC),2) + Math.pow(deltaH/SH,2) );
};

Color.lchDistance = function lchDistance( lch1, lch2, lightness, chroma ){
	return Color.labDistance( Color.lch2lab(lch1), Color.lch2lab(lch2), lightness, chroma );
}

// ************************************************************
// hex <-> rgb <-> xyz <-> lab <-> lch
//          |
//         hsv
// ************************************************************

Color.hex2xyz = function hex2xyz(hex){ return Color.rgb2xyz(Color.hex2rgb(hex)); }
Color.xyz2hex = function xyz2hex(xyz){ return Color.rgb2hex(Color.xyz2rgb(xyz)); }

Color.rgb2lab = function rgb2lab(rgb){ return Color.xyz2lab(Color.rgb2xyz(rgb)); }
Color.lab2rgb = function lab2rgb(lab){ return Color.xyz2rgb(Color.lab2xyz(lab)); }

Color.xyz2lch = function xyz2lch(xyz){ return Color.xyz2lch(Color.xyz2xyz(xyz)); }
Color.lch2xyz = function lch2xyz(lch){ return Color.xyz2xyz(Color.lch2xyz(lch)); }

Color.hex2lab = function hex2lab(hex){ return Color.rgb2lab(Color.hex2rgb(hex)); }
Color.lab2hex = function lab2hex(lab){ return Color.rgb2hex(Color.lab2rgb(lab)); }

Color.rgb2lch = function rgb2lch(rgb){ return Color.lab2lch(Color.rgb2lab(rgb)); }
Color.lch2rgb = function lch2rgb(lch){ return Color.lab2rgb(Color.lch2lab(lch)); }

Color.hex2lch = function hex2lch(hex){ return Color.rgb2lch(Color.hex2rgb(hex)); }
Color.lch2hex = function lch2hex(lch){ return Color.rgb2hex(Color.lch2rgb(lch)); }

Color.hsv2hex = function hsv2hex(hsv){ return Color.rgb2hex(Color.hsv2rgb(hsv)); }
Color.hex2hsv = function hex2hsv(hex){ return Color.rgb2hsv(Color.hex2rgb(hex)); }

Color.hsv2xyz = function hsv2xyz(hsv){ return Color.rgb2xyz(Color.hsv2rgb(hsv)); }
Color.xyz2hsv = function xyz2hsv(xyz){ return Color.rgb2hsv(Color.xyz2rgb(xyz)); }

Color.hsv2lab = function hsv2lab(hsv){ return Color.rgb2lab(Color.hsv2rgb(hsv)); }
Color.lab2hsv = function lab2hsv(lab){ return Color.rgb2hsv(Color.lab2rgb(lab)); }

Color.hsv2lch = function hsv2lch(hsv){ return Color.rgb2lch(Color.hsv2rgb(hsv)); }
Color.lch2hsv = function lch2hsv(lch){ return Color.rgb2hsv(Color.lch2rgb(lch)); }

// ************************************************************

Color.css = function toString(c){
	if (typeof c == 'string') return c;
	else if (c.hasOwnProperty('r')) return "rgb("+c.r.toFixed(0)+","+c.g.toFixed(0)+","+c.b.toFixed(0)+")";
	else if (c.hasOwnProperty('x')) return "xyz("+c.x.toFixed(3)+","+c.y.toFixed(3)+","+c.z.toFixed(3)+")";
	else if (c.hasOwnProperty('a')) return "Lab("+c.l.toFixed(3)+","+c.a.toFixed(3)+","+c.b.toFixed(3)+")";
	else if (c.hasOwnProperty('c')) return "LCH("+c.l.toFixed(3)+","+c.c.toFixed(3)+","+c.h.toFixed(3)+")";
	else if (c.hasOwnProperty('s')) return "hsv("+c.h.toFixed(0)+"°,"+(c.s*100).toFixed(0)+"%,"+(c.v*100).toFixed(0)+"%)";
};
