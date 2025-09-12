interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  total: number;
  status: 'active' | 'completed' | 'cancelled';
  splitType?: 'equal' | 'items' | 'custom';
  payments?: Payment[];
  timestamp: string;
  waiter?: string;
}

// Fixed static orders data - NEVER CHANGES
// Most recent orders appear first (sorted by time)
export const staticOrdersData: Order[] = [
  // 3 uur geleden
  { id: 'SP161961', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 9', guests: '1/2', total: 146.99, paid: 117.90, remaining: 29.09, status: 'in_progress', time: '3 uur geleden', progress: 80.21, paymentId: '#161961', orderId: '161961' },
  
  // 5 uur geleden
  { id: 'SP103257', restaurant: 'Restaurant Stefan', restaurantId: 10, table: 'Tafel 12', guests: '1/3', total: 193.86, paid: 65.86, remaining: 128.00, status: 'in_progress', time: '5 uur geleden', progress: 33.97, paymentId: '#103257', orderId: '103257' },
  
  // 6 uur geleden
  { id: 'SP165318', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 8', guests: '0/5', total: 56.85, paid: 10.81, remaining: 46.04, status: 'in_progress', time: '6 uur geleden', progress: 19.02, paymentId: '#165318', orderId: '165318' },
  
  // 7 uur geleden
  { id: 'SP11120', restaurant: 'Aldenaire catering', restaurantId: 11, table: 'Tafel 6', guests: '3/6', total: 147.50, paid: 77.69, remaining: 69.81, status: 'in_progress', time: '7 uur geleden', progress: 52.67, paymentId: '#11120', orderId: '11120' },
  { id: 'SP64809', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 7', guests: '0/2', total: 84.95, paid: 0.77, remaining: 84.18, status: 'in_progress', time: '7 uur geleden', progress: 0.90, paymentId: '#64809', orderId: '64809' },
  { id: 'SP70830', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 16', guests: '0/2', total: 185.44, paid: 60.93, remaining: 124.51, status: 'in_progress', time: '7 uur geleden', progress: 32.85, paymentId: '#70830', orderId: '70830' },
  
  // 8 uur geleden
  { id: 'SP77814', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 14', guests: '3/6', total: 67.57, paid: 36.34, remaining: 31.23, status: 'in_progress', time: '8 uur geleden', progress: 53.79, paymentId: '#77814', orderId: '77814' },
  
  // 9 uur geleden
  { id: 'SP170674', restaurant: 'Anatolii Restaurant', restaurantId: 17, table: 'Tafel 1', guests: '1/6', total: 58.04, paid: 18.73, remaining: 39.31, status: 'in_progress', time: '9 uur geleden', progress: 32.27, paymentId: '#170674', orderId: '170674' },
  
  // 11 uur geleden
  { id: 'SP150457', restaurant: 'Loetje', restaurantId: 15, table: 'Tafel 17', guests: '1/2', total: 75.23, paid: 55.02, remaining: 20.21, status: 'in_progress', time: '11 uur geleden', progress: 73.14, paymentId: '#150457', orderId: '150457' },
  
  // 13 uur geleden
  { id: 'SP17395', restaurant: 'Anatolii Restaurant', restaurantId: 17, table: 'Tafel 11', guests: '0/3', total: 213.81, paid: 48.44, remaining: 165.37, status: 'in_progress', time: '13 uur geleden', progress: 22.65, paymentId: '#17395', orderId: '17395' },
  
  // 15 uur geleden
  { id: 'SP73226', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 10', guests: '0/6', total: 193.36, paid: 21.44, remaining: 171.92, status: 'in_progress', time: '15 uur geleden', progress: 11.09, paymentId: '#73226', orderId: '73226' },
  { id: 'SP102956', restaurant: 'Restaurant Stefan', restaurantId: 10, table: 'Tafel 19', guests: '0/5', total: 136.70, paid: 8.81, remaining: 127.89, status: 'in_progress', time: '15 uur geleden', progress: 6.44, paymentId: '#102956', orderId: '102956' },
  { id: 'SP16430', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 6', guests: '0/4', total: 161.41, paid: 31.02, remaining: 130.39, status: 'in_progress', time: '15 uur geleden', progress: 19.22, paymentId: '#16430', orderId: '16430' },
  
  // 16 uur geleden
  { id: 'SP163988', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 6', guests: '4/7', total: 110.53, paid: 69.56, remaining: 40.97, status: 'in_progress', time: '16 uur geleden', progress: 62.94, paymentId: '#163988', orderId: '163988' },
  { id: 'SP7245', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 6', guests: '1/2', total: 100.54, paid: 90.47, remaining: 10.07, status: 'in_progress', time: '16 uur geleden', progress: 89.99, paymentId: '#7245', orderId: '7245' },
  
  // 17 uur geleden
  { id: 'SP63760', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 7', guests: '2/6', total: 147.88, paid: 72.44, remaining: 75.44, status: 'in_progress', time: '17 uur geleden', progress: 48.99, paymentId: '#63760', orderId: '63760' },
  
  // 19 uur geleden
  { id: 'SP71148', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 9', guests: '5/6', total: 131.17, paid: 119.40, remaining: 11.77, status: 'in_progress', time: '19 uur geleden', progress: 91.03, paymentId: '#71148', orderId: '71148' },
  { id: 'SP162796', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 3', guests: '0/4', total: 141.97, paid: 17.93, remaining: 124.04, status: 'in_progress', time: '19 uur geleden', progress: 12.63, paymentId: '#162796', orderId: '162796' },
  
  // 21 uur geleden
  { id: 'SP74682', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 4', guests: '0/4', total: 116.96, paid: 7.79, remaining: 109.17, status: 'in_progress', time: '21 uur geleden', progress: 6.66, paymentId: '#74682', orderId: '74682' },
  
  // 23 uur geleden
  { id: 'SP110127', restaurant: 'Aldenaire catering', restaurantId: 11, table: 'Tafel 3', guests: '2/3', total: 119.94, paid: 116.43, remaining: 3.51, status: 'in_progress', time: '23 uur geleden', progress: 97.07, paymentId: '#110127', orderId: '110127' },
  { id: 'SP60144', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 11', guests: '4/5', total: 149.88, paid: 133.63, remaining: 16.25, status: 'in_progress', time: '23 uur geleden', progress: 89.16, paymentId: '#60144', orderId: '60144' },
  
  // 1 dagen geleden
  { id: 'SP171333', restaurant: 'Anatolii Restaurant', restaurantId: 17, table: 'Tafel 15', guests: '1/2', total: 216.00, paid: 182.52, remaining: 33.48, status: 'in_progress', time: '1 dagen geleden', progress: 84.50, paymentId: '#171333', orderId: '171333' },
  { id: 'SP7643', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 4', guests: '0/4', total: 82.31, paid: 16.78, remaining: 65.53, status: 'in_progress', time: '1 dagen geleden', progress: 20.39, paymentId: '#7643', orderId: '7643' },
  { id: 'SP65935', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 4', guests: '1/3', total: 207.66, paid: 122.52, remaining: 85.14, status: 'in_progress', time: '1 dagen geleden', progress: 59.00, paymentId: '#65935', orderId: '65935' },
  { id: 'SP15219', restaurant: 'Loetje', restaurantId: 15, table: 'Tafel 20', guests: '3/7', total: 57.68, paid: 31.83, remaining: 25.85, status: 'in_progress', time: '1 dagen geleden', progress: 55.18, paymentId: '#15219', orderId: '15219' },
  { id: 'SP153479', restaurant: 'Loetje', restaurantId: 15, table: 'Tafel 5', guests: '0/3', total: 209.12, paid: 41.72, remaining: 167.40, status: 'in_progress', time: '1 dagen geleden', progress: 19.95, paymentId: '#153479', orderId: '153479' },
  { id: 'SP75618', restaurant: 'Viresh Kewalbansing', restaurantId: 7, table: 'Tafel 9', guests: '1/3', total: 204.96, paid: 86.89, remaining: 118.07, status: 'in_progress', time: '1 dagen geleden', progress: 42.39, paymentId: '#75618', orderId: '75618' },
  { id: 'SP151606', restaurant: 'Loetje', restaurantId: 15, table: 'Tafel 5', guests: '5/7', total: 140.28, paid: 116.77, remaining: 23.51, status: 'in_progress', time: '1 dagen geleden', progress: 83.25, paymentId: '#151606', orderId: '151606' },
  { id: 'SP100823', restaurant: 'Restaurant Stefan', restaurantId: 10, table: 'Tafel 12', guests: '0/3', total: 46.57, paid: 11.72, remaining: 34.85, status: 'in_progress', time: '1 dagen geleden', progress: 25.17, paymentId: '#100823', orderId: '100823' },
  { id: 'SP6113', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 8', guests: '1/2', total: 86.01, paid: 83.26, remaining: 2.75, status: 'in_progress', time: '1 dagen geleden', progress: 96.80, paymentId: '#6113', orderId: '6113' },
  { id: 'SP112671', restaurant: 'Aldenaire catering', restaurantId: 11, table: 'Tafel 20', guests: '3/7', total: 82.52, paid: 37.97, remaining: 44.55, status: 'in_progress', time: '1 dagen geleden', progress: 46.02, paymentId: '#112671', orderId: '112671' },
  { id: 'SP104998', restaurant: 'Restaurant Stefan', restaurantId: 10, table: 'Tafel 6', guests: '1/4', total: 92.51, paid: 29.23, remaining: 63.28, status: 'in_progress', time: '1 dagen geleden', progress: 31.60, paymentId: '#104998', orderId: '104998' },
  { id: 'SP62984', restaurant: 'Limon B.V.', restaurantId: 6, table: 'Tafel 16', guests: '0/2', total: 189.70, paid: 81.15, remaining: 108.55, status: 'in_progress', time: '1 dagen geleden', progress: 42.78, paymentId: '#62984', orderId: '62984' },
  { id: 'SP160149', restaurant: 'Splitty', restaurantId: 16, table: 'Tafel 15', guests: '0/2', total: 123.28, paid: 58.51, remaining: 64.77, status: 'in_progress', time: '1 dagen geleden', progress: 47.46, paymentId: '#160149', orderId: '160149' },
  { id: 'SP101775', restaurant: 'Restaurant Stefan', restaurantId: 10, table: 'Tafel 19', guests: '1/2', total: 216.40, paid: 136.38, remaining: 80.02, status: 'in_progress', time: '1 dagen geleden', progress: 63.02, paymentId: '#101775', orderId: '101775' },
  { id: 'SP172752', restaurant: 'Anatolii Restaurant', restaurantId: 17, table: 'Tafel 12', guests: '1/3', total: 41.43, paid: 27.34, remaining: 14.09, status: 'in_progress', time: '1 dagen geleden', progress: 65.99, paymentId: '#172752', orderId: '172752' }
]

export default staticOrdersData
