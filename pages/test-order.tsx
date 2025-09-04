import type { NextPage } from 'next'
import { useState } from 'react'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useTranslation } from '../contexts/TranslationContext'
import {
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  TrashIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
  HashtagIcon,
  ClockIcon,
  CurrencyEuroIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const TestOrder: NextPage = () => {
  const { t } = useTranslation()
  const [selectedRestaurant, setSelectedRestaurant] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('starters')

  const restaurants = [
    { id: 6, name: 'Limon B.V.' },
    { id: 7, name: 'Viresh Kewalbansing' },
    { id: 10, name: 'Restaurant Stefan' },
    { id: 11, name: 'Aldenaire catering' },
    { id: 15, name: 'Loetje' },
    { id: 16, name: 'Splitty' },
    { id: 17, name: 'Anatolii Restaurant' },
  ]

  const menuCategories = {
    starters: t('testOrder.menu.starters'),
    mains: t('testOrder.menu.mains'),
    desserts: t('testOrder.menu.desserts'),
    drinks: t('testOrder.menu.drinks'),
  }

  const menuItems = {
    starters: [
      { id: 1, name: 'Caesar Salade', price: 8.50, description: 'Knapperige romeinse sla, parmezaan, croutons' },
      { id: 2, name: 'Bruschetta', price: 7.00, description: 'Geroosterd brood met tomaten en basilicum' },
      { id: 3, name: 'Soep van de Dag', price: 6.50, description: 'Chef\'s speciale soep' },
      { id: 4, name: 'Knoflookbrood', price: 5.00, description: 'Vers gebakken met knoflookboter' },
    ],
    mains: [
      { id: 5, name: 'Gegrilde Zalm', price: 24.50, description: 'Atlantische zalm met seizoensgroenten' },
      { id: 6, name: 'Ribeye Steak', price: 32.00, description: '300g grasgevoerd rundvlees met friet' },
      { id: 7, name: 'Chicken Parmesan', price: 18.50, description: 'Gepaneerde kip met marinara en kaas' },
      { id: 8, name: 'Vegetarische Pasta', price: 16.00, description: 'Verse pasta met geroosterde groenten' },
    ],
    desserts: [
      { id: 9, name: 'Tiramisu', price: 7.50, description: 'Klassiek Italiaans dessert' },
      { id: 10, name: 'Chocolade Taart', price: 8.00, description: 'Rijke chocolade met vanille-ijs' },
      { id: 11, name: 'Cheesecake', price: 7.00, description: 'New York style met bessensaus' },
    ],
    drinks: [
      { id: 12, name: 'Coca Cola', price: 3.50, description: '330ml' },
      { id: 13, name: 'Verse Jus d\'Orange', price: 4.50, description: '250ml' },
      { id: 14, name: 'Koffie', price: 3.00, description: 'Espresso, Americano, of Cappuccino' },
      { id: 15, name: 'Bier', price: 5.00, description: 'Van de tap of flesje' },
      { id: 16, name: 'Huiswijn', price: 6.50, description: 'Rood of Wit, per glas' },
    ],
  }

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      )
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      }).filter(Boolean)
    )
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    if (!selectedRestaurant || !tableNumber || cart.length === 0) {
      alert(t('testOrder.validation.fillAllFields'))
      return
    }
    
    const orderData = {
      restaurant: selectedRestaurant,
      table: tableNumber,
      items: cart,
      total: getTotal(),
    }
    
    console.log('Submitting test order:', orderData)
    alert(t('testOrder.validation.orderSent'))
    
    // Reset form
    setCart([])
    setTableNumber('')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: t('testOrder.title') }]} />

            {/* Header with Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                  {t('testOrder.title')}
                </h1>
                <p className="text-[#6B7280]">
                  {t('testOrder.subtitle')}
                </p>
              </div>
              <div className="flex items-center px-4 py-2 rounded-lg bg-green-50 border border-green-200">
                <SparklesIcon className="h-5 w-5 mr-2 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {t('testOrder.testModeActive')}
                </span>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4 w-full">
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    selectedRestaurant ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <BuildingStorefrontIcon className="h-5 w-5" />
                  </div>
                  <div className={`flex-1 h-1 mx-3 ${
                    selectedRestaurant && tableNumber ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                </div>
                <div className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    tableNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <HashtagIcon className="h-5 w-5" />
                  </div>
                  <div className={`flex-1 h-1 mx-3 ${
                    cart.length > 0 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                </div>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    cart.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <ShoppingCartIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-xl border transition-all ${
                selectedRestaurant 
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start">
                  <BuildingStorefrontIcon className={`h-6 w-6 mt-0.5 ${
                    selectedRestaurant 
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`} />
                  <div className="ml-3 flex-1">
                    <label className="block text-sm font-medium mb-2 text-gray-900">{t('testOrder.form.selectRestaurant')}</label>
                    <select
                      value={selectedRestaurant}
                      onChange={(e) => setSelectedRestaurant(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 focus:ring-green-500"
                    >
                      <option value="">{t('testOrder.form.chooseRestaurant')}</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-all ${
                tableNumber 
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start">
                  <HashtagIcon className={`h-6 w-6 mt-0.5 ${
                    tableNumber 
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`} />
                  <div className="ml-3 flex-1">
                    <label className="block text-sm font-medium mb-2 text-gray-900">{t('testOrder.form.tableNumber')}</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder={t('testOrder.form.tableNumberPlaceholder')}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Section */}
              <div className="lg:col-span-2 space-y-6">

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(menuCategories).map(([key, label]) => {
                    const icons = {
                      starters: SparklesIcon,
                      mains: FireIcon,
                      desserts: StarIcon,
                      drinks: CurrencyEuroIcon
                    }
                    const Icon = icons[key]
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          activeCategory === key
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-1.5" />
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 gap-3">
                  {menuItems[activeCategory].map((item) => {
                    const itemInCart = cart.find(cartItem => cartItem.id === item.id)
                    const quantity = itemInCart ? itemInCart.quantity : 0
                    
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl p-4 border transition-all bg-white border-gray-200 hover:border-green-300 hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-medium text-base text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-sm mt-0.5 text-gray-500">
                                  {item.description}
                                </p>
                              </div>
                              <span className="font-bold text-lg ml-4 text-green-600">
                                €{item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end mt-3 space-x-2">
                          {quantity > 0 ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 rounded-lg transition-all bg-gray-100 hover:bg-red-50 text-gray-700 border border-gray-200"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="w-12 text-center font-medium text-gray-900">
                                {quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 rounded-lg transition-all bg-green-600 hover:bg-green-700 text-white"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all bg-green-600 hover:bg-green-700 text-white"
                            >
                              <PlusIcon className="h-4 w-4 mr-1.5" />
                              {t('testOrder.actions.add')}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="lg:col-span-1">
                <div className="rounded-xl sticky top-4 overflow-hidden bg-white shadow-lg">
                  {/* Cart Header */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-white">
                          <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">
                            {t('testOrder.cart.title')}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {cart.reduce((sum, item) => sum + item.quantity, 0)} {t('testOrder.cart.items')}
                          </p>
                        </div>
                      </div>
                      {cart.length > 0 && (
                        <button
                          onClick={() => setCart([])}
                          className="text-xs px-2 py-1 rounded transition text-red-600 hover:bg-red-50"
                        >
                          {t('testOrder.actions.clearCart')}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 bg-gray-100">
                          <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          {t('testOrder.cart.selectItems')}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="rounded-lg p-3 transition-all bg-gray-50 hover:bg-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-xs mt-0.5 text-gray-500">
                                  €{item.price.toFixed(2)} {t('testOrder.cart.perItem')}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 rounded transition text-red-500 hover:bg-red-50"
                              >
                                <TrashIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1 rounded transition bg-white border border-gray-200 hover:bg-gray-50"
                                >
                                  <MinusIcon className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1 rounded transition bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <PlusIcon className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-bold text-green-600">
                                €{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      {/* Order Summary */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('testOrder.orderSummary.subtotal')}</span>
                          <span className="text-gray-900">
                            €{getTotal().toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t('testOrder.orderSummary.serviceFee')}</span>
                          <span className="text-gray-900">
                            €{(getTotal() * 0.03).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="font-semibold text-gray-900">
                            {t('testOrder.orderSummary.total')}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            €{(getTotal() * 1.03).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmitOrder}
                        disabled={!selectedRestaurant || !tableNumber}
                        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                          !selectedRestaurant || !tableNumber
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                        }`}
                      >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        {t('testOrder.form.createOrder')}
                      </button>
                      
                      {(!selectedRestaurant || !tableNumber) && (
                        <p className="text-xs text-center mt-2 text-red-600">
                          {!selectedRestaurant ? t('testOrder.validation.selectRestaurant') : t('testOrder.validation.enterTableNumber')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Test Info Card */}
                <div className="mt-4 p-4 rounded-xl border bg-blue-50 border-blue-200">
                  <div className="flex items-start">
                    <ClockIcon className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium mb-1 text-blue-900">{t('testOrder.testModeInfo.title')}</h4>
                      <p className="text-xs text-blue-700">
                        {t('testOrder.testModeInfo.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default TestOrder
