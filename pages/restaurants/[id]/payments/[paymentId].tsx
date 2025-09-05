import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import mockDB from '../../../../utils/mockDatabase';
import { useTranslation } from '../../../../contexts/TranslationContext';
import { 
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CreditCardIcon,
  BanknotesIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const PaymentDetails: NextPage = () => {
  const router = useRouter();
  const { id, paymentId } = router.query;
  const { t } = useTranslation();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (paymentId && id) {
      console.log('Looking for payment:', paymentId, 'in restaurant:', id);
      
      // Static payment data for recent payments
      const staticPayments = {
        '1074': {
          id: '1074',
          orderId: '1074',
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: 22,
          customer: {
            name: 'Gast 1',
            email: 'gast1@splitty.nl',
            phone: '+31612345678'
          },
          method: 'splitty',
          amount: '89.90',
          tip: '4.50',
          fee: '2.70',
          netAmount: '91.70',
          status: 'completed',
          splitType: 'Volledige Rekening',
          stripePaymentId: 'pi_1074_splitty',
          stripeChargeId: 'ch_1074_splitty',
          posTransactionId: '30001074',
          itemsPaid: ['Ribeye Steak (2x)', 'Groenten (2x)', 'Dessert'],
          createdAt: new Date(Date.now() - 32 * 60000),
          completedAt: new Date(Date.now() - 32 * 60000),
          metadata: {
            tableNumber: 22,
            posTransactionId: '30001074',
            itemsPaid: ['Ribeye Steak (2x)', 'Groenten (2x)', 'Dessert'],
            ipAddress: '192.168.1.142',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
          }
        },
        '1075': {
          id: '1075',
          orderId: '1075',
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: 3,
          customer: {
            name: 'Gast 2',
            email: 'gast2@splitty.nl',
            phone: '+31612345679'
          },
          method: 'splitty',
          amount: '34.20',
          tip: '2.00',
          fee: '1.03',
          netAmount: '35.17',
          status: 'completed',
          splitType: 'Pay for Items',
          stripePaymentId: 'pi_1075_splitty',
          stripeChargeId: 'ch_1075_splitty',
          posTransactionId: '30001075',
          itemsPaid: ['Sandwich Club', 'Soep van de Dag', 'Cappuccino (2x)', 'Appeltaart'],
          createdAt: new Date(Date.now() - 25 * 60000),
          completedAt: new Date(Date.now() - 25 * 60000),
          metadata: {
            tableNumber: 3,
            posTransactionId: '30001075',
            itemsPaid: ['Sandwich Club', 'Soep van de Dag', 'Cappuccino (2x)', 'Appeltaart'],
            ipAddress: '192.168.1.87',
            userAgent: 'Mozilla/5.0 (Android 13; Mobile) AppleWebKit/537.36'
          }
        },
        '1076': {
          id: '1076',
          orderId: '1076',
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: 15,
          customer: {
            name: 'Gast 3',
            email: 'gast3@splitty.nl',
            phone: null
          },
          method: 'splitty',
          amount: '20.34',
          tip: '0.00',
          fee: '0.61',
          netAmount: '19.73',
          status: 'in_progress',
          splitType: 'Pay for Items',
          stripePaymentId: 'pi_1076_splitty',
          stripeChargeId: null,
          posTransactionId: '30001076',
          itemsPaid: ['Pasta Arrabiata (gedeeltelijk)'],
          createdAt: new Date(Date.now() - 18 * 60000),
          completedAt: null,
          metadata: {
            tableNumber: 15,
            posTransactionId: '30001076',
            itemsPaid: ['Pasta Arrabiata (gedeeltelijk)'],
            ipAddress: '192.168.1.203',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
          }
        },
        '1077': {
          id: '1077',
          orderId: '1077',
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: 8,
          customer: {
            name: 'Gast 4',
            email: 'gast4@splitty.nl',
            phone: '+31612345680'
          },
          method: 'splitty',
          amount: '23.75',
          tip: '1.25',
          fee: '0.71',
          netAmount: '24.29',
          status: 'completed',
          splitType: 'Gelijke Verdeling',
          stripePaymentId: 'pi_1077_splitty',
          stripeChargeId: 'ch_1077_splitty',
          posTransactionId: '30001077',
          itemsPaid: ['Tosti Ham/Kaas (2x)', 'Verse Jus', 'Koffie (2x)'],
          createdAt: new Date(Date.now() - 12 * 60000),
          completedAt: new Date(Date.now() - 12 * 60000),
          metadata: {
            tableNumber: 8,
            posTransactionId: '30001077',
            itemsPaid: ['Tosti Ham/Kaas (2x)', 'Verse Jus', 'Koffie (2x)'],
            ipAddress: '192.168.1.55',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        },
        '1078': {
          id: '1078',
          orderId: '1078',
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: 12,
          customer: {
            name: 'Gast 5',
            email: 'gast5@splitty.nl',
            phone: '+31612345681'
          },
          method: 'splitty',
          amount: '45.50',
          tip: '3.00',
          fee: '1.37',
          netAmount: '47.13',
          status: 'completed',
          splitType: 'Pay for Items',
          stripePaymentId: 'pi_1078_splitty',
          stripeChargeId: 'ch_1078_splitty',
          posTransactionId: '30001078',
          itemsPaid: ['Biefstuk', 'Friet', 'Salade', 'Bier (2x)'],
          createdAt: new Date(Date.now() - 5 * 60000),
          completedAt: new Date(Date.now() - 5 * 60000),
          metadata: {
            tableNumber: 12,
            posTransactionId: '30001078',
            itemsPaid: ['Biefstuk', 'Friet', 'Salade', 'Bier (2x)'],
            ipAddress: '192.168.1.99',
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
          }
        }
      };
      
      // Try to get payment from static data first
      const paymentData = staticPayments[paymentId] || mockDB.getPayment(paymentId);
      
      if (paymentData) {
        console.log('Found payment:', paymentData);
        // Format the payment data for the component
        const formattedPayment = {
          ...paymentData,
          metadata: {
            tableNumber: paymentData.tableNumber,
            posTransactionId: paymentData.posTransactionId,
            itemsPaid: paymentData.itemsPaid || ['Burger', 'Friet'],
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
          }
        };
        setPayment(formattedPayment);
      } else {
        // Payment not found, create fallback
        console.log('Payment not found, creating fallback for:', paymentId);
        
        const fallbackPayment = {
          id: paymentId,
          orderId: paymentId,
          restaurantId: id,
          restaurantName: 'Restaurant',
          tableNumber: ((parseInt(paymentId) * 7) % 20) + 1,
          customer: {
            name: `Gast ${((parseInt(paymentId) * 13) % 100)}`,
            email: `gast${((parseInt(paymentId) * 13) % 100)}@splitty.nl`,
            phone: null
          },
          method: 'card',
          cardDetails: {
            brand: 'Visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025
          },
          amount: '35.75',
          tip: '3.50',
          fee: '1.15',
          netAmount: '38.10',
          status: 'completed',
          splitType: 'Pay for Items',
          stripePaymentId: `pi_${paymentId}_demo`,
          stripeChargeId: `ch_${paymentId}_demo`,
          posTransactionId: `3000${paymentId.toString().padStart(7, '0')}`,
          itemsPaid: ['Burger', 'Friet', 'Bier'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          metadata: {
            tableNumber: ((parseInt(paymentId) * 7) % 20) + 1,
            posTransactionId: `3000${paymentId.toString().padStart(7, '0')}`,
            itemsPaid: ['Burger', 'Friet', 'Bier'],
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
          }
        };
        
        setPayment(fallbackPayment);
      }
    }
  }, [paymentId, id]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIconSolid className="h-4 w-4 mr-1" />
          {t('orders.status.completed')}
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="h-4 w-4 mr-1" />
          In afwachting
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="h-4 w-4 mr-1" />
          Mislukt
        </span>
      );
    }
  };

  if (!payment) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium group bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('orders.details.backButton')}
          </button>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                Payment #{payment.id}
                <span className="ml-3">
                  {getStatusBadge(payment.status)}
                </span>
              </h1>
              <p className="text-[#6B7280]">{t('payments.details.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                {t('payments.details.refresh')}
              </button>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('payments.details.paymentDetails')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('orders.details.createdAt', { date: formatDate(payment.createdAt) })}</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-medium">{payment.restaurantName}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.orderId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Link href={`/restaurants/${id}/orders/${payment.orderId}`} className="text-green-600 hover:text-green-700">
                      #{payment.orderId}
                    </Link>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.restaurant')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {payment.restaurantName} (ID: {payment.restaurantId})
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.tableNumber')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {t('orders.tableNumber', { number: payment.metadata.tableNumber })}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.splitMode')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {payment.splitType === 'Pay for Items' ? t('payments.details.payForItems') : payment.splitType}
                    </span>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    {getStatusBadge(payment.status)}
                    {payment.completedAt && (
                      <p className="text-sm text-gray-500 mt-1">{t('orders.details.completedOn', { date: formatDate(payment.completedAt) })}</p>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('payments.details.customerInfo')}</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.name')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{payment.customer.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.email')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {payment.customer.email || t('payments.details.notProvided')}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.phone')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {payment.customer.phone || t('payments.details.notProvided')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('payments.details.paymentInfo')}</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.paymentMethod')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                    {payment.method}
                    {payment.cardDetails && (
                      <span className="ml-2 text-gray-500">
                        ({payment.cardDetails.brand} •••• {payment.cardDetails.last4})
                      </span>
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.amount')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">
                    €{payment.amount}
                  </dd>
                </div>
                {payment.tip && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">{t('payments.details.tip')}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      €{payment.tip}
                    </dd>
                  </div>
                )}
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.processingFees')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    €{payment.fee}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.netAmount')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium text-green-600">
                    €{payment.netAmount}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('payments.details.technicalDetails')}</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.stripePaymentId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs">
                    {payment.stripePaymentId}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.stripeChargeId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs">
                    {payment.stripeChargeId}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.posTransactionId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {payment.metadata.posTransactionId}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.paidItems')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {payment.metadata.itemsPaid.join(', ')}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('payments.details.ipAddress')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs">
                    {payment.metadata.ipAddress}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default PaymentDetails
