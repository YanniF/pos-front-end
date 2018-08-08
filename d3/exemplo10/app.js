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

  
  this.atualiza = function(dados, periodo) {

    // cria uma referência não ambígua para o objeto do gráfico
    const self = this;

    // atualiza as escalas de acordo com os novos dados
    const converteData = d3.timeParse('%Y-%m-%d');
    self.x.domain(periodo.map(i => converteData(i)));
    self.y.domain([d3.min(dados[0].valores.map(i => i.valor)) - 10, d3.max(dados[0].valores.map(i => i.valor))]);

    // cria os elementos SVG dos exiso e da linha de grade
    const inicio = converteData(periodo[0]);
    let fim = converteData(periodo[1]);

    self.eixoX.tickValues(d3.timeDay.range(inicio, ++fim)).tickFormat(d3.timeFormat('%d/%m'));
    self.plotagem.select('#eixoX').call(self.eixoX);

    self.eixoY.ticks(8);
    self.plotagem.select('#eixoY').call(self.eixoY);

    self.grade.ticks(8);
    self.plotagem.select('#grade').call(self.grade);

    // cria a linha que conecta os pontos (antes deles), para que a linha fique abaixo deles
    self.plotagem.select('.linha').remove();
    self.plotagem.append('path')
        .datum(dados[0].valores)
        .classed('linha', true)
        .attr('d', self.linha);

    // ajusta a quantidade de pontos aos dados, criando ou removendo os pontos necessários
    const pontos = self.plotagem.selectAll('.ponto').data(dados[0].valores);
    pontos.enter().append('circle').classed('ponto', true).attr('r', 3);
    pontos.exit().remove();

    // formata os pontos de acordo com os dados
    self.plotagem.selectAll('.ponto')
        .attr('cx', d => self.x(converteData(d.data)))
        .attr('cy', d => self.y(d.valor));
  }

  this.atualiza(parametros.dados, parametros.periodo);
}
