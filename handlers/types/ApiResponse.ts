export type ApiResponse = {
  total: number
  results: {
    package: {
      name: string
      version: string
      description: string
      links: {
        npm: string
        homepage: string
        repository: string
        bugs: string
      }
      author: {
        name: string
        email: string
        url: string
        username: string
      }
    }
    searchScore: number
    flags?: {
      deprecated?: string
    }
  }[]
};
