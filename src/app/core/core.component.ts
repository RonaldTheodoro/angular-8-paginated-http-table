import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, of as observableOf } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { GithubApiService } from '../services/github-api.service';
import { GithubIssue } from '../models/github-issue.model'

@Component({
  selector: "app-core",
  templateUrl: "./core.component.html",
  styleUrls: ["./core.component.css"]
})
export class CoreComponent implements AfterViewInit {
  displayedColumns: string[] = ['created', 'state', 'number', 'title'];
  githubApi: GithubApiService | null;
  data: GithubIssue[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private _http: HttpClient) {}

  ngAfterViewInit() {
    this.githubApi = new GithubApiService(this._http);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.githubApi!.getRepoIssues(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex,
        )
      }),
      map(data => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = data.total_count;

        return data.items;
      }),
      catchError(() => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        return observableOf([]);
      })
    ).subscribe(data => this.data = data);
  }

}
