import React from 'react'

export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-0 animate-pulse">
      {/* Header Skeleton */}
      <div className="md:sticky md:top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-2xl"></div>
            <div className="h-8 bg-gray-200 rounded-2xl w-48"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-96 mt-4"></div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* KPIs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
                <div className="h-6 bg-gray-100 rounded-full w-24"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-100 rounded w-32 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla Skeleton */}
        <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-2xl"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-64"></div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[1, 2, 3, 4].map(i => (
                    <th key={i} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row}>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 bg-gray-100 rounded w-24 ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
