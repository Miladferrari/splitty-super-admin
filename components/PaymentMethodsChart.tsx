import React, { useEffect, useRef, memo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  TooltipCallbacks,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PaymentMethodDataset {
  data: number[]
  backgroundColor: string[]
  borderColor: string
  borderWidth: number
}

interface PaymentMethodChartData {
  labels: string[]
  datasets: PaymentMethodDataset[]
}

const PaymentMethodsChart = (): React.JSX.Element => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(209, 213, 219)',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgb(243, 244, 246)',
        bodyColor: 'rgb(209, 213, 219)',
        borderColor: 'rgb(55, 65, 81)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context: TooltipItem<'doughnut'>): string {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += context.parsed + ' payments'
            }
            return label
          },
        } as Partial<TooltipCallbacks<'doughnut'>>,
      },
    },
  }

  const data: PaymentMethodChartData = {
    labels: ['Card', 'Cash', 'iDEAL', 'Apple Pay'],
    datasets: [
      {
        data: [65, 20, 10, 4],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(251, 146, 60)',
        ],
        borderColor: 'rgb(31, 41, 55)',
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]">
      <h2 className="text-lg font-medium mb-4 text-white">Payment Methods</h2>
      <div className="h-64 relative">
        <Doughnut options={options} data={data} />
        <div
          className="absolute inset-0 flex items-center justify-center flex-col"
          style={{ pointerEvents: 'none' }}
        >
          <p className="text-3xl font-bold text-gray-100">99</p>
          <p className="text-sm text-gray-400">Total Payments</p>
        </div>
      </div>
    </div>
  )
}

export default memo(PaymentMethodsChart)