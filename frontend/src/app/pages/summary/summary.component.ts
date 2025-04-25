import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  ChartType
} from 'chart.js';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Clean Energy Investment Growth (Sample)'
      }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');

    this.http.get<any>('http://localhost:3000/api/charts/summary', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        console.log("✅ Data coming ------->", res);
        this.chartData = {
          labels: res.labels,
          datasets: [
            {
              label: 'Clean Energy Investment (Billion USD)',
              data: res.values,
              backgroundColor: [
                '#42a5f5', // Blue
                '#66bb6a', // Green
                '#ffa726', // Orange
                '#ab47bc', // Purple
                '#ef5350', // Red
                '#26c6da'  // Cyan (extra in case of more values)
              ]
                          }
          ]
        };
      },
      error: (err) => {
        console.error('❌ Chart fetch failed:', err);
      }
    });
  }
}
