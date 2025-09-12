import Link from 'next/link'
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  
  return (
    <nav className="mb-5" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label || index} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="ml-1 text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 font-medium text-gray-900" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}