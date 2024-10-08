import { bootstrapApplication } from "@angular/platform-browser";
import { Component, HostListener, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  
  standalone: true,
  selector: "app-root",
  template: `<div>ng-app</div>`,
})
class AppComponent {
  constructor(private sanitizer: DomSanitizer) {}

  sanitize(context: SecurityContext, html: string) {
    try {
      return { result: this.sanitizer.sanitize(context, html) };
    } catch (e) {
      console.error(e);
      return { error: `${e}` };
    }
  }

  @HostListener("window:message", ["$event"])
  onMessage(
    event: MessageEvent<{ id: string; html: string; context: SecurityContext; from: "DOMExplorer" }>
  ) {
    if (event.data?.from !== "DOMExplorer") return;
    parent?.postMessage(
      {
        id: event.data.id,
        ...this.sanitize(event.data.context, event.data.html),
      },
      "*"
    );
  }
}

bootstrapApplication(AppComponent, { providers: [] }).catch((err) => console.error(err));
