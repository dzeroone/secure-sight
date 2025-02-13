import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RiskIndicatorType } from '@@/types/types';


interface GaugeChartProps {
  indicator: RiskIndicatorType;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ indicator }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;
    const needleLength = radius * 0.8;

    const valueMap = {
      Low: -Math.PI / 1.2,    // Pointing straight up (0 degrees)
      Medium: Math.PI * 1.5,            // Pointing to the right (90 degrees)
      High: Math.PI * 1.8     // Pointing straight down (180 degrees)
    };

    const colorMap = {
      Low: 'green',
      Medium: 'orange',
      High: 'red'
    };

    const angle = valueMap[indicator.value];
    const arcColor = colorMap[indicator.value];

    if (containerRef.current) {
      const container = d3.select(containerRef.current);
      container.selectAll('*').remove(); // Clear previous content

      container.append('div')
        .attr('class', 'gauge-value-label')
        .style('font-weight', 'bold')
        .style('text-align', 'center')
        .style('color', '#090c9a')
        .style('margin-bottom', '8px')
        .text(indicator.value);

      const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

      const arc = d3.arc<any, d3.DefaultArcObject>()
        .innerRadius(radius - 20)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

      svg.append('path')
        .attr('d', arc({} as d3.DefaultArcObject)!)  // Pass a dummy object and assert non-null
        .attr('transform', `translate(${width / 2}, ${height / 2})`)
        .attr('fill', arcColor);

      svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', width / 2 + needleLength * Math.cos(angle))
        .attr('y2', height / 2 + needleLength * Math.sin(angle))
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 4);

      svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 5)
        .attr('fill', 'steelblue');

      container.append('div')
        .attr('class', 'gauge-risk-label')
        .style('font-weight', 'bold')
        .style('text-align', 'center')
        .style('color', '#090c9a')
        .style('margin-top', '-80px')
        .text(indicator.risk_name);
    }
  }, [indicator]);

  return (
    <div ref={containerRef} />
  );
};

export default GaugeChart;
