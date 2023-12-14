// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');

import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
        title: 'refr',
        tagline: 'request animation frame',
        favicon: 'img/favicon.ico',
        url: 'https://refr.tsei.jp',
        baseUrl: '/',
        organizationName: 'tseijp',
        projectName: 'tseijp',
        onBrokenLinks: 'warn',
        onBrokenMarkdownLinks: 'warn',
        i18n: {
                defaultLocale: 'en',
                locales: ['en'],
        },
        presets: [
                [
                        'classic',
                        {
                                docs: {
                                        // sidebarPath: './sidebars.ts',
                                        // Please change this to your repo.
                                        // Remove this to remove the "edit this page" links.
                                        editUrl: 'https://github.com/tseijp/refr/tree/main/examples/docs/',
                                },
                        } satisfies Preset.Options,
                ],
        ],
        themeConfig: {
                image: 'img/social-card.jpg',
                navbar: {
                        title: 'refr',
                        logo: {
                                alt: ' ',
                                src: 'img/logo.png',
                        },
                        items: [
                                {
                                        position: 'left',
                                        to: '/docs',
                                        label: 'Docs',
                                },
                                // { position: 'left', to: '/api', label: 'API' },
                                { position: 'right', type: 'localeDropdown' },
                                {
                                        href: 'https://github.com/tseijp/refr',
                                        label: 'GitHub',
                                        position: 'right',
                                },
                        ],
                },
                footer: {
                        style: 'dark',
                        links: [
                                {
                                        title: 'Docs',
                                        items: [
                                                {
                                                        label: 'Tutorial',
                                                        to: '/docs',
                                                },
                                        ],
                                },
                                {
                                        title: 'Community',
                                        items: [
                                                {
                                                        label: 'Twitter',
                                                        href: 'https://twitter.com/tseijp',
                                                },
                                        ],
                                },
                                {
                                        title: 'More',
                                        items: [
                                                {
                                                        label: 'GitHub',
                                                        href: 'https://github.com/tseijp/tseijp',
                                                },
                                        ],
                                },
                        ],
                        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
                },
                prism: {
                        theme: prismThemes.github,
                        darkTheme: prismThemes.dracula,
                },
        } satisfies Preset.ThemeConfig,
}

export default config
