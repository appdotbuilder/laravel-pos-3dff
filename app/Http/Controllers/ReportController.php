<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display sales reports with graphs and analytics.
     */
    public function index(Request $request)
    {
        $period = $request->get('period', 'week');
        
        // Daily sales for the last week/month
        $dailySales = $this->getDailySales($period);
        
        // Best selling products
        $bestSellingProducts = $this->getBestSellingProducts();
        
        // Payment method breakdown
        $paymentMethods = $this->getPaymentMethodBreakdown();
        
        // Sales by category
        $categoryStats = $this->getSalesByCategory();
        
        // Summary stats
        $todayStats = $this->getTodayStats();
        $monthStats = $this->getMonthStats();
        
        return Inertia::render('reports/index', [
            'dailySales' => $dailySales,
            'bestSellingProducts' => $bestSellingProducts,
            'paymentMethods' => $paymentMethods,
            'categoryStats' => $categoryStats,
            'todayStats' => $todayStats,
            'monthStats' => $monthStats,
            'period' => $period,
        ]);
    }

    /**
     * Get daily sales data for charts.
     */
    protected function getDailySales($period)
    {
        $days = $period === 'month' ? 30 : 7;
        $startDate = now()->subDays($days - 1)->startOfDay();
        
        return Sale::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total_sales'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->where('created_at', '>=', $startDate)
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    /**
     * Get best selling products.
     */
    protected function getBestSellingProducts()
    {
        return SaleItem::select(
                'products.name',
                'products.price',
                DB::raw('SUM(sale_items.quantity) as total_sold'),
                DB::raw('SUM(sale_items.total_price) as total_revenue')
            )
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'completed')
            ->where('sales.created_at', '>=', now()->subDays(30))
            ->groupBy('products.id', 'products.name', 'products.price')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Get payment method breakdown.
     */
    protected function getPaymentMethodBreakdown()
    {
        return Sale::select(
                'payment_method',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total) as total_amount')
            )
            ->where('status', 'completed')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('payment_method')
            ->get();
    }

    /**
     * Get sales by category.
     */
    protected function getSalesByCategory()
    {
        return DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->select(
                'categories.name as category_name',
                DB::raw('SUM(sale_items.quantity) as total_quantity'),
                DB::raw('SUM(sale_items.total_price) as total_revenue')
            )
            ->where('sales.status', 'completed')
            ->where('sales.created_at', '>=', now()->subDays(30))
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('total_revenue', 'desc')
            ->get();
    }

    /**
     * Get today's statistics.
     */
    protected function getTodayStats()
    {
        $today = now()->startOfDay();
        
        return [
            'sales_count' => Sale::where('created_at', '>=', $today)->where('status', 'completed')->count(),
            'total_revenue' => Sale::where('created_at', '>=', $today)->where('status', 'completed')->sum('total'),
            'avg_transaction' => Sale::where('created_at', '>=', $today)->where('status', 'completed')->avg('total') ?? 0,
        ];
    }

    /**
     * Get this month's statistics.
     */
    protected function getMonthStats()
    {
        $startOfMonth = now()->startOfMonth();
        
        return [
            'sales_count' => Sale::where('created_at', '>=', $startOfMonth)->where('status', 'completed')->count(),
            'total_revenue' => Sale::where('created_at', '>=', $startOfMonth)->where('status', 'completed')->sum('total'),
            'avg_transaction' => Sale::where('created_at', '>=', $startOfMonth)->where('status', 'completed')->avg('total') ?? 0,
        ];
    }
}