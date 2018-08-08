function criaGrafico(parametros) {
  const max = d3.max(parametros.dados);
  const svg = d3.select('#grafico');
  const margem = {
    esquerda: 20,
    direita: 20,
    superior: 20,
    inferior: 20
  }

  svg.attr('width', parametros.largura).attr('height', parametros.altura);

  const plotagem = svg.append('g').attr('transform', `translate(${margem.esquerda}, ${margem.superior})`);
  

  const larguraPlotagem = parametros.largura - margem.esquerda - margem.direita;
  const alturaPlotagem = parametros.altura - margem.superior - margem.inferior;

  const x = d3.scaleLinear().domain([0, max]).range([0, larguraPlotagem]);
  const y = d3.scaleLinear().domain([0, parametros.dados.length]).range([0, alturaPlotagem]);

  plotagem.selectAll('.barra')
  .data(parametros.dados)
  .enter() 
  .append('rect')
  .classed('barra', true)
  .attr('x', 0)
  .attr('y', (d, i) => y(i))
  .attr('width', d => x(d))
  .attr('height', y(1) * .9);

  plotagem.selectAll('.rotulos')
  .data(parametros.dados)
  .enter() 
  .append('text')
  .classed('rotulo', true)
  .text(d => d)
  .attr('x', d => x(d))
  .attr('y', (d, i) => y(i))
  .attr('dx', -5)
  .attr('dy', (d, i) => y(1) * .9 * 2 / 3);
}
