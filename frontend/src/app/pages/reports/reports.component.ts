import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild('lineChart', { static: true }) lineChartRef!: ElementRef;
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');

    this.http.get<any>('http://localhost:3000/api/charts/reports', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        console.log("Data coming from backend: ", data)
        this.renderLineChart(data.lineChart);
        this.renderBarChart(data.barChart);
        
      },
      error: (err) => console.error('Chart fetch failed:', err)
    });
  }

  renderLineChart(data: { labels: string[], values: (string | number)[] }): void {
    const el = this.lineChartRef.nativeElement;
    d3.select(el).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const values: number[] = data.values.map(v => +v); 
    const x = d3.scalePoint<string>().domain(data.labels).range([0, width]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(values) as number ?? 100])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => x(data.labels[i])!)
      .y(d => y(d));

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));

    svg.append('path')
      .datum(values)
      .attr('fill', 'none')
      .attr('stroke', '#00bfa5')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    svg.selectAll('circle')
      .data<number>(values)
      .enter()
      .append('circle')
      .attr('cx', (_, i) => x(data.labels[i])!)
      .attr('cy', d => y(d))
      .attr('r', 5)
      .attr('fill', '#00bfa5');
  }

  renderBarChart(data: { labels: string[], values: (string | number)[] }): void {
    const el = this.barChartRef.nativeElement;
    d3.select(el).selectAll('*').remove();
  
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
  
    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    const values: number[] = data.values.map(v => +v);
    const x = d3.scaleBand().domain(data.labels).range([0, width]).padding(0.2);
    const y = d3.scaleLinear()
      .domain([0, d3.max(values) as number ?? 100])
      .range([height, 0]);
  
    // ✅ Create a color scale with unique colors per label
    const color = d3.scaleOrdinal<string>()
      .domain(data.labels)
      .range(['#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350', '#26c6da']);
  
    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  
    svg.selectAll('.bar')
      .data<number>(values)
      .enter()
      .append('rect')
      .attr('x', (_, i) => x(data.labels[i])!)
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d))
      .attr('fill', (_, i) => color(data.labels[i]));
  }
  }
