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

    <!-- <p><input type=text id="nome" name="nome" #n></p> 
    <p><button (click) = "enviar(n.value)">Enviar</button></p>-->

    <p><input type=text [(ngModel)]="nome" #n></p>
    <span *ngIf="n.value.length<3">O nome deve ter no mínimo 3 caracteres.</span>
    <p>Nome: {{nome}}</p>
    <copyright></copyright>
  `
})
export class AppComponent { 
  logo: string = "../assets/logo.png";

  nome: any = '';

  // enviar(n): void {
  //   // this.nome = <HTMLInputElement>document.getElementById('nome').value;
  //   this.nome = n;
  // }
}
