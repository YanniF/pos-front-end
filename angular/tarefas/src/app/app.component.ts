import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [`
    img {
      float: right;
    }
    .titulo {
      font-family: 'Helvetica', sans-serif;
    }
  `],
  template: `
    <h1 [class]="'titulo'">Gestão de Tarefas</h1>
    <tarefa></tarefa>
    <copyright></copyright>
  `
})
export class AppComponent {
  
}
