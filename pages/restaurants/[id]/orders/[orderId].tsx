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
  CalendarIcon,
  HashtagIcon,
  TableCellsIcon,
  UserIcon,
  CurrencyEuroIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const OrderDetails: NextPage = () => {
  const router = useRouter();
  const { id, orderId } = router.query;
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId && id) {
      console.log('Looking for order:', orderId, 'in restaurant:', id);
      
      // Static order data matching the table cards
      const staticOrders = {
        'ORD-2025-1008': {
          id: 'ORD-2025-1008',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001008',
          tableNumber: 8,
          customer: 'Tafel 8',
          totalAmount: '53.06',
          paidAmount: (53.06 * 0.3).toFixed(2), // 30% paid as shown on card
          remainingAmount: (53.06 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 35 * 60000),
          items: [
            { name: 'Burger Deluxe', quantity: 2, unitPrice: 14.50, total: 29.00, paymentStatus: 'partial' },
            { name: 'Friet', quantity: 2, unitPrice: 4.50, total: 9.00, paymentStatus: 'paid' },
            { name: 'Cola', quantity: 2, unitPrice: 3.50, total: 7.00, paymentStatus: 'pending' },
            { name: 'Koffie', quantity: 2, unitPrice: 4.03, total: 8.06, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1008-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((53.06 * 0.3).toFixed(2)),
            tip: 0,
            status: 'completed',
            date: new Date(Date.now() - 30 * 60000)
          }]
        },
        'ORD-2025-1009': {
          id: 'ORD-2025-1009',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001009',
          tableNumber: 9,
          customer: 'Tafel 9',
          totalAmount: '132.96',
          paidAmount: (132.96 * 0.3).toFixed(2),
          remainingAmount: (132.96 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 75 * 60000),
          items: [
            { name: 'Steak', quantity: 3, unitPrice: 28.50, total: 85.50, paymentStatus: 'partial' },
            { name: 'Salade', quantity: 2, unitPrice: 12.00, total: 24.00, paymentStatus: 'paid' },
            { name: 'Wijn', quantity: 2, unitPrice: 8.50, total: 17.00, paymentStatus: 'pending' },
            { name: 'Water', quantity: 3, unitPrice: 2.15, total: 6.46, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1009-1',
            method: 'ideal',
            customer: 'Gast 1',
            amount: parseFloat((132.96 * 0.3).toFixed(2)),
            tip: 2.50,
            status: 'completed',
            date: new Date(Date.now() - 70 * 60000)
          }]
        },
        'ORD-2025-1010': {
          id: 'ORD-2025-1010',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001010',
          tableNumber: 10,
          customer: 'Tafel 10',
          totalAmount: '167.97',
          paidAmount: (167.97 * 0.3).toFixed(2),
          remainingAmount: (167.97 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Equal',
          createdAt: new Date(Date.now() - 107 * 60000),
          items: [
            { name: 'Pizza Margherita', quantity: 2, unitPrice: 14.50, total: 29.00, paymentStatus: 'paid' },
            { name: 'Pizza Quattro', quantity: 1, unitPrice: 18.50, total: 18.50, paymentStatus: 'partial' },
            { name: 'Pasta Carbonara', quantity: 2, unitPrice: 16.50, total: 33.00, paymentStatus: 'pending' },
            { name: 'Tiramisu', quantity: 3, unitPrice: 8.50, total: 25.50, paymentStatus: 'pending' },
            { name: 'Espresso', quantity: 3, unitPrice: 3.99, total: 11.97, paymentStatus: 'paid' },
            { name: 'Limoncello', quantity: 3, unitPrice: 16.67, total: 50.00, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1010-1',
            method: 'creditcard',
            customer: 'Gast 1',
            amount: parseFloat((167.97 * 0.3).toFixed(2)),
            tip: 5.00,
            status: 'completed',
            date: new Date(Date.now() - 100 * 60000)
          }]
        },
        'ORD-2025-1011': {
          id: 'ORD-2025-1011',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001011',
          tableNumber: 11,
          customer: 'Tafel 11',
          totalAmount: '68.50',
          paidAmount: (68.50 * 0.3).toFixed(2),
          remainingAmount: (68.50 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 111 * 60000),
          items: [
            { name: 'Fish & Chips', quantity: 2, unitPrice: 18.50, total: 37.00, paymentStatus: 'partial' },
            { name: 'Caesar Salad', quantity: 1, unitPrice: 12.50, total: 12.50, paymentStatus: 'paid' },
            { name: 'Bier', quantity: 4, unitPrice: 4.75, total: 19.00, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1011-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((68.50 * 0.3).toFixed(2)),
            tip: 1.50,
            status: 'completed',
            date: new Date(Date.now() - 105 * 60000)
          }]
        },
        'ORD-2025-1016': {
          id: 'ORD-2025-1016',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001016',
          tableNumber: 16,
          customer: 'Tafel 16',
          totalAmount: '143.59',
          paidAmount: (143.59 * 0.3).toFixed(2),
          remainingAmount: (143.59 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 1 * 60000),
          items: [
            { name: 'Ribeye Steak', quantity: 2, unitPrice: 35.50, total: 71.00, paymentStatus: 'partial' },
            { name: 'Lobster Bisque', quantity: 2, unitPrice: 18.50, total: 37.00, paymentStatus: 'paid' },
            { name: 'Red Wine', quantity: 1, unitPrice: 35.59, total: 35.59, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1016-1',
            method: 'ideal',
            customer: 'Gast 1',
            amount: parseFloat((143.59 * 0.3).toFixed(2)),
            tip: 4.00,
            status: 'completed',
            date: new Date(Date.now() - 1 * 60000)
          }]
        },
        // Add more orders for other tables
        'ORD-2025-1017': {
          id: 'ORD-2025-1017',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001017',
          tableNumber: 17,
          customer: 'Tafel 17',
          totalAmount: '83.64',
          paidAmount: (83.64 * 0.3).toFixed(2),
          remainingAmount: (83.64 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 117 * 60000),
          items: [
            { name: 'Nachos', quantity: 1, unitPrice: 12.50, total: 12.50, paymentStatus: 'paid' },
            { name: 'Tacos', quantity: 4, unitPrice: 8.50, total: 34.00, paymentStatus: 'partial' },
            { name: 'Margarita', quantity: 3, unitPrice: 9.50, total: 28.50, paymentStatus: 'pending' },
            { name: 'Churros', quantity: 2, unitPrice: 4.32, total: 8.64, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1017-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((83.64 * 0.3).toFixed(2)),
            tip: 2.00,
            status: 'completed',
            date: new Date(Date.now() - 110 * 60000)
          }]
        },
        'ORD-2025-1018': {
          id: 'ORD-2025-1018',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001018',
          tableNumber: 18,
          customer: 'Tafel 18',
          totalAmount: '152.58',
          paidAmount: (152.58 * 0.3).toFixed(2),
          remainingAmount: (152.58 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 84 * 60000),
          items: [
            { name: 'Sushi Platter', quantity: 2, unitPrice: 45.00, total: 90.00, paymentStatus: 'partial' },
            { name: 'Edamame', quantity: 2, unitPrice: 6.50, total: 13.00, paymentStatus: 'paid' },
            { name: 'Sake', quantity: 2, unitPrice: 18.50, total: 37.00, paymentStatus: 'pending' },
            { name: 'Mochi', quantity: 3, unitPrice: 4.19, total: 12.58, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1018-1',
            method: 'creditcard',
            customer: 'Gast 1',
            amount: parseFloat((152.58 * 0.3).toFixed(2)),
            tip: 3.50,
            status: 'completed',
            date: new Date(Date.now() - 80 * 60000)
          }]
        },
        'ORD-2025-1020': {
          id: 'ORD-2025-1020',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001020',
          tableNumber: 20,
          customer: 'Tafel 20',
          totalAmount: '163.47',
          paidAmount: (163.47 * 0.3).toFixed(2),
          remainingAmount: (163.47 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Equal',
          createdAt: new Date(Date.now() - 50 * 60000),
          items: [
            { name: 'Chateaubriand', quantity: 1, unitPrice: 85.00, total: 85.00, paymentStatus: 'partial' },
            { name: 'Foie Gras', quantity: 1, unitPrice: 32.50, total: 32.50, paymentStatus: 'paid' },
            { name: 'Champagne', quantity: 1, unitPrice: 45.97, total: 45.97, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1020-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((163.47 * 0.3).toFixed(2)),
            tip: 8.00,
            status: 'completed',
            date: new Date(Date.now() - 45 * 60000)
          }]
        },
        'ORD-2025-1023': {
          id: 'ORD-2025-1023',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001023',
          tableNumber: 23,
          customer: 'Tafel 23',
          totalAmount: '153.98',
          paidAmount: (153.98 * 0.3).toFixed(2),
          remainingAmount: (153.98 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 18 * 60000),
          items: [
            { name: 'Mixed Grill', quantity: 3, unitPrice: 32.50, total: 97.50, paymentStatus: 'partial' },
            { name: 'Greek Salad', quantity: 2, unitPrice: 11.50, total: 23.00, paymentStatus: 'paid' },
            { name: 'Ouzo', quantity: 4, unitPrice: 6.50, total: 26.00, paymentStatus: 'pending' },
            { name: 'Baklava', quantity: 2, unitPrice: 3.74, total: 7.48, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1023-1',
            method: 'ideal',
            customer: 'Gast 1',
            amount: parseFloat((153.98 * 0.3).toFixed(2)),
            tip: 4.50,
            status: 'completed',
            date: new Date(Date.now() - 15 * 60000)
          }]
        },
        'ORD-2025-1025': {
          id: 'ORD-2025-1025',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001025',
          tableNumber: 25,
          customer: 'Tafel 25',
          totalAmount: '146.97',
          paidAmount: (146.97 * 0.3).toFixed(2),
          remainingAmount: (146.97 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 119 * 60000),
          items: [
            { name: 'BBQ Ribs', quantity: 2, unitPrice: 28.50, total: 57.00, paymentStatus: 'partial' },
            { name: 'Coleslaw', quantity: 3, unitPrice: 6.50, total: 19.50, paymentStatus: 'paid' },
            { name: 'Cornbread', quantity: 4, unitPrice: 4.50, total: 18.00, paymentStatus: 'pending' },
            { name: 'Beer', quantity: 6, unitPrice: 5.50, total: 33.00, paymentStatus: 'pending' },
            { name: 'Apple Pie', quantity: 3, unitPrice: 6.49, total: 19.47, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1025-1',
            method: 'cash',
            customer: 'Gast 1',
            amount: parseFloat((146.97 * 0.3).toFixed(2)),
            tip: 3.00,
            status: 'completed',
            date: new Date(Date.now() - 115 * 60000)
          }]
        },
        'ORD-2025-1026': {
          id: 'ORD-2025-1026',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001026',
          tableNumber: 26,
          customer: 'Tafel 26',
          totalAmount: '47.00',
          paidAmount: (47.00 * 0.3).toFixed(2),
          remainingAmount: (47.00 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 108 * 60000),
          items: [
            { name: 'Club Sandwich', quantity: 2, unitPrice: 12.50, total: 25.00, paymentStatus: 'partial' },
            { name: 'French Fries', quantity: 2, unitPrice: 5.50, total: 11.00, paymentStatus: 'paid' },
            { name: 'Iced Tea', quantity: 2, unitPrice: 5.50, total: 11.00, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1026-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((47.00 * 0.3).toFixed(2)),
            tip: 1.00,
            status: 'completed',
            date: new Date(Date.now() - 100 * 60000)
          }]
        },
        'ORD-2025-1027': {
          id: 'ORD-2025-1027',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001027',
          tableNumber: 27,
          customer: 'Tafel 27',
          totalAmount: '56.11',
          paidAmount: (56.11 * 0.3).toFixed(2),
          remainingAmount: (56.11 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 24 * 60000),
          items: [
            { name: 'Pad Thai', quantity: 2, unitPrice: 14.50, total: 29.00, paymentStatus: 'partial' },
            { name: 'Spring Rolls', quantity: 2, unitPrice: 7.50, total: 15.00, paymentStatus: 'paid' },
            { name: 'Thai Tea', quantity: 3, unitPrice: 4.04, total: 12.11, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1027-1',
            method: 'ideal',
            customer: 'Gast 1',
            amount: parseFloat((56.11 * 0.3).toFixed(2)),
            tip: 1.50,
            status: 'completed',
            date: new Date(Date.now() - 20 * 60000)
          }]
        },
        'ORD-2025-1028': {
          id: 'ORD-2025-1028',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001028',
          tableNumber: 28,
          customer: 'Tafel 28',
          totalAmount: '31.74',
          paidAmount: (31.74 * 0.3).toFixed(2),
          remainingAmount: (31.74 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 83 * 60000),
          items: [
            { name: 'Margherita Pizza', quantity: 1, unitPrice: 14.50, total: 14.50, paymentStatus: 'partial' },
            { name: 'Garlic Bread', quantity: 1, unitPrice: 6.50, total: 6.50, paymentStatus: 'paid' },
            { name: 'Coke', quantity: 3, unitPrice: 3.58, total: 10.74, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1028-1',
            method: 'creditcard',
            customer: 'Gast 1',
            amount: parseFloat((31.74 * 0.3).toFixed(2)),
            tip: 0.50,
            status: 'completed',
            date: new Date(Date.now() - 80 * 60000)
          }]
        },
        'ORD-2025-1029': {
          id: 'ORD-2025-1029',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001029',
          tableNumber: 29,
          customer: 'Tafel 29',
          totalAmount: '45.69',
          paidAmount: (45.69 * 0.3).toFixed(2),
          remainingAmount: (45.69 * 0.7).toFixed(2),
          status: 'partial',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 97 * 60000),
          items: [
            { name: 'Chicken Wings', quantity: 2, unitPrice: 11.50, total: 23.00, paymentStatus: 'partial' },
            { name: 'Onion Rings', quantity: 1, unitPrice: 7.50, total: 7.50, paymentStatus: 'paid' },
            { name: 'Beer', quantity: 3, unitPrice: 5.06, total: 15.19, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1029-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: parseFloat((45.69 * 0.3).toFixed(2)),
            tip: 1.00,
            status: 'completed',
            date: new Date(Date.now() - 90 * 60000)
          }]
        },
        // Recent payment orders matching the Recente Betalingen section
        'ORD-2025-1074': {
          id: 'ORD-2025-1074',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001074',
          tableNumber: 22,
          customer: 'Tafel 22',
          totalAmount: '89.90',
          paidAmount: '89.90',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Equal',
          createdAt: new Date(Date.now() - 32 * 60000),
          items: [
            { name: 'Ribeye Steak', quantity: 2, unitPrice: 32.50, total: 65.00, paymentStatus: 'paid' },
            { name: 'Groenten', quantity: 2, unitPrice: 8.95, total: 17.90, paymentStatus: 'paid' },
            { name: 'Dessert', quantity: 1, unitPrice: 7.00, total: 7.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: '#1074-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: 89.90,
            tip: 4.50,
            status: 'completed',
            date: new Date(Date.now() - 32 * 60000)
          }]
        },
        'ORD-2025-1075': {
          id: 'ORD-2025-1075',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001075',
          tableNumber: 3,
          customer: 'Tafel 3',
          totalAmount: '34.20',
          paidAmount: '34.20',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 25 * 60000),
          items: [
            { name: 'Sandwich Club', quantity: 1, unitPrice: 12.50, total: 12.50, paymentStatus: 'paid' },
            { name: 'Soep van de Dag', quantity: 1, unitPrice: 7.50, total: 7.50, paymentStatus: 'paid' },
            { name: 'Cappuccino', quantity: 2, unitPrice: 4.60, total: 9.20, paymentStatus: 'paid' },
            { name: 'Appeltaart', quantity: 1, unitPrice: 5.00, total: 5.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: '#1075-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: 34.20,
            tip: 2.00,
            status: 'completed',
            date: new Date(Date.now() - 25 * 60000)
          }]
        },
        'ORD-2025-1076': {
          id: 'ORD-2025-1076',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001076',
          tableNumber: 15,
          customer: 'Tafel 15',
          totalAmount: '67.80',
          paidAmount: '20.34',
          remainingAmount: '47.46',
          status: 'in_progress',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 18 * 60000),
          items: [
            { name: 'Pasta Arrabiata', quantity: 2, unitPrice: 15.50, total: 31.00, paymentStatus: 'partial' },
            { name: 'Pizza Salami', quantity: 1, unitPrice: 16.80, total: 16.80, paymentStatus: 'pending' },
            { name: 'Rode Wijn', quantity: 2, unitPrice: 7.50, total: 15.00, paymentStatus: 'pending' },
            { name: 'Tiramisu', quantity: 1, unitPrice: 5.00, total: 5.00, paymentStatus: 'pending' }
          ],
          payments: [{
            id: '#1076-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: 20.34,
            tip: 0,
            status: 'in_progress',
            date: new Date(Date.now() - 18 * 60000)
          }]
        },
        'ORD-2025-1077': {
          id: 'ORD-2025-1077',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001077',
          tableNumber: 8,
          customer: 'Tafel 8',
          totalAmount: '23.75',
          paidAmount: '23.75',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Equal',
          createdAt: new Date(Date.now() - 12 * 60000),
          items: [
            { name: 'Tosti Ham/Kaas', quantity: 2, unitPrice: 6.50, total: 13.00, paymentStatus: 'paid' },
            { name: 'Verse Jus', quantity: 1, unitPrice: 4.75, total: 4.75, paymentStatus: 'paid' },
            { name: 'Koffie', quantity: 2, unitPrice: 3.00, total: 6.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: '#1077-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: 23.75,
            tip: 1.25,
            status: 'completed',
            date: new Date(Date.now() - 12 * 60000)
          }]
        },
        'ORD-2025-1078': {
          id: 'ORD-2025-1078',
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: '30001078',
          tableNumber: 12,
          customer: 'Tafel 12',
          totalAmount: '45.50',
          paidAmount: '45.50',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 5 * 60000),
          items: [
            { name: 'Biefstuk', quantity: 1, unitPrice: 24.50, total: 24.50, paymentStatus: 'paid' },
            { name: 'Friet', quantity: 1, unitPrice: 4.50, total: 4.50, paymentStatus: 'paid' },
            { name: 'Salade', quantity: 1, unitPrice: 8.50, total: 8.50, paymentStatus: 'paid' },
            { name: 'Bier', quantity: 2, unitPrice: 4.00, total: 8.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: '#1078-1',
            method: 'splitty',
            customer: 'Gast 1',
            amount: 45.50,
            tip: 3.00,
            status: 'completed',
            date: new Date(Date.now() - 5 * 60000)
          }]
        }
      };
      
      // Get order from static data or create fallback
      const orderData = staticOrders[orderId];
      
      if (orderData) {
        console.log('Found order:', orderData);
        setOrder(orderData);
      } else {
        // Order not found, create a fallback order
        console.log('Order not found, creating fallback for:', orderId);
        
        const fallbackOrder = {
          id: orderId,
          restaurantId: id,
          restaurantName: 'Restaurant',
          posTransactionId: `3000${orderId.toString().padStart(7, '0')}`,
          tableNumber: ((parseInt(orderId) * 7) % 20) + 1,
          customer: `Tafel ${((parseInt(orderId) * 7) % 20) + 1}`,
          totalAmount: '75.50',
          paidAmount: '75.50',
          remainingAmount: '0.00',
          status: 'completed',
          splitMode: 'Items',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          items: [
            { name: 'Burger', quantity: 2, unitPrice: 15.50, total: 31.00, paymentStatus: 'paid' },
            { name: 'Friet', quantity: 2, unitPrice: 4.50, total: 9.00, paymentStatus: 'paid' },
            { name: 'Bier', quantity: 4, unitPrice: 3.50, total: 14.00, paymentStatus: 'paid' },
            { name: 'Dessert', quantity: 2, unitPrice: 7.50, total: 15.00, paymentStatus: 'paid' }
          ],
          payments: [{
            id: `#${orderId}`,
            method: 'card',
            customer: 'Gast',
            amount: 75.50,
            tip: 6.50,
            status: 'completed',
            date: new Date(Date.now() - 1 * 60 * 60 * 1000)
          }]
        };
        
        setOrder(fallbackOrder);
      }
    }
  }, [orderId, id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
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
                Order #{order.id.replace('ORD-2025-', '')}
                <span className="ml-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {order.status === 'completed' && (
                      <>
                        <CheckCircleIconSolid className="h-4 w-4 mr-1" />
                        Voltooid
                      </>
                    )}
                    {order.status === 'in_progress' && (
                      <>
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Actief
                      </>
                    )}
                    {order.status === 'partial' && (
                      <>
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5" />
                        Deels Betaald
                      </>
                    )}
                  </span>
                </span>
              </h1>
              <p className="text-[#6B7280]">{t('orders.details.subtitle')}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                {t('orders.details.refresh')}
              </button>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('orders.details.orderDetails')}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('orders.details.createdAt', { date: formatDate(order.createdAt) })}</p>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-medium">{order.restaurantName}</span>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.restaurantId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {order.restaurantId} ({order.restaurantName})
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.posTransactionId')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.posTransactionId}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.tableInfo')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{t('orders.tableNumber', { number: order.tableNumber })}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.customer')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.customer}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.totalAmount')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium">€{order.totalAmount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.paidAmount')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-medium text-green-600">€{order.paidAmount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.remainingAmount')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">€{order.remainingAmount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.status')}</dt>
                  <dd className="mt-1 sm:mt-0 sm:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.status === 'completed' && (
                        <>
                          <CheckCircleIconSolid className="h-4 w-4 mr-1" />
                          {t('orders.status.completed')}
                        </>
                      )}
                      {order.status === 'in_progress' && (
                        <>
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {t('orders.status.inProgress')}
                        </>
                      )}
                      {order.status === 'partial' && (
                        <>
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-1.5" />
                          {t('orders.status.partial')}
                        </>
                      )}
                    </span>
                    {order.completedAt && (
                      <p className="text-sm text-gray-500 mt-1">{t('orders.details.completedOn', { date: formatDate(order.completedAt) })}</p>
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{t('orders.details.splitMode')}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.splitMode}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('orders.details.orderItems')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('orders.details.itemsInOrder', { count: order.items.length })}</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.item')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.quantity')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.unitPrice')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.total')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.paymentStatus')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{item.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : item.paymentStatus === 'partial'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.paymentStatus === 'paid' ? t('orders.details.betaald') : item.paymentStatus === 'partial' ? t('orders.status.partial') : t('orders.status.pending')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{t('orders.details.payments')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('orders.details.paymentsForOrder', { count: order.payments.length })}</p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.id')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.method')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.customer')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('orders.details.date')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.payments.map((payment, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{payment.amount.toFixed(2)}
                          {payment.tip && (
                            <span className="text-xs text-gray-400 block">
                              {t('orders.details.tip')}: €{payment.tip.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t('orders.status.completed')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default OrderDetails
