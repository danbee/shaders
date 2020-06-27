// Author: Daniel Barber
// Title: Mandelbrot

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int max_i = 750;

// x -0.922947648473392 y 0.29140221214586537
// zoom 0.0001120703125

const vec2 centre = vec2(0.0,0.0);
const float radius = 2.0;

const vec2 z_centre = vec2(-0.813118939, 0.203263184);
//const vec2 z_centre = vec2(-0.811709827, 0.202253267);
//const vec2 z_centre = vec2(-0.776592847, 0.136640848);
//const vec2 z_centre = vec2(-0.922947648473392, 0.29140221214586537);
//const vec2 z_centre = vec2(-2.0,-2.0);
const float z_radius = 0.00025;
//const float z_radius = 0.2;

float doubleExponentialSigmoid (float x, float a) {
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = min(max_param_a, max(min_param_a, a));
  a = 1.0-a; // for sensible results
  
  float y = 0.0;
  if (x<=0.5){
    y = (pow(2.0*x, 1.0/a))/2.0;
  } else {
    y = 1.0 - (pow(2.0*(1.0-x), 1.0/a))/2.0;
  }
  return y;
}

vec3 hsb2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
    float exp_step = 1.0-exp(
        exp(sin(u_time / 10.0))
    ) / 14.0 + 0.1032;
    
    float step = doubleExponentialSigmoid(exp_step, 0.4);
    vec2 i_centre = centre - ((centre - z_centre) * step);
    float i_radius = radius - ((radius - z_radius) * step);
    
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float ratio = u_resolution.x / u_resolution.y;
    st.x *= ratio;
    
    vec2 mandel = (st - vec2(0.5 * ratio, 0.5)) * (i_radius * 2.0) + i_centre;
    
    int i;
    float x;
    float y;
    
    float result;
    vec4 colour;
    
    for(int n = 1; n < max_i; n++) {
        float xtemp = x*x-y*y+mandel.x;
        y = 2.0*x*y+mandel.y;
        x = xtemp;
        
        if (x*x+y*y >= 2.0*2.0) {
        	result = float(n) / 100.0;
          	break;  
        };
    };
    
    if (result == 0.0) {
        colour = vec4(0.0,0.0,0.0,1.0);
    } else {
        colour = vec4(hsb2rgb(vec3(result + (u_time / 100.0),1.0,1.0)),1.0);
    }

    gl_FragColor = colour;
}
