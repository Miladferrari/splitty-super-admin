import React from 'react'
import { formatCurrency } from '../utils/formatters'

interface Restaurant {
  name: string
  orders: number
  revenue: number
}

export default function MostActiveRestaurants(): React.ReactElement {
  const restaurants: Restaurant[] = [
    {
      name: 'Limon B.V.',
      orders: 62,
      revenue: 4848.80,
    },
    {
      name: 'Anatolii Restaurant',
      orders: 7,
      revenue: 416.20,
    },
    {
      name: 'Viresh Kewalbansing',
      orders: 4,
      revenue: 92.15,
    },
  ]

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]">
      <div className="px-6 py-4 border-gray-700 border-b">
        <h2 className="text-lg font-medium text-white">Most Active Restaurants</h2>
      </div>
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {restaurants.map((restaurant: Restaurant) => (
              <tr key={restaurant.name} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {restaurant.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {restaurant.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatCurrency(restaurant.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}