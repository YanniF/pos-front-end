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
    <img [src]="logo">
    <h1 [class]="'titulo'">Gestão de Tarefas</h1>
    <tarefas></tarefas>
    <p><input type=text id="nome" name="nome"></p>
    <p><button (click) = "enviar()">Enviar</button></p>
    <p>Nome: {{nome}}</p>
    <copyright></copyright>
  `
})
export class AppComponent { 
  logo: string = "../assets/logo.png";

  nome: any = '';

  enviar(): void {
    // this.nome = <HTMLInputElement>document.getElementById('nome').value;
  }
}
