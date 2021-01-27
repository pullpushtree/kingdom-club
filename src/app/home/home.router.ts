import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { HomeGuard } from '../guards/home.guard';
import { UserDataResolver } from '../resolver/userData.resolver';


const routes: Routes = [
    {
        path: 'home',
        component: HomePage,
        canActivate: [HomeGuard],
        resolve: {
            userData: UserDataResolver
        },
        children: [
            {
                path: '',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'chats',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'profile',
                loadChildren:() => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'settings',
                loadChildren:() => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
            },
            {
                path: '', redirectTo: 'home/profile', pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRouter {}