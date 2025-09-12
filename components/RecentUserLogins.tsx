import React from 'react'

interface User {
  email: string
  role: string
  restaurant: string
}

export default function RecentUserLogins(): React.ReactElement {
  const users: User[] = [
    {
      email: 'anatolii_test@splitty.nl',
      role: 'Admin',
      restaurant: '-',
    },
    {
      email: 'test@test.nl',
      role: 'Restaurant Admin',
      restaurant: 'Splitty',
    },
    {
      email: 'anatolii@splitty.nl',
      role: 'Admin',
      restaurant: '-',
    },
    {
      email: 'Hendriks@loetje.nl',
      role: 'Restaurant Admin',
      restaurant: 'Loetje',
    },
    {
      email: 'admin@aldenaire.nl',
      role: 'Restaurant Admin',
      restaurant: 'Aldenaire catering',
    },
  ]

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.01]">
      <div className="px-6 py-4 border-gray-700 border-b">
        <h2 className="text-lg font-medium text-white">Recent User Logins</h2>
      </div>
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Restaurant
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {users.map((user: User) => (
              <tr key={user.email} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.restaurant}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}