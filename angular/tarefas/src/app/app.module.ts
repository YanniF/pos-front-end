import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TarefasComponent } from './tarefas.component';
import { CopyrightComponent } from './copyright.component';

@NgModule({
  declarations: [
    AppComponent,
    TarefasComponent,
    CopyrightComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
