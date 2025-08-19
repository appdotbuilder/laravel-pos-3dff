import { Head, Link } from '@inertiajs/react';

interface Props {
    canLogin?: boolean;
    canRegister?: boolean;
    [key: string]: unknown;
}

export default function Welcome({ canLogin, canRegister }: Props) {
    return (
        <>
            <Head title="SmartPOS - Modern Point of Sale System" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6 py-8">
                    {/* Navigation */}
                    <nav className="flex justify-between items-center mb-16">
                        <div className="flex items-center space-x-2">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg">
                                <span className="text-2xl">🏪</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SmartPOS</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="px-6 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors dark:text-gray-200"
                                >
                                    Login
                                </Link>
                            )}
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-md"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 dark:text-white">
                            🚀 Modern Point of Sale System
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto dark:text-gray-300">
                            Streamline your retail operations with our comprehensive POS solution. 
                            Manage products, process sales, track inventory, and generate insightful reports - all in one place!
                        </p>
                        
                        <div className="flex justify-center space-x-6 mb-12">
                            <Link
                                href={route('login')}
                                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Start Selling Now →
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg transition-colors dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="text-4xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Product Management</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Organize products by categories, track SKUs, manage pricing, and monitor stock levels with low-stock alerts.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="text-4xl mb-4">💳</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Sales Processing</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Fast and efficient checkout with support for cash, card, and digital payments. Generate receipts instantly.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Inventory Tracking</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Real-time inventory updates, movement history, and automated stock adjustments with every sale.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Sales Analytics</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Comprehensive reports with charts, best-selling products analysis, and revenue tracking.
                            </p>
                        </div>
                    </div>

                    {/* User Roles Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-12 mb-20 dark:bg-gray-800">
                        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                            🎭 Built for Different User Roles
                        </h3>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-red-900/30">
                                    <span className="text-2xl">👑</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">Administrator</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Full system access, user management, comprehensive reports, and system configuration.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900/30">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">Cashier</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Process sales transactions, handle payments, and view personal sales performance.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/30">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">Inventory Manager</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Manage products, update stock levels, track inventory movements, and handle suppliers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Demo Accounts */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white p-12 text-center mb-12">
                        <h3 className="text-3xl font-bold mb-8">🎮 Try Demo Accounts</h3>
                        
                        <div className="grid md:grid-cols-3 gap-6 text-left">
                            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                                <h4 className="font-bold text-lg mb-2">👑 Administrator</h4>
                                <p className="text-indigo-100 mb-3">Full system access</p>
                                <div className="text-sm">
                                    <p><strong>Email:</strong> admin@pos.com</p>
                                    <p><strong>Password:</strong> password</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                                <h4 className="font-bold text-lg mb-2">💰 Cashier</h4>
                                <p className="text-indigo-100 mb-3">Sales processing</p>
                                <div className="text-sm">
                                    <p><strong>Email:</strong> cashier@pos.com</p>
                                    <p><strong>Password:</strong> password</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                                <h4 className="font-bold text-lg mb-2">📋 Inventory</h4>
                                <p className="text-indigo-100 mb-3">Stock management</p>
                                <div className="text-sm">
                                    <p><strong>Email:</strong> inventory@pos.com</p>
                                    <p><strong>Password:</strong> password</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Link
                                href={route('login')}
                                className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-colors shadow-lg"
                            >
                                Login & Explore →
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-gray-500 dark:text-gray-400">
                        <p>&copy; 2024 SmartPOS. Built with Laravel & React for modern retail businesses.</p>
                    </footer>
                </div>
            </div>
        </>
    );
}