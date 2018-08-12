import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TarefasComponent } from './tarefas.component';
import { TarefaComponent } from './tarefa.component';
import { ProjetosComponent } from './projetos.component';
import { ProjetoComponent } from './projeto.component';
import { CopyrightComponent } from './copyright.component';
import { TarefasService } from './tarefas.service';
import { ProjetosService } from './projetos.service';
import { AppRoutingModule } from './app.routing';
import { PaginaInvalidaComponent } from './paginainvalida.component';

@NgModule({
  declarations: [
    AppComponent,
    TarefasComponent,
    TarefaComponent,
    ProjetosComponent,
    ProjetoComponent,
    CopyrightComponent,
    PaginaInvalidaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    TarefasService,
    ProjetosService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
