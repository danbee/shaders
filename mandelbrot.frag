// Author: Daniel Barber
// Title: Mandelbrot

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int max_i = 500;

void main() {
    vec2 st = (gl_FragCoord.xy/u_resolution.xy)*(sin(u_time)+3.000)-(sin(u_time)/2.0+1.5);
    st.x *= u_resolution.x/u_resolution.y;
    
    int i;
    float x;
    float y;
    
    float result;
    
    for(int n = 0; n < max_i; n++) {
        float xtemp = x*x-y*y+st.x;
        y = 2.0*x*y+st.y;
        x = xtemp;
        
        if (x*x+y*y >= 2.0*2.0) {
        	result = float(n) / 100.0;
          	break;  
        };
    };

    gl_FragColor = vec4(log(result),pow(result, 0.5),0.2,1.0);
}
