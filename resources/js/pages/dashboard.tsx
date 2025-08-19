import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
    totalProducts: number;
    lowStockProducts: number;
    todaySales?: number;
    totalUsers?: number;
    monthlySales?: number;
    myTodaySales?: number;
    myTotalSales?: number;
    [key: string]: unknown;
}

export default function Dashboard({ 
    user, 
    totalProducts, 
    lowStockProducts, 
    todaySales, 
    totalUsers, 
    myTodaySales, 
    myTotalSales 
}: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'administrator':
                return '👑';
            case 'cashier':
                return '💰';
            case 'inventory_manager':
                return '📋';
            default:
                return '👤';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'administrator':
                return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            case 'cashier':
                return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'inventory_manager':
                return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
            default:
                return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <AppShell>
            <Head title="POS Dashboard" />
            
            <div className="p-6 space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Welcome back, {user.name}! 👋
                            </h1>
                            <p className="text-indigo-100">
                                Ready to manage your point of sale operations
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-semibold ${getRoleColor(user.role)}`}>
                            {getRoleIcon(user.role)} {user.role.replace('_', ' ').toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                            </div>
                            <div className="text-3xl">📦</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Items</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{lowStockProducts}</p>
                            </div>
                            <div className="text-3xl">⚠️</div>
                        </div>
                    </div>

                    {user.role === 'administrator' && (
                        <>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Sales</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(todaySales || 0)}
                                        </p>
                                    </div>
                                    <div className="text-3xl">💰</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{totalUsers}</p>
                                    </div>
                                    <div className="text-3xl">👥</div>
                                </div>
                            </div>
                        </>
                    )}

                    {user.role === 'cashier' && (
                        <>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Today's Sales</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(myTodaySales || 0)}
                                        </p>
                                    </div>
                                    <div className="text-3xl">💵</div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Total Sales</p>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{myTotalSales}</p>
                                    </div>
                                    <div className="text-3xl">🎯</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(user.role === 'administrator' || user.role === 'cashier') && (
                            <Link
                                href={route('sales.create')}
                                className="flex items-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                            >
                                <div className="text-2xl mr-3">💳</div>
                                <div>
                                    <h3 className="font-semibold text-green-700 dark:text-green-300">New Sale</h3>
                                    <p className="text-sm text-green-600 dark:text-green-400">Process transaction</p>
                                </div>
                            </Link>
                        )}

                        {(user.role === 'administrator' || user.role === 'inventory_manager') && (
                            <Link
                                href={route('products.create')}
                                className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                            >
                                <div className="text-2xl mr-3">📦</div>
                                <div>
                                    <h3 className="font-semibold text-blue-700 dark:text-blue-300">Add Product</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Manage inventory</p>
                                </div>
                            </Link>
                        )}

                        <Link
                            href={route('products.index')}
                            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                        >
                            <div className="text-2xl mr-3">📋</div>
                            <div>
                                <h3 className="font-semibold text-purple-700 dark:text-purple-300">View Products</h3>
                                <p className="text-sm text-purple-600 dark:text-purple-400">Browse inventory</p>
                            </div>
                        </Link>

                        {user.role === 'administrator' && (
                            <Link
                                href={route('reports.index')}
                                className="flex items-center p-4 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 rounded-lg transition-colors group"
                            >
                                <div className="text-2xl mr-3">📊</div>
                                <div>
                                    <h3 className="font-semibold text-orange-700 dark:text-orange-300">Reports</h3>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">Sales analytics</p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Overview</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">🔥 Key Features</h3>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                    Real-time inventory tracking
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                    Multi-payment method support
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                                    Comprehensive sales reports
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                                    Role-based access control
                                </li>
                            </ul>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300">📈 System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">System Health</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">✅ Operational</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                    <span className="text-green-600 dark:text-green-400 font-medium">✅ Connected</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                                    <span className="text-gray-500 dark:text-gray-500 font-medium">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}