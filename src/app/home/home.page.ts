import { Component, Renderer2 } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  constructor(
    private render: Renderer2,
    
  ) {}
  ngOnInit() {}

  ionViewDidEnter() {
    const localStorageTheme = localStorage.getItem("themeSelected");
    if (localStorageTheme == null) {
      this.render.setAttribute(document.body, "color-theme", "light");
    } else {
      this.render.setAttribute(document.body, "color-theme", localStorageTheme);
    }
  }
}
