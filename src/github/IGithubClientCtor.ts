export interface IGithubClientCtor {
  new (token: string, baseUrl?: string): IGithubClient;
}
