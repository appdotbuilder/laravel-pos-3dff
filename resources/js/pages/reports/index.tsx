import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface DailySale {
    date: string;
    total_sales: number;
    transaction_count: number;
}

interface BestSellingProduct {
    name: string;
    price: number;
    total_sold: number;
    total_revenue: number;
}

interface PaymentMethod {
    payment_method: string;
    count: number;
    total_amount: number;
}

interface CategoryStat {
    category_name: string;
    total_quantity: number;
    total_revenue: number;
}

interface Props {
    dailySales: DailySale[];
    bestSellingProducts: BestSellingProduct[];
    paymentMethods: PaymentMethod[];
    categoryStats: CategoryStat[];
    todayStats: {
        sales_count: number;
        total_revenue: number;
        avg_transaction: number;
    };
    monthStats: {
        sales_count: number;
        total_revenue: number;
        avg_transaction: number;
    };
    period: string;
    [key: string]: unknown;
}

export default function ReportsIndex({ 
    dailySales, 
    bestSellingProducts, 
    paymentMethods, 
    categoryStats, 
    todayStats, 
    monthStats 
}: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return '💵';
            case 'card':
                return '💳';
            case 'digital':
                return '📱';
            default:
                return '💰';
        }
    };

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case 'cash':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'card':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'digital':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <AppShell>
            <Head title="Sales Reports" />
            
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Sales Reports</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Analytics and insights for your business
                        </p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Sales</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(todayStats.total_revenue)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    {todayStats.sales_count} transactions
                                </p>
                            </div>
                            <div className="text-3xl">📈</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(monthStats.total_revenue)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    {monthStats.sales_count} transactions
                                </p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Transaction Today</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {formatCurrency(todayStats.avg_transaction)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Per sale</p>
                            </div>
                            <div className="text-3xl">💰</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Transaction Month</p>
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    {formatCurrency(monthStats.avg_transaction)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">Per sale</p>
                            </div>
                            <div className="text-3xl">🎯</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Daily Sales Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">📈 Daily Sales Trend</h2>
                        <div className="space-y-4">
                            {dailySales.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📊</div>
                                    <p className="text-gray-500 dark:text-gray-400">No sales data available</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {dailySales.map((sale) => {
                                        const maxSale = Math.max(...dailySales.map(s => s.total_sales));
                                        const widthPercentage = maxSale > 0 ? (sale.total_sales / maxSale) * 100 : 0;
                                        
                                        return (
                                            <div key={sale.date} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">
                                                        {new Date(sale.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </span>
                                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 w-64">
                                                        <div 
                                                            className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                                                            style={{ width: `${widthPercentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {formatCurrency(sale.total_sales)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                                        {sale.transaction_count} sales
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">💳 Payment Methods</h2>
                        <div className="space-y-4">
                            {paymentMethods.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">💳</div>
                                    <p className="text-gray-500 dark:text-gray-400">No payment data available</p>
                                </div>
                            ) : (
                                paymentMethods.map((method) => (
                                    <div key={method.payment_method} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">
                                                {getPaymentMethodIcon(method.payment_method)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                                                    {method.payment_method}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {method.count} transactions
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(method.total_amount)}
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${getPaymentMethodColor(method.payment_method)}`}>
                                                {((method.total_amount / paymentMethods.reduce((sum, m) => sum + m.total_amount, 0)) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Selling Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">🏆 Best Selling Products</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Rank</th>
                                    <th className="text-left py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Product</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Quantity Sold</th>
                                    <th className="text-right py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {bestSellingProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8">
                                            <div className="text-4xl mb-4">🏆</div>
                                            <p className="text-gray-500 dark:text-gray-400">No product sales data available</p>
                                        </td>
                                    </tr>
                                ) : (
                                    bestSellingProducts.map((product, index) => (
                                        <tr key={product.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-4">
                                                <div className="flex items-center">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                        index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                        index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                                                        index === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                                                        'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                    }`}>
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(product.price)} each
                                                </div>
                                            </td>
                                            <td className="py-4 text-right font-medium text-gray-900 dark:text-white">
                                                {product.total_sold}
                                            </td>
                                            <td className="py-4 text-right font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(product.total_revenue)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">📊 Sales by Category</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryStats.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <div className="text-4xl mb-4">📊</div>
                                <p className="text-gray-500 dark:text-gray-400">No category data available</p>
                            </div>
                        ) : (
                            categoryStats.map((category) => (
                                <div key={category.category_name} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        🏷️ {category.category_name}
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Items Sold:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {category.total_quantity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Revenue:</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(category.total_revenue)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}