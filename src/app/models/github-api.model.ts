import { GithubIssue } from "./github-issue.model";

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}
