import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    category: {
        id: number;
        name: string;
    };
}

interface CartItem {
    product_id: number;
    product: Product;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Props {
    products: Product[];
    [key: string]: unknown;
}

export default function CreateSale({ products }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
    const [taxRate] = useState(0.08); // 8% tax rate

    const { data, setData, post, processing } = useForm({
        items: [] as Array<{
            product_id: number;
            quantity: number;
            unit_price: number;
            total_price: number;
        }>,
        subtotal: 0,
        tax_amount: 0,
        discount_amount: 0,
        total: 0,
        amount_paid: 0,
        change_amount: 0,
        payment_method: 'cash' as 'cash' | 'card' | 'digital',
        notes: '',
    });

    const addToCart = () => {
        if (!selectedProductId) return;

        const product = products.find(p => p.id === Number(selectedProductId));
        if (!product) return;

        const existingItemIndex = cart.findIndex(item => item.product_id === product.id);
        
        if (existingItemIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += 1;
            updatedCart[existingItemIndex].total_price = 
                updatedCart[existingItemIndex].quantity * updatedCart[existingItemIndex].unit_price;
            setCart(updatedCart);
        } else {
            const newItem: CartItem = {
                product_id: product.id,
                product,
                quantity: 1,
                unit_price: product.price,
                total_price: product.price,
            };
            setCart([...cart, newItem]);
        }
        
        setSelectedProductId('');
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const updatedCart = cart.map(item => {
            if (item.product_id === productId) {
                const product = products.find(p => p.id === productId);
                if (product && newQuantity <= product.stock_quantity) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        total_price: newQuantity * item.unit_price,
                    };
                }
            }
            return item;
        });
        setCart(updatedCart);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product_id !== productId));
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount - data.discount_amount;
        
        return { subtotal, taxAmount, total };
    };

    const { subtotal, taxAmount, total } = calculateTotals();

    const handleAmountPaidChange = (amount: number) => {
        const changeAmount = amount - total;
        setData(prev => ({
            ...prev,
            amount_paid: amount,
            change_amount: changeAmount >= 0 ? changeAmount : 0,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Please add items to the cart before processing the sale.');
            return;
        }

        if (data.amount_paid < total) {
            alert('Amount paid must be at least the total amount.');
            return;
        }

        // Update form data before submission
        setData({
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
            })),
            subtotal,
            tax_amount: taxAmount,
            discount_amount: data.discount_amount,
            total,
            amount_paid: data.amount_paid,
            change_amount: data.amount_paid - total,
            payment_method: data.payment_method,
            notes: data.notes,
        });

        post(route('sales.store'), {
            onSuccess: () => {
                setCart([]);
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <AppShell>
            <Head title="New Sale" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Sale</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Process a new transaction</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Product Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Products</h2>
                            
                            <div className="flex gap-4 mb-6">
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Select a product...</option>
                                    {products.filter(p => p.stock_quantity > 0).map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - {formatCurrency(product.price)} (Stock: {product.stock_quantity})
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={addToCart}
                                    disabled={!selectedProductId}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                Cart Items ({cart.length})
                            </h2>
                            
                            {cart.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Cart is empty. Add some products to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {formatCurrency(item.unit_price)} each
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                                >
                                                    -
                                                </button>
                                                
                                                <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                                                    {item.quantity}
                                                </span>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.product.stock_quantity}
                                                    className="w-8 h-8 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    +
                                                </button>
                                                
                                                <div className="w-20 text-right font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(item.total_price)}
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary & Payment */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Summary</h2>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax (8%):</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(taxAmount)}
                                    </span>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span className="text-gray-900 dark:text-white">Total:</span>
                                        <span className="text-gray-900 dark:text-white">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value as 'cash' | 'card' | 'digital')}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="cash">💵 Cash</option>
                                        <option value="card">💳 Card</option>
                                        <option value="digital">📱 Digital</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Amount Paid
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={total}
                                        value={data.amount_paid || ''}
                                        onChange={(e) => handleAmountPaidChange(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                {data.change_amount > 0 && (
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                                Change:
                                            </span>
                                            <span className="text-lg font-bold text-green-700 dark:text-green-300">
                                                {formatCurrency(data.change_amount)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="Add any notes about this sale..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || cart.length === 0 || data.amount_paid < total}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : '💳 Complete Sale'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}