export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://ui-avatars.com/api/?name=Filip+Prelac&size=256&background=1f2937&color=ffffff',
      light: 'https://ui-avatars.com/api/?name=Filip+Prelac&size=256&background=e5e7eb&color=111827',
      alt: 'Filip Prelac'
    },
    meetingLink: 'https://www.linkedin.com/in/prelacfilip',
    email: 'prelacfilip@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `© ${new Date().getFullYear()} Filip Prelac`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Prelac-Filip',
      'target': '_blank',
      'aria-label': 'Filip Prelac on GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/prelacfilip',
      'target': '_blank',
      'aria-label': 'Filip Prelac on LinkedIn'
    }]
  }
})
