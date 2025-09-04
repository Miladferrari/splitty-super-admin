import React, { useState, memo } from 'react'
import Link from 'next/link'
import { CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import { formatCurrency, formatDate } from '../utils/formatters'
import { Payment, StatusConfig } from '../types'

interface StatusBadgeProps {
  status: Payment['status']
}

interface StatusConfigMap {
  completed: StatusConfig
}

const RecentPaymentsTable = (): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  
  const payments: Payment[] = [
    {
      id: 841,
      restaurant: 'Anatolii Restaurant',
      orderId: 344,
      method: 'card',
      amount: 48.80,
      status: 'completed',
      date: new Date('2025-07-31T15:19:00'),
    },
    {
      id: 840,
      restaurant: 'Anatolii Restaurant',
      orderId: 343,
      method: 'card',
      amount: 39.80,
      status: 'completed',
      date: new Date('2025-07-31T11:18:00'),
    },
    {
      id: 839,
      restaurant: 'Anatolii Restaurant',
      orderId: 343,
      method: 'card',
      amount: 9.00,
      status: 'completed',
      date: new Date('2025-07-31T11:16:00'),
    },
    {
      id: 838,
      restaurant: 'Anatolii Restaurant',
      orderId: 342,
      method: 'card',
      amount: 9.95,
      status: 'completed',
      date: new Date('2025-07-31T01:34:00'),
    },
    {
      id: 837,
      restaurant: 'Anatolii Restaurant',
      orderId: 342,
      method: 'card',
      amount: 9.95,
      status: 'completed',
      date: new Date('2025-07-31T01:33:00'),
    },
  ]

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }): React.ReactElement => {
    const statusConfig: StatusConfigMap = {
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircleIcon,
        text: 'Completed',
      },
    }

    const config = statusConfig[status as keyof StatusConfigMap] || statusConfig.completed

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
        <h2 className="text-lg font-medium text-white">Recent Payments</h2>
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
                  ID
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
                  Order
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Method
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
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment: Payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-splitty">
                    <Link href={`/payments/${payment.id}`}>#{payment.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.restaurant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/orders/${payment.orderId}`}
                      className="text-splitty hover:text-splitty-dark"
                    >
                      #{payment.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-4 w-4 text-gray-500" />
                      <span className="ml-1 capitalize">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(typeof payment.amount === 'number' ? payment.amount : 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.date)}
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

export default memo(RecentPaymentsTable)