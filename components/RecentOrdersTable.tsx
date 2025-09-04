import React, { useState, memo } from 'react'
import Link from 'next/link'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid'
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters'
import { Order, StatusConfig } from '../types'

interface StatusBadgeProps {
  status: Order['status']
}

interface StatusConfigMap {
  completed: StatusConfig
  in_progress: StatusConfig
}

const RecentOrdersTable = (): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  const orders: Order[] = [
    {
      id: 345,
      restaurant: 'Anatolii Restaurant',
      table: 'Table #8',
      created: new Date('2025-07-31T15:45:00'),
      amount: 48.80,
      paid: 0.00,
      status: 'in_progress',
      isSplit: true,
    },
    {
      id: 344,
      restaurant: 'Anatolii Restaurant',
      table: 'Table #8',
      created: new Date('2025-07-31T15:17:00'),
      amount: 48.80,
      paid: 48.80,
      status: 'completed',
      isSplit: true,
    },
    {
      id: 343,
      restaurant: 'Anatolii Restaurant',
      table: 'Table #8',
      created: new Date('2025-07-31T11:16:00'),
      amount: 48.80,
      paid: 48.80,
      status: 'completed',
      isSplit: true,
    },
    {
      id: 342,
      restaurant: 'Anatolii Restaurant',
      table: 'Table #7',
      created: new Date('2025-07-31T01:28:00'),
      amount: 48.80,
      paid: 28.90,
      status: 'completed',
      isSplit: true,
    },
    {
      id: 341,
      restaurant: 'Anatolii Restaurant',
      table: 'Table #6',
      created: new Date('2025-07-31T00:42:00'),
      amount: 48.80,
      paid: 18.95,
      status: 'in_progress',
      isSplit: true,
    },
  ]

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }): React.ReactElement => {
    const statusConfig: StatusConfigMap = {
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        text: 'Completed',
      },
      in_progress: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: ClockIcon,
        text: 'In Progress',
      },
    }

    const config = statusConfig[status as keyof StatusConfigMap] || statusConfig.in_progress

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.icon && React.createElement(config.icon, { className: "h-3 w-3 mr-1" })}
        {config.text}
      </span>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]">
      <div className="px-6 py-4 border-gray-700 border-b">
        <h2 className="text-lg font-medium text-white">Recent Orders</h2>
      </div>
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Restaurant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Table
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Split
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-splitty">
                    <Link href={`/orders/${order.id}`}>#{order.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.restaurant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.table}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created ? formatDate(order.created) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(order.amount || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Paid: {formatCurrency(order.paid || 0)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-splitty h-1.5 rounded-full"
                        style={{
                          width: `${formatPercentage(order.paid || 0, order.amount || 0)}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.isSplit ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:bg-white disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {currentPage} of 2</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RecentOrdersTable)