import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Logo from '../components/Logo'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'Next-TS-API - Type-Safe API Development for Next.js',
  description: 'Build type-safe APIs in Next.js with automatic type generation and runtime validation. Simple, powerful, and developer friendly.',
  keywords: ['Next.js', 'TypeScript', 'API', 'Type Safety', 'Web Development', 'Frontend', 'Backend'],
  authors: [{ name: 'Next-TS-API Team' }],
  openGraph: {
    title: 'Next-TS-API - Type-Safe API Development for Next.js',
    description: 'Build type-safe APIs in Next.js with automatic type generation and runtime validation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next-TS-API - Type-Safe API Development for Next.js',
    description: 'Build type-safe APIs in Next.js with automatic type generation and runtime validation.',
  },
  robots: {
    index: true,
    follow: true
  }
}

const banner = <Banner storageKey="next-ts-api-release">Next-TS-API 1.0 is released 🎉</Banner>
const navbar = (
  <Navbar
    logo={<Logo />}
  />
)
const footer = <Footer>MIT {new Date().getFullYear()} © Next-TS-API.</Footer>

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="./favicon.ico" />
        <link rel="canonical" href="https://next-ts-api.org" />
        <meta name="theme-color" content="#0070f3" />
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/zahinafsar/next-ts-api/tree/main/apps/docs"
          footer={footer}
          darkMode={true}
          nextThemes={{
            defaultTheme: 'system',
            storageKey: 'theme'
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}