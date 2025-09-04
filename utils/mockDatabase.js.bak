// Centralized Mock Database for Splitty Orders
// This ensures consistent data across all pages

class MockDatabase {
  constructor() {
    this.orders = new Map();
    this.payments = new Map();
    this.initializeData();
  }

  initializeData() {
    // Restaurant data
    const restaurants = [
      { id: 1, name: 'Anatolii Restaurant' },
      { id: 2, name: 'Loetje' },
      { id: 3, name: 'The Harbour Club' },
      { id: 4, name: 'Café de Reiger' },
      { id: 5, name: 'Restaurant Greetje' },
      { id: 7, name: 'Brasserie Bark' },
      { id: 10, name: 'De Kas' },
      { id: 11, name: 'Ciel Bleu' },
      { id: 15, name: 'Restaurant Flore' },
      { id: 17, name: 'Yamazato' }
    ];

    // Menu items with prices
    const menuItems = {
      'Cappuccino': 3.90,
      'Latte': 4.20,
      'Espresso': 2.50,
      'Thee': 3.00,
      'Croissant': 3.50,
      'Sandwich': 8.50,
      'Tosti': 6.50,
      'Salade': 12.00,
      'Pizza Margherita': 14.50,
      'Pizza Pepperoni': 16.00,
      'Pasta Carbonara': 16.00,
      'Pasta Bolognese': 15.00,
      'Burger': 15.50,
      'Steak': 28.00,
      'Vis van de Dag': 24.00,
      'Kip': 18.50,
      'Soep': 6.50,
      'Friet': 4.50,
      'Groenten': 5.00,
      'Wijn (glas)': 5.50,
      'Bier': 3.50,
      'Cola': 3.00,
      'Water': 2.50,
      'Dessert': 7.50,
      'IJs': 4.50
    };

    // Generate consistent orders and payments
    const orderIds = [
      1001, 1002, 1003, 1004, 1005,
      2001, 2002, 2003,
      3001, 3002,
      115500, 102710, 151513
    ];

    orderIds.forEach((orderId, index) => {
      const restaurantIndex = index % restaurants.length;
      const restaurant = restaurants[restaurantIndex];
      const tableNumber = ((orderId * 7) % 20) + 1;
      
      // Select items for this order
      const itemKeys = Object.keys(menuItems);
      const numItems = ((orderId * 3) % 4) + 2;
      const orderItems = [];
      let totalAmount = 0;
      
      for (let i = 0; i < numItems; i++) {
        const itemIndex = (orderId * (i + 1)) % itemKeys.length;
        const itemName = itemKeys[itemIndex];
        const quantity = ((orderId + i) % 3) + 1;
        const unitPrice = menuItems[itemName];
        const total = unitPrice * quantity;
        totalAmount += total;
        
        orderItems.push({
          name: itemName,
          quantity,
          unitPrice,
          total,
          paymentStatus: 'paid'
        });
      }

      // Determine order status
      const statuses = ['completed', 'in_progress', 'partial'];
      const status = statuses[orderId % statuses.length];
      
      let remainingAmount = 0;
      let paidAmount = totalAmount;
      
      if (status === 'in_progress') {
        paidAmount = totalAmount * 0.3;
        remainingAmount = totalAmount * 0.7;
      } else if (status === 'partial') {
        paidAmount = totalAmount * 0.6;
        remainingAmount = totalAmount * 0.4;
      }

      const now = Date.now();
      const createdAt = new Date(now - (orderId % 7) * 24 * 60 * 60 * 1000);
      const completedAt = status === 'completed' ? new Date(now - ((orderId % 6) + 1) * 60 * 60 * 1000) : null;

      // Create order record
      const order = {
        id: orderId.toString(),
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        posTransactionId: `3000${orderId.toString().padStart(7, '0')}`,
        tableNumber,
        customer: `Tafel ${tableNumber}`,
        totalAmount: totalAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        remainingAmount: remainingAmount.toFixed(2),
        status,
        splitMode: ['Items', 'Equal', 'Custom'][orderId % 3],
        createdAt,
        completedAt,
        items: orderItems,
        payments: []
      };

      // Create associated payments
      const numPayments = status === 'completed' ? ((orderId % 2) + 1) : 1;
      for (let p = 0; p < numPayments; p++) {
        const paymentId = `${orderId}${p}`;
        const paymentAmount = paidAmount / numPayments;
        const tip = ((orderId + p) % 5) > 2 ? (paymentAmount * 0.1) : 0;
        const fee = 0.30 + (paymentAmount * 0.029);
        const netAmount = paymentAmount + tip - fee;

        const payment = {
          id: paymentId,
          orderId: orderId.toString(),
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          tableNumber,
          customer: {
            name: `Gast ${((orderId + p) * 13) % 100}`,
            email: ((orderId + p) % 2) === 0 ? `gast${((orderId + p) * 13) % 100}@splitty.nl` : null,
            phone: ((orderId + p) % 3) === 0 ? `+316${((orderId + p) * 12345678 % 100000000).toString().padStart(8, '0')}` : null
          },
          method: ['card', 'ideal', 'apple_pay', 'google_pay'][(orderId + p) % 4],
          cardDetails: null,
          amount: paymentAmount.toFixed(2),
          tip: tip > 0 ? tip.toFixed(2) : null,
          fee: fee.toFixed(2),
          netAmount: netAmount.toFixed(2),
          status: status === 'completed' ? 'completed' : 'pending',
          splitType: ['Betaal voor Items', 'Gelijk Verdelen', 'Aangepast Bedrag'][orderId % 3],
          stripePaymentId: `pi_${paymentId}_${Date.now().toString(36)}`,
          stripeChargeId: `ch_${paymentId}_${Date.now().toString(36)}`,
          posTransactionId: `3000${orderId.toString().padStart(7, '0')}`,
          itemsPaid: orderItems.slice(0, Math.min(2, orderItems.length)).map(item => item.name),
          createdAt: new Date(createdAt.getTime() + p * 60000),
          completedAt: completedAt ? new Date(completedAt.getTime() + p * 60000) : null
        };

        // Add card details if card payment
        if (payment.method === 'card') {
          const cardBrands = ['Visa', 'Mastercard', 'Amex', 'Discover'];
          payment.cardDetails = {
            brand: cardBrands[(orderId + p) % cardBrands.length],
            last4: ((orderId * 1234 + p) % 10000).toString().padStart(4, '0'),
            expMonth: ((orderId + p) % 12) + 1,
            expYear: 2025 + ((orderId + p) % 3)
          };
        }

        this.payments.set(paymentId, payment);
        order.payments.push({
          id: `#${paymentId}`,
          method: payment.method,
          customer: payment.customer.name,
          amount: parseFloat(payment.amount),
          tip: payment.tip ? parseFloat(payment.tip) : 0,
          status: payment.status,
          date: payment.createdAt
        });
      }

      this.orders.set(orderId.toString(), order);
    });
  }

  getOrder(orderId) {
    // Try both string and number versions
    let order = this.orders.get(orderId.toString());
    if (!order) {
      order = this.orders.get(orderId);
    }
    return order;
  }

  getPayment(paymentId) {
    // Try both string and number versions
    let payment = this.payments.get(paymentId.toString());
    if (!payment) {
      payment = this.payments.get(paymentId);
    }
    return payment;
  }

  getAllOrders() {
    return Array.from(this.orders.values());
  }

  getAllPayments() {
    return Array.from(this.payments.values());
  }

  getOrdersByRestaurant(restaurantId) {
    return Array.from(this.orders.values()).filter(order => 
      order.restaurantId === parseInt(restaurantId)
    );
  }

  getPaymentsByRestaurant(restaurantId) {
    return Array.from(this.payments.values()).filter(payment => 
      payment.restaurantId === parseInt(restaurantId)
    );
  }

  // Get live orders for restaurant profile
  getLiveOrdersForRestaurant(restaurantId) {
    const orders = this.getOrdersByRestaurant(restaurantId);
    return orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(order => {
        const minutesAgo = Math.floor((Date.now() - order.createdAt) / 60000);
        return {
          id: order.id,
          table: order.tableNumber,
          amount: parseFloat(order.paidAmount),
          status: order.status,
          time: minutesAgo < 60 ? `${minutesAgo} min` : `${Math.floor(minutesAgo / 60)} uur`,
          items: order.items.map(i => i.name).join(', ')
        };
      });
  }

  // Generate Splitty transactions for global orders page
  getAllSplittyTransactions() {
    const transactions = [];
    
    this.orders.forEach(order => {
      const payments = Array.from(this.payments.values()).filter(p => p.orderId === order.id);
      
      payments.forEach(payment => {
        transactions.push({
          id: `SP${payment.id}`,
          restaurant: order.restaurantName,
          restaurantId: order.restaurantId,
          orderId: order.id,
          paymentId: payment.id,
          table: `Tafel ${order.tableNumber}`,
          total: parseFloat(order.totalAmount),
          paid: parseFloat(payment.amount),
          remaining: parseFloat(order.remainingAmount),
          guests: Math.floor(Math.random() * 6) + 2,
          paidGuests: Math.floor(Math.random() * 4) + 1,
          status: payment.status,
          created: payment.createdAt,
          paymentMethod: payment.method
        });
      });
    });
    
    return transactions.sort((a, b) => b.created - a.created);
  }
}

// Create singleton instance
const mockDB = new MockDatabase();

// Log available orders and payments for debugging
console.log('Mock Database initialized with orders:', Array.from(mockDB.orders.keys()));
console.log('Mock Database initialized with payments:', Array.from(mockDB.payments.keys()));

export default mockDB;