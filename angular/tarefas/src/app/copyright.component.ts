import { Component } from '@angular/core';

@Component({
  selector: 'copyright',
  template: `
    <p><small>&copy; {{ano}} {{autor}} &copy;</small></p>
  `,
  styles: [`
    p {
      margin-top: 2em;
    }
  `]
})

export class CopyrightComponent { 
  ano: number;
  autor: string;

  constructor() {
    this.ano = 2018;
    this.autor = 'Yanni Fraga';
  }
}