import { GithubClient } from './GithubClient';

export function createGithubClient(
  token: string,
  baseurl?: string
): GithubClient {
  return new GithubClient(token, baseurl);
}
