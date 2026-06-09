declare module '@stackblitz/sdk' {
  interface ProjectFiles {
    [filename: string]: string
  }

  interface Project {
    title: string
    description?: string
    template: 'node' | 'javascript' | 'typescript' | 'angular-cli' | 'create-react-app' | 'html'
    files: ProjectFiles
    dependencies?: Record<string, string>
    settings?: {
      compile?: { trigger?: 'auto' | 'keystroke' | 'save'; clearConsole?: boolean }
    }
  }

  interface OpenOptions {
    newWindow?: boolean
    openFile?: string | string[]
    origin?: string
    showSidebar?: boolean
    view?: 'preview' | 'editor' | 'default'
    height?: number | string
    width?: number | string
    clickToLoad?: boolean
    hideDevTools?: boolean
    devToolsHeight?: number
    forceEmbedLayout?: boolean
    hideExplorer?: boolean
  }

  interface EmbedOptions extends OpenOptions {
    elementOrId: string | HTMLElement
  }

  const sdk: {
    openProject(project: Project, options?: OpenOptions): void
    embedProject(elementOrId: string | HTMLElement, project: Project, options?: OpenOptions): Promise<unknown>
    openGithubProject(repo: string, options?: OpenOptions): void
  }

  export default sdk
}
