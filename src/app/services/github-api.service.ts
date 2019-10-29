import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { GithubApi } from "../models/github-api.model";

@Injectable({
  providedIn: "root"
})
export class GithubApiService {
  private _baseUrl = "https://api.github.com/search/issues";

  constructor(private _http: HttpClient) {}

  getRepoIssues(
    sort: string,
    order: string,
    page: number
  ): Observable<GithubApi> {
    const url = `${this._baseUrl}?q=repo:angular/components`;
    const queryParams = `&sort=${sort}&order=${order}&page=${page + 1}`;
    return this._http.get<GithubApi>(`${url}${queryParams}`);
  }
}
