import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordingComponent } from './recording/recording.component';

const routes: Routes = [{
	path : 'record-screen',
	component: RecordingComponent
},
{
	path : '', redirectTo: 'record-screen', pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
