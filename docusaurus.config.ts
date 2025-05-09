import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "angrykoala",
    tagline: "Koalas are angry",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://angrykoala.xyz",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "angrykoala", // Usually your GitHub org/user name.
    projectName: "angrykoala.github.io", // Usually your repo name.
    deploymentBranch: "gh-pages",

    trailingSlash: false,
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    scripts: [
        {
            // <script defer src="https://cloud.umami.is/script.js" data-website-id="46b9bebb-7931-4cb6-b7cd-b210264c00c4"></script>
            src: "https://cloud.umami.is/script.js",
            async: true,
            "data-website-id": "46b9bebb-7931-4cb6-b7cd-b210264c00c4",
            "data-domains": "angrykoala.xyz",
        },
    ],
    presets: [
        [
            "classic",
            {
                docs: {
                    path: "projects",
                    routeBasePath: "projects",
                    sidebarPath: "./sidebars.ts",
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ["rss", "atom"],
                        xslt: true,
                    },
                    onInlineTags: "warn",
                    onInlineAuthors: "warn",
                    onUntruncatedBlogPosts: "warn",
                },
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],
    markdown: {
        mermaid: true,
    },
    themes: ["@docusaurus/theme-mermaid"],
    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "Angrykoala",
            logo: {
                alt: "Angrykoala Logo",
                src: "img/octokoala.png",
            },
            items: [
                // {
                //     type: "docSidebar",
                //     sidebarId: "tutorialSidebar",
                //     position: "left",
                //     label: "Tutorial",
                // },
                { type: "docSidebar", sidebarId: "projectsSidebar", label: "Projects", position: "left" },
                { to: "/blog", label: "Blog", position: "left" },
                {
                    href: "https://github.com/angrykoala",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "More",
                    items: [
                        {
                            label: "Stack Overflow",
                            href: "https://stackoverflow.com/users/3065924/angrykoala",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/angrykoala",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} angrykoala. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
