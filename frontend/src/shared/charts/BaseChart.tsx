import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions, TimeScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';

// Register Chart.js components including TimeScale
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale);

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export interface BaseChartProps {
  data: ChartDataPoint[] | {
    datasets: Array<{
      label: string;
      data: Array<{ x: string; y: number }>;
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }>;
  };
  title: string;
  yAxisLabel?: string;
  timeframe: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  data,
  title,
  yAxisLabel,
  timeframe,
  height = 300,
  className = '',
  showLegend = true,
}) => {
  const chartRef = useRef<ChartJS<'bar', { x: string; y: number }[]> | null>(null);

  // Get computed CSS custom properties for theme-aware colors
  const getComputedColor = (property: string, fallback: string): string => {
    if (typeof window !== 'undefined') {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(property);
      return computed.trim() || fallback;
    }
    return fallback;
  };

  // Utility function to apply opacity to any color
  const applyOpacityToColor = (color: string, opacity: number): string => {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // Handle rgb/rgba colors
    if (color.startsWith('rgb')) {
      if (color.startsWith('rgba(')) {
        // Already has alpha, replace it
        return color.replace(/[\d.]+\)$/, `${opacity})`);
      } else {
        // rgb() format, convert to rgba
        return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
      }
    }
    
    // Handle named colors or other formats - return as is with fallback opacity
    return color;
  };

  const textColor = getComputedColor('--color-text', '#212529');
  const backgroundColor = getComputedColor('--color-background', '#ffffff');
  const borderColor = getComputedColor('--color-border', '#dee2e6');
  
  // Apply reduced opacity to grid colors for subtle appearance
  const gridColor = applyOpacityToColor(borderColor, 0.3);

  const chartData = {
    datasets: Array.isArray(data) ? [{
      label: yAxisLabel || 'Value',
      data: data.map(point => ({
        x: point.timestamp,
        y: point.value
      })),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }] : data.datasets,
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: backgroundColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: borderColor,
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            if (Array.isArray(data)) {
              return data[index]?.timestamp ? 
                new Date(data[index].timestamp).toLocaleString() : 
                tooltipItems[0].label;
            } else {
              // For multi-dataset data, use the first dataset's data
              const firstDataset = data.datasets[0];
              if (firstDataset && firstDataset.data[index]) {
                return new Date(firstDataset.data[index].x).toLocaleString();
              }
              return tooltipItems[0].label;
            }
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          maxRotation: 0,
          minRotation: 0,
          align: 'center',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: textColor,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // Handle theme changes by updating chart colors
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Update colors when theme changes
      const updateColors = () => {
        const newTextColor = getComputedColor('--color-text', '#212529');
        const newBackgroundColor = getComputedColor('--color-background', '#ffffff');
        const newBorderColor = getComputedColor('--color-border', '#dee2e6');
        const newGridColor = applyOpacityToColor(newBorderColor, 0.3);

        // Update chart options
        if (chart.options.plugins?.title) {
          chart.options.plugins.title.color = newTextColor;
        }
        if (chart.options.plugins?.tooltip) {
          chart.options.plugins.tooltip.backgroundColor = newBackgroundColor;
          chart.options.plugins.tooltip.titleColor = newTextColor;
          chart.options.plugins.tooltip.bodyColor = newTextColor;
          chart.options.plugins.tooltip.borderColor = newBorderColor;
        }
        if (chart.options.scales?.x?.grid) {
          chart.options.scales.x.grid.color = newGridColor;
        }
        if (chart.options.scales?.x?.ticks) {
          chart.options.scales.x.ticks.color = newTextColor;
        }
        if (chart.options.scales?.y?.grid) {
          chart.options.scales.y.grid.color = newGridColor;
        }
        if (chart.options.scales?.y?.ticks) {
          chart.options.scales.y.ticks.color = newTextColor;
        }
        if (chart.options.scales?.y?.title) {
          chart.options.scales.y.title.color = newTextColor;
        }

        chart.update('none'); // Update without animation
      };

      // Listen for theme changes (CSS custom property changes)
      const observer = new MutationObserver(updateColors);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });

      // Initial color update
      updateColors();

      return () => observer.disconnect();
    }
  }, [data, timeframe]); // Re-run when data or timeframe changes

  if ((Array.isArray(data) && data.length === 0) || 
      (!Array.isArray(data) && data.datasets.every(dataset => dataset.data.length === 0))) {
    return (
      <div className={`chart-container empty ${className}`} style={{ height }}>
        <div className="chart-placeholder">
          <p>No data available for the selected timeframe</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chart-container ${className}`} style={{ height }}>
      <Bar 
        ref={chartRef}
        data={chartData} 
        options={options} 
      />
    </div>
  );
};
