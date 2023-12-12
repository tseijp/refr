import React, { useMemo } from 'react'
import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { createGL } from 'glre'
import { useGL } from 'glre/react'

export default function Home() {
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
                </Layout>
        )
}

function Canvas() {
        const gl = useMemo(createGL, [])

        useGL(
                {
                        render() {
                                gl.clear()
                                gl.viewport()
                                gl.drawArrays()
                        },
                },
                gl
        )

        return (
                <canvas
                        ref={gl.ref}
                        style={{
                                top: 0,
                                left: 0,
                                position: 'fixed',
                                background: '#212121',
                        }}
                />
        )
}
