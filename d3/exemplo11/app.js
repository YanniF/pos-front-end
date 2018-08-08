function GraficoDeLinhas(parametros) {
  
  const svg = d3.select(parametros.seletor).attr('width', parametros.largura).attr('height', parametros.altura);
  const margem = {
    esquerda: 70,
    direita: 20,
    superior: 40,
    inferior: 100
  };

  this.larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
  this.alturaPlotagem = parametros.altura - margem.inferior - margem.superior;

  svg.select('#plotagem').remove();
  this.plotagem = svg.append('g')
      .attr('id', 'plotagem')
      .attr('width', this.larguraPlotagem)
      .attr('height', this.alturaPlotagem)
      .attr('transform', `translate(${margem.esquerda}, ${margem.superior})`);

  this.x = d3.scaleLinear().range([0, this.larguraPlotagem]);
  this.y = d3.scaleLinear().range([this.alturaPlotagem, 0]);
  this.cores = d3.scaleOrdinal().range(d3.schemeCategory10);
  
  // prepara as linhas de grade
  this.grade = d3.axisRight(this.y).tickSize(this.larguraPlotagem).tickFormat('');
  this.plotagem.append('g').attr('id', 'grade');

  // prepara os eixos X e Y
  this.eixoX = d3.axisBottom(this.x);
  this.plotagem.append('g')
      .attr('id', 'eixoX')
      .attr('transform', 'translate(0, ' + this.alturaPlotagem + ')');
  
  this.eixoY = d3.axisLeft(this.y);
  this.plotagem.append('g').attr('id', 'eixoY');

  // cria os títulos dos eixos
  this.plotagem.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'translate(-40, ' + this.alturaPlotagem / 2 + ') rotate(-90)')
      .text(parametros.tituloY)
      .classed('titulo-eixo', true);
  
  this.plotagem.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', 'translate(' + this.larguraPlotagem / 2 + ', ' + (this.alturaPlotagem + 80) + ')')
      .text(parametros.tituloX)
      .classed('titulo-eixo', true);

  // cria o gerador de linhas
  const converteData = d3.timeParse('%Y-%m-%d');
  this.linha = d3.line()
      .x(d => this.x(converteData(d.data)))
      .y(d => this.y(d.valor))
      .curve(d3.curveCardinal);

  this.linhaMouse = this.plotagem.append('g').classed('eventos-mouse', true);
  this.linhaMouse.append('path')
      .classed('linha-mouse', true)
      .style('stroke', '#333')
      .style('stroke-width', '1px')
      .style('opacity', 0);

  this.linhaMouse.append('rect')
      .attr('width', this.larguraPlotagem)
      .attr('height', this.alturaPlotagem)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');


  this.atualiza = function(dados, periodo) {

    // cria uma referência não ambígua para o objeto do gráfico
    const self = this;

    // atualiza as escalas de acordo com os novos dados
    const converteData = d3.timeParse('%Y-%m-%d');
    self.x.domain(periodo.map(i => converteData(i)));
    self.y.domain([
        d3.min(dados.map(i => d3.min(i.valores.map(d => d.valor)))) - 10, 
        d3.max(dados.map(i => d3.max(i.valores.map(d => d.valor))))
    ]);

    // cria os elementos SVG dos exiso e da linha de grade
    const inicio = converteData(periodo[0]);
    let fim = converteData(periodo[1]);

    self.eixoX.tickValues(d3.timeDay.range(inicio, ++fim)).tickFormat(d3.timeFormat('%d/%m'));
    self.plotagem.select('#eixoX').call(self.eixoX);

    self.eixoY.ticks(8);
    self.plotagem.select('#eixoY').call(self.eixoY);

    self.grade.ticks(8);
    self.plotagem.select('#grade').call(self.grade);

    // cria as séries de dados
    self.plotagem.selectAll('.serie').remove();
    const series = self.plotagem.selectAll('.serie').data(dados);
    const s = series.enter()
        .append('g')
        .attr('id', d => d.chave)
        .classed('serie', true);

    s.append('path')
     .datum((d) => d.valores)
     .classed('linha', true)
     .style('stroke', (d, i) => self.cores(i))
     .attr('d', self.linha);

    s.append('rect')
     .classed('caixa-legenda', true)
     .attr('x', 0)
     .attr('y', (d, i) => this.alturaPlotagem + 65 + 20 * i)
     .attr('width', 13)
     .attr('height', 13)
     .attr('fill', (d, i) => self.cores(i));
  
    s.append('text')
     .classed('texto-legenda', true)
     .text(d => d.chave)
     .attr('x', 16)
     .attr('y', (d, i) => this.alturaPlotagem + 76 + 20 * i)

    dados.forEach(i => {
      const pontos = self.plotagem
        .select('#' + i.chave)
        .selectAll('.ponto')
        .data(i.valores);

      pontos.enter()
        .append('circle')
        .classed('ponto', true)
        .attr('r', 3)        
        .attr('cx', d => self.x(converteData(d.data)))
        .attr('cy', d => self.y(d.valor));
    });

    // eventos do mouse
    d3.selectAll('.ponto-linha').remove();
    const pontoPorLinha = self.linhaMouse.selectAll('.ponto-linha')
      .data(dados)
      .enter()
      .append('g')
      .classed('ponto-linha', true);

    pontoPorLinha.append('circle')
      .attr('r', 5)
      .style('stroke', (d, i) => self.cores(i))
      .style('fill', (d, i) => self.cores(i))
      .style('stroke-width', '2px')
      .style('opacity', 0);

    pontoPorLinha.append('text')
      .attr('transform', 'translate(10, 3)');

    const linhas = document.getElementsByClassName('linha');

    self.linhaMouse
      .on('mouseover', function() {
        d3.select('.linha-mouse')
          .style('opacity', 1);
        d3.selectAll('.ponto-linha circle')
          .style('opacity', 1);
        d3.selectAll('.ponto-linha text')
          .style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select('.linha-mouse')
          .style('opacity', 0);
        d3.selectAll('.ponto-linha circle')
          .style('opacity', 0);
        d3.selectAll('.ponto-linha text')
          .style('opacity', 0)
      })
      .on('mousemove', function() {
        const mouse = d3.mouse(this);
        d3.select('.linha-mouse')
          .attr('d', function() {
            return 'M' + mouse[0] + ', 0 L' + mouse[0] + ', ' + self.alturaPlotagem;
          });
        d3.selectAll('.ponto-linha')
          .attr('transform', function(d, i) {
            let inicio = 0, 
                  fim = linhas[i].getTotalLength(), // total de pontos na linha
                  alvo = null;

            // busca binária na linha pontos, usando mouse.X
            while(true) {
              alvo = Math.floor((inicio + fim) / 2);
              pos = linhas[i].getPointAtLength(alvo);

              if((alvo === fim || alvo === inicio) && pos.x != mouse[0])
                break;

              if(pos.x > mouse[0])
                fim = alvo
              else if(pos.x < mouse[0])
                inicio = alvo;
              else  
                break; //encontrou o ponto
            }

            d3.select(this)
              .select('text')
              .text(self.y.invert(pos.y).toFixed(0))
            return 'translate(' + mouse[0] + ', ' + pos.y + ')';
          });
      });
  }

  this.atualiza(parametros.dados, parametros.periodo);
}
