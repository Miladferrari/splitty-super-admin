import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartBarIcon } from '@heroicons/react/24/outline'

interface ChartDataPoint {
  time: string
  splittyOmzet?: number
  verwerkteBetalingen?: number
  aantalTransacties?: number
  gemiddeldBedrag?: number
  [key: string]: string | number | undefined
}

interface DashboardAnalyticsProps {
  chartData: ChartDataPoint[]
  selectedMetric: string | null
}

const ChartLoadingFallback = () => (
  <div className="flex items-center justify-center h-80 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
    </div>
  </div>
)

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ chartData, selectedMetric }) => {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[320px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
            <ChartBarIcon className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">Geen data beschikbaar</p>
          <p className="text-gray-400 text-sm mt-1">Selecteer een andere periode</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBetalingen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorFooien" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGemiddelde" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
            tickFormatter={(value) => `€${value}`}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#9ca3af"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '10px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: any, name: any) => {
              const formattedName = name === 'splittyOmzet' ? 'Splitty Omzet' : 
                                   name === 'verwerkteBetalingen' ? 'Verwerkte Betalingen' : 
                                   name === 'aantalTransacties' ? 'Aantal Transacties' :
                                   'Gemiddeld Bedrag'
              if (typeof name === 'string' && (name === 'splittyOmzet' || name === 'verwerkteBetalingen' || name === 'gemiddeldBedrag')) {
                return [`€${value}`, formattedName]
              }
              return [value, formattedName]
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          {(!selectedMetric || selectedMetric === 'splitty-omzet') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="splittyOmzet" 
              stroke="url(#gradientGreen)"
              strokeWidth={selectedMetric === 'splitty-omzet' ? 4 : 3}
              dot={{ fill: '#10b981', r: selectedMetric === 'splitty-omzet' ? 4 : 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              fill="url(#colorOmzet)"
              animationDuration={500}
            >
              <defs>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </Line>
          )}
          {(!selectedMetric || selectedMetric === 'verwerkte-betalingen') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="verwerkteBetalingen" 
              stroke="url(#gradientBlue)"
              strokeWidth={selectedMetric === 'verwerkte-betalingen' ? 4 : 3}
              dot={{ fill: '#3b82f6', r: selectedMetric === 'verwerkte-betalingen' ? 4 : 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              fill="url(#colorBetalingen)"
              animationDuration={500}
            >
              <defs>
                <linearGradient id="gradientBlue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </Line>
          )}
          {(!selectedMetric || selectedMetric === 'aantal-transacties') && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="aantalTransacties" 
              stroke="url(#gradientPurple)"
              strokeWidth={selectedMetric === 'aantal-transacties' ? 4 : 3}
              dot={{ fill: '#a855f7', r: selectedMetric === 'aantal-transacties' ? 4 : 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              fill="url(#colorFooien)"
              animationDuration={500}
            >
              <defs>
                <linearGradient id="gradientPurple" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </Line>
          )}
          {(!selectedMetric || selectedMetric === 'gemiddeld-bedrag') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="gemiddeldBedrag" 
              stroke="url(#gradientOrange)"
              strokeWidth={selectedMetric === 'gemiddeld-bedrag' ? 4 : 3}
              strokeDasharray={selectedMetric === 'gemiddeld-bedrag' ? undefined : "5 5"}
              dot={{ fill: '#f97316', r: selectedMetric === 'gemiddeld-bedrag' ? 4 : 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              animationDuration={500}
            >
              <defs>
                <linearGradient id="gradientOrange" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </Line>
          )}
        </LineChart>
    </ResponsiveContainer>
  )
}

export default React.memo(DashboardAnalytics)