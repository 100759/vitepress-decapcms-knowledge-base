import { defineConfig } from 'vitepress'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

type KnowledgeItem = {
  text: string
  link: string
  date?: string
}

const docsRoot = join(process.cwd(), 'docs')
const knowledgeDir = join(docsRoot, 'knowledge', 'articles')

function readFrontmatter(source: string) {
  if (!source.startsWith('---')) return {}

  const end = source.indexOf('\n---', 3)
  if (end === -1) return {}

  const frontmatter = source.slice(3, end).trim()
  const result: Record<string, string> = {}

  for (const line of frontmatter.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (match) {
      result[match[1]] = match[2].replace(/^['"]|['"]$/g, '').trim()
    }
  }

  return result
}

function getKnowledgeSidebar(): KnowledgeItem[] {
  if (!existsSync(knowledgeDir)) return []

  return readdirSync(knowledgeDir)
    .filter((file) => extname(file) === '.md' && file !== 'index.md')
    .map((file) => {
      const fullPath = join(knowledgeDir, file)
      const source = readFileSync(fullPath, 'utf8')
      const frontmatter = readFrontmatter(source)
      const slug = basename(file, '.md')

      return {
        text: frontmatter.title || slug,
        link: `/knowledge/articles/${slug}`,
        date: frontmatter.date,
      }
    })
    .sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date)
      return a.text.localeCompare(b.text, 'zh-CN')
    })
}

export default defineConfig({
  title: '知识库',
  description: 'VitePress + Decap CMS knowledge base',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '知识库', link: '/knowledge/' },
      { text: '管理后台', link: '/admin/' },
    ],
    sidebar: {
      '/knowledge/': [
        {
          text: '知识库',
          items: [
            { text: '目录', link: '/knowledge/' },
            ...getKnowledgeSidebar(),
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/100759/vitepress-decapcms-knowledge-base' },
    ],
    footer: {
      message: 'Powered by VitePress and Decap CMS.',
      copyright: 'Copyright © 2026',
    },
  },
})
