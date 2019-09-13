import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd, PRIMARY_OUTLET, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from "rxjs/operators";

export interface IBreadcrumb {
  label: string;
  url: string;
  params: Params;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy  {
  breadcrumbs: IBreadcrumb[];

  private subcription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.subcription =
      this.router.events.pipe(filter((event: Event) => event instanceof NavigationEnd)).
        subscribe((event: Event) => this.breadcrumbs = this.getBreadcrumbs(this.route.root));
  }

  ngOnDestroy() {
    if (this.subcription)
      this.subcription.unsubscribe();
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: IBreadcrumb[]  = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = "breadcrumb";

    let children: ActivatedRoute[] = route.children;
    if (children.length === 0)
      return breadcrumbs;

    let child: ActivatedRoute;
    for (child of children) {
      //Only tracking the Activated Route of primary outlet
      if (child.outlet === PRIMARY_OUTLET)
        break;
    }

    //Skip the Activated Route if no breadcrumb set.
    if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB))
      return this.getBreadcrumbs(child, url, breadcrumbs);

    let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
    if (routeURL === '') {
      //Skip the Activated Route if it doesn't contain new url segment.
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    url += `/${routeURL}`;
    breadcrumbs.push({
      label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
      url: url,
      params: child.snapshot.params,
    });

    return this.getBreadcrumbs(child, url, breadcrumbs);
  }
}
