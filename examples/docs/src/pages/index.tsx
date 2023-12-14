import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { useDrag, useWheel } from 'rege/react'
import { gsap } from 'gsap'
import { useColorMode, useWindowSize } from '@docusaurus/theme-common'
import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
// import { createGL } from '../../../../packages/glre/packages/core'
// import { useGL } from '../../../../packages/glre/packages/core/react'
import { useGL } from 'glre/react'

const frag = /* ts */ `
precision highp float;

/**
 * utils from lygia
 */
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(in vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
}

float fbm(in vec3 pos) {
        float value = 0.0;
        float amplitud = 0.5;
        for (int i = 0; i < 3; i++) {
                value += amplitud * snoise(pos);
                pos *= 2.0;
                amplitud *= 0.5;
        }
        return value;
}

mat2 rot(float a) {
        float c = cos(a);
        float s = sin(a);
        mat2 m = mat2(c, -s, s, c);
        return m;
}

#define opTwist(SDF, pos, k) (SDF(vec3(rot(pos.y * exp(abs(k))) * pos.xz, pos.y)) )

uniform vec2 iResolution;
uniform float iTime;

float U_sphere_impl(vec3 pos) {
        float k = 20.0;
        float t = sin(iTime / 10.0) * 10.0;
        float sphereSize = 1.;
        return length(pos)
                - sphereSize
                - fbm(pos * 5.0 + t * 1.2)
                * cos(pos.x * k)
                * sin(pos.y * k + t * 5.0)
                * cos(pos.x * k)
                * sin(pos.z * k)
                * mix(0.05, 0.17, pow(pos.y, 2.0));
}


float U_sphere(vec3 pos) {
        float r = length(pos) - 1.0;
        if (r > 0.01) return r;
        return opTwist(U_sphere_impl, pos, pos.y);
}

uniform mat4 Matrix;

float map(vec3 pos) {
        pos = (Matrix * vec4(pos, 1.0)).xyz;
        return U_sphere(pos);
}

vec3 normal(vec3 pos, float d) {
        vec3 e = vec3(0.00001, 0.0, 0.0);
        return normalize(vec3(
                map(pos + e.xyz) - d,
                map(pos + e.zxy) - d,
                map(pos + e.yzx) - d
        ));
}

vec3 star(vec3 p, vec3 n) {
        vec3 dir = normalize(vec3(p + n));
        vec3 v = vec3(0.0);
        for (int r = 0; r < 10; r++) {
                p = vec3(1.0) + dir;
                float a = 0.0;
                for (int i = 0; i < 13; i++) {
                        p = abs(p) / dot(p, p) - 0.5;
                        a += length(p);
                }
                v += a * a * a * a;
        }
        return v * 0.00000001;
}

vec3 material(vec3 pos, vec3 nor) {
        vec3 light = vec3(.5);
        vec3 col = star(pos, nor);
        col *= dot(nor, light) * 10.0;
        col *= exp(length(col) * 10.0);
        return col;
}

void main() {
        vec3 e = vec3(0.00001, 0.0, 0.0);
        float x = gl_FragCoord.x - 0.5 * iResolution.x;
        float y = gl_FragCoord.y - 0.5 * iResolution.y;
        float z = max(iResolution.x, iResolution.y);
        vec3 eye = vec3(0.0, 0.0, 2.0);
        vec3 dir = vec3(x, y, -z);
        dir = normalize(dir);
        vec3 p = eye + dir;
        float d = map(p);

        for (int i = 0; i < 100; i++) {
                if (d < e.x) {
                        vec3 nor = normal(p, d);
                        vec3 col = material(p, nor);
                        gl_FragColor = vec4(col, 1.0);
                        return;
                }
                p += dir * d;
                if (p.z < 0.0) break;
                d = map(p);
        }
        gl_FragColor = vec4(vec3(0.05), 1.0);
}
`

const { cos, sin } = Math

export const mat4 = (
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = [1, 1, 1],
        ret = []
) => {
        const [px, py, pz] = position.map((p) => -p)
        const [ax, ay, az] = rotation.map(cos)
        const [bx, by, bz] = rotation.map(sin)
        const [sx, sy, sz] = scale.map((s) => 1 / s)
        ret[0] = sx * az * ay
        ret[1] = sx * (az * by * bx - bz * ax)
        ret[2] = sx * (az * by * ax + bz * bx)
        ret[3] = 0
        ret[4] = sy * bz * ay
        ret[5] = sy * (bz * by * bx + az * ax)
        ret[6] = sy * (bz * by * ax - az * bx)
        ret[7] = 0
        ret[8] = sz * -by
        ret[9] = sz * ay * bx
        ret[10] = sz * ay * ax
        ret[11] = 0
        ret[12] = px
        ret[13] = py
        ret[14] = pz
        ret[15] = 1
        return ret
}

const Canvas = () => {
        // const gl = useMemo(() => createGL(), [])

        const drag = useDrag(({ delta: [, dy], isDragging }) => {
                if (!isDragging) return
                rotation[0] += dy / 1000
        })

        const scroll = useWheel(({ delta: [, dy] }) => {
                rotation[0] -= dy / 1000
        })

        if (!drag.memo.position) {
                const position = [0, 0, 0]
                const rotation = [0, 0, 0]
                const scale = [1.15, 1.15, 1.15]
                const mat = mat4(position, rotation, scale)
                drag.memo = { position, rotation, scale, mat }
        }

        const { position, rotation, scale, mat } = drag.memo

        const render = () => {
                rotation[0] += 0.002
                mat4(position, rotation, scale, mat)
                // @ts-ignore @TODO FIX glre
                gl.uniform('Matrix', mat, true)
                gl.clear()
                gl.viewport()
                gl.drawArrays()
                return true
        }

        const ref = (el: Element) => {
                drag.ref(el)
                scroll.ref(el)
        }

        const gl = useGL({ render, frag, ref })
        // useGL({ render, frag, ref }, gl)

        return (
                <canvas
                        ref={gl.ref}
                        style={{
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                position: 'fixed',
                                background: '#212121',
                        }}
                />
        )
}

const styled = (colorMode: 'dark' | 'light', windowSize?: string) => {
        const el = document.querySelector('.navbar') as HTMLDivElement
        const isDark = colorMode === 'dark'
        const isMobile = windowSize === 'mobile'
        Object.assign(el.style, {
                boxShadow: 'rgba(226, 226, 226, 0.1) 2px 8px 32px',
                backdropFilter: isMobile ? '' : 'blur(6px)',
                backgroundColor: isDark
                        ? 'rgba(46,46,46, 0.1)'
                        : 'rgba(226, 226,226, 0.5)',
        })
}

const moved = (windowSize?: string) => {
        if (windowSize === 'mobile') return

        let timeoutId: any
        const el = document.querySelector('.navbar') as HTMLDivElement
        const up = () => gsap.to(el, { y: '-100%', duration: 0.5 })
        const down = () => gsap.to(el, { y: 0, duration: 0.1 })
        const move = () => {
                down()
                clearTimeout(timeoutId)
                timeoutId = setTimeout(up, 1000)
        }

        window.addEventListener('mousemove', move)

        return () => {
                window.removeEventListener('mousemove', move)
        }
}

const Effects = () => {
        const { colorMode } = useColorMode()
        const windowSize = useWindowSize()
        useEffect(() => moved(windowSize), [windowSize])
        useLayoutEffect(
                () => styled(colorMode, windowSize),
                [colorMode, windowSize]
        )
        return null
}

const Home = () => {
        const { siteConfig } = useDocusaurusContext()
        return (
                <Layout noFooter>
                        <Head>
                                <title>
                                        {siteConfig.title}{' '}
                                        {siteConfig.titleDelimiter}{' '}
                                        {siteConfig.tagline}
                                </title>
                                <style>
                                        @import
                                        url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                                </style>
                        </Head>
                        <Canvas />
                        <Effects />
                </Layout>
        )
}
export default Home
