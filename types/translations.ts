// Translation type definitions
export type Language = 'nl' | 'en'

export interface TranslationKeys {
  dashboard: {
    title: string
    subtitle: string
    greeting: {
      morning: string
      afternoon: string
      evening: string
    }
    filters: {
      allStores: string
      allRestaurants: string
      today: string
      yesterday: string
      last7days: string
      last30days: string
      last90days: string
      last365days: string
      lastWeek: string
      lastMonth: string
      lastQuarter: string
      lastYear: string
      weekToDate: string
      monthToDate: string
      quarterToDate: string
      yearToDate: string
      thisMonth: string
      previousMonth: string
      custom: string
      compareWithPrevious: string
      compare: string
      from: string
      to: string
      cancel: string
      apply: string
    }
    stats: {
      splittyRevenue: {
        title: string
        description: string
      }
      processedPayments: {
        title: string
        description: string
      }
      totalTransactions: {
        title: string
        description: string
      }
      averageAmount: {
        title: string
        description: string
      }
      activeRestaurants: {
        title: string
        description: string
      }
      tableSize: {
        title: string
        description: string
        unit: string
      }
    }
    analytics: {
      title: string
      views: {
        total: string
        restaurant: string
        region: string
      }
      metrics: {
        stripeCosts: string
        netProfit: string
        margin: string
        perTransaction: string
        ofRevenue: string
        ofVolume: string
      }
      regions: {
        northHolland: string
        southHolland: string
        utrecht: string
      }
    }
    sections: {
      financialOverview: {
        title: string
        stripeCosts: string
        netProfit: string
        profit: string
        perTransaction: string
        transactionCosts: string
      }
      openQuotations: {
        title: string
        viewAll: string
        status: {
          urgent: string
          pending: string
        }
        time: {
          hoursAgo: string
          dayAgo: string
        }
      }
      bestPerforming: {
        title: string
        subtitle: string
        liveRankings: string
        exportCSV: string
        inRevenue: string
        columns: {
          restaurant: string
          revenue: string
          transactions: string
          rating: string
        }
        splittyFee: string
      }
      partners: {
        title: string
        types: {
          paymentProvider: string
          posIntegration: string
        }
        status: {
          active: string
          pending: string
        }
      }
    }
    chart: {
      title: string
      allMetrics: string
      perHour: string
      metrics: {
        all: string
        revenue: string
        payments: string
        tips: string
      }
      labels: {
        revenue: string
        payments: string
        transactions: string
        averageAmount: string
        tableSize: string
      }
      noData: string
    }
    quickActions: {
      title: string
      addRestaurant: string
      viewReports: string
      manageUsers: string
      settings: string
    }
  }
}

// Helper type for nested key paths
export type TranslationPath = string

// Translation function type
export type TranslationFunction = (key: TranslationPath, params?: Record<string, any>) => string