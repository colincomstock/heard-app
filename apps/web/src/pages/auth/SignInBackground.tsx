import { useEffect, useRef } from 'react';
import styles from './SignIn.module.css';

const vertexSource = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentSource = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
    #else
        precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 cell = floor(p);
        vec2 f = fract(p);
        vec2 blend = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
            mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), blend.x),
            blend.y
        );
    }

    float cloud(vec2 p) {
        float value = 0.0;
        float weight = 0.5;
        mat2 rotation = mat2(0.8, -0.6, 0.6, 0.8);

        for (int i = 0; i < 4; i++) {
            value += weight * noise(p);
            p = rotation * p * 2.02 + vec2(7.3, 4.8);
            weight *= 0.5;
        }

        return value;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = vec2((uv.x - 0.5) * u_resolution.x / u_resolution.y, uv.y);
        float time = u_time * 0.055;

        // Domain warping bends layered noise into the reference's slow, fluid folds.
        vec2 flow = vec2(
            cloud(p * 2.1 + vec2(time, -time * 0.7)),
            cloud(p * 2.1 + vec2(4.7 - time * 0.6, 8.3 + time))
        );
        float folds = cloud(p * 3.0 + flow * 2.8 + vec2(0.0, time * 0.35));
        float height = uv.y + (folds - 0.5) * 0.65;

        vec3 deep = vec3(0.015, 0.12, 0.16);
        vec3 blue = vec3(0.10, 0.39, 0.53);
        vec3 cyan = vec3(0.26, 0.71, 0.76);
        vec3 mist = vec3(0.80, 0.91, 0.90);

        vec3 color = mix(deep, blue, smoothstep(0.0, 0.48, height));
        color = mix(color, cyan, smoothstep(0.30, 0.78, height));
        color = mix(color, mist, smoothstep(0.73, 1.14, height));
        color *= 0.7 + folds * 0.55;

        // Static screen-space grain avoids distracting flicker behind the inputs.
        float grain = hash(gl_FragCoord.xy) - 0.5;
        color += grain * 0.035;
        gl_FragColor = vec4(color, 1.0);
    }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export default function SignInBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Leave the CSS background in place when motion is reduced or WebGL is unavailable.
        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let releaseRenderer = () => {};

        function initialize() {
            releaseRenderer();
            canvas!.style.opacity = '0';
            if (motionPreference.matches) return;

            const gl = canvas!.getContext('webgl', {
                alpha: false,
                antialias: false,
                depth: false,
                stencil: false,
                powerPreference: 'low-power',
            });
            if (!gl) return;

            const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
            const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
            const program = gl.createProgram();

            if (!vertex || !fragment || !program) {
                if (vertex) gl.deleteShader(vertex);
                if (fragment) gl.deleteShader(fragment);
                if (program) gl.deleteProgram(program);
                return;
            }

            gl.attachShader(program, vertex);
            gl.attachShader(program, fragment);
            gl.linkProgram(program);
            gl.deleteShader(vertex);
            gl.deleteShader(fragment);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.deleteProgram(program);
                return;
            }

            const buffer = gl.createBuffer();
            if (!buffer) {
                gl.deleteProgram(program);
                return;
            }

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

            const position = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

            const resolution = gl.getUniformLocation(program, 'u_resolution');
            const time = gl.getUniformLocation(program, 'u_time');
            let frame = 0;
            let previousTime = 0;
            let elapsed = 0;
            let lastDraw = 0;

            function draw() {
                gl!.uniform1f(time, elapsed / 1000);
                gl!.drawArrays(gl!.TRIANGLES, 0, 3);
                canvas!.style.opacity = '1';
            }

            function resize() {
                const { width, height } = canvas!.getBoundingClientRect();
                // Cap pixel count instead of rendering at expensive high-DPI phone resolutions.
                const scale = Math.min(window.devicePixelRatio || 1, 1, Math.sqrt(900_000 / Math.max(width * height, 1)));
                canvas!.width = Math.max(1, Math.round(width * scale));
                canvas!.height = Math.max(1, Math.round(height * scale));
                gl!.viewport(0, 0, canvas!.width, canvas!.height);
                gl!.uniform2f(resolution, canvas!.width, canvas!.height);
                draw();
            }

            function animate(now: number) {
                if (previousTime) elapsed += Math.min(now - previousTime, 100);
                previousTime = now;

                if (now - lastDraw >= 1000 / 30) {
                    draw();
                    lastDraw = now;
                }

                frame = requestAnimationFrame(animate);
            }

            function updateVisibility() {
                cancelAnimationFrame(frame);
                previousTime = 0;
                if (!document.hidden) frame = requestAnimationFrame(animate);
            }

            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(canvas!);
            document.addEventListener('visibilitychange', updateVisibility);
            resize();
            updateVisibility();

            releaseRenderer = () => {
                cancelAnimationFrame(frame);
                resizeObserver.disconnect();
                document.removeEventListener('visibilitychange', updateVisibility);
                gl.deleteBuffer(buffer);
                gl.deleteProgram(program);
                canvas!.style.opacity = '0';
            };
        }

        function handleContextLost(event: Event) {
            event.preventDefault();
            releaseRenderer();
        }

        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', initialize);
        motionPreference.addEventListener('change', initialize);
        initialize();

        return () => {
            releaseRenderer();
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', initialize);
            motionPreference.removeEventListener('change', initialize);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.shaderCanvas} aria-hidden="true" />;
}
