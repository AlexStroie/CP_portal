import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class DisableRouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}
  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false; // <- asta face componenta să se recreeze
  }
}
