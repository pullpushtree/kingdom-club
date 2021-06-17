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
                loadChildren: () => import('../pages/profile-gallery/profile-gallery.module').then( m => m.ProfileGalleryPageModule)
            },
            {
                path: 'camera',
                loadChildren: () => import('../pages/camera/camera.module').then( m => m.CameraPageModule)
            },            
            {
                path: 'chats',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'chats/:id',
                loadChildren:() => import('../pages/chats/chats.module').then(m => m.ChatsPageModule)
            },
            {
                path: 'contacts',
                loadChildren: () => import('../pages/contacts/contacts.module').then( m => m.ContactsPageModule)
            },
            {
                path: 'messages',
                loadChildren: () => import('../pages/messages/messages.module').then( m => m.MessagesPageModule)
            },
            {
                path: 'notifications',
                loadChildren: () => import('../pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
            },
            {
                path: 'profile',
                loadChildren:() => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
            },
            {
                path: 'profile-comments/:id',
                loadChildren: () => import('../pages/profile-comments/profile-comments.module').then( m => m.ProfileCommentsPageModule)
            },
            {
                path: 'profile/edit',
                loadChildren: () => import('../pages/profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule)
            },
            {
                path: 'profile-gallery',
                loadChildren: () => import('../pages/profile-gallery/profile-gallery.module').then( m => m.ProfileGalleryPageModule)
            },
            {
                path: 'profile-roll/:id',
                loadChildren: () => import('../pages/profile-roll/profile-roll.module').then( m => m.ProfileRollPageModule)
            },
            {
                path: 'profile-view/:id',
                loadChildren: () => import('../pages/profile-view/profile-view.module').then( m => m.ProfileViewPageModule)
            },
            {
                path: 'prompts/:id',
                loadChildren: () => import('../pages/prompts/prompts.module').then( m => m.PromptsPageModule)
            },
            {
                path: 'settings',
                loadChildren:() => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)
            },
            {
                path: 'search',
                loadChildren: () => import('../pages/search/search.module').then( m => m.SearchPageModule)
            },
            {
                path: 'setup',
                loadChildren: () => import('../pages/set-profile-images/set-profile-images.module').then( m => m.SetProfileImagesPageModule),    
            },
            {
                path: '**', redirectTo: 'profile-gallery', pathMatch: 'full'
            }
        ]
    },
    {
        path: '**', redirectTo: 'home/profile-gallery', pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRouter {}