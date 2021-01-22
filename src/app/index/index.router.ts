import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexPage } from "./index.page";

const routes: Routes = [
  {
    path: "",
    component: IndexPage,
    children: [
      {
        path: "",
        loadChildren: () => import("../pages/welcome/welcome.module").then((m) => m.WelcomePageModule),
      },
      {
        path: "login",
        loadChildren: () => import("../pages/login/login.module").then((m) => m.LoginPageModule),
      },
      {
        path: "signup",
        loadChildren: () => import("../pages/signup/signup.module").then((m) => m.SignupPageModule),
      },
      {
        path: "welcome",
        loadChildren: () => import("../pages/welcome/welcome.module").then((m) => m.WelcomePageModule),
      },
      {
        path: "forgotPassord",
        loadChildren: () => import("../pages/forgot-password/forgot-password.module").then((m) => m.ForgotPasswordPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexRouter {}
