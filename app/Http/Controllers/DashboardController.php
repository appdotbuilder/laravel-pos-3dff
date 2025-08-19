<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the main POS dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Common stats for all users
        $totalProducts = Product::count();
        $lowStockProducts = Product::lowStock()->count();
        
        // Role-specific data
        $data = [
            'user' => $user,
            'totalProducts' => $totalProducts,
            'lowStockProducts' => $lowStockProducts,
        ];
        
        // Additional stats for administrators
        if ($user->isAdministrator()) {
            $todaySales = Sale::whereDate('created_at', today())
                ->where('status', 'completed')
                ->sum('total');
            
            $totalUsers = User::count();
            
            $monthlySales = Sale::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->where('status', 'completed')
                ->sum('total');
            
            $data = array_merge($data, [
                'todaySales' => $todaySales,
                'totalUsers' => $totalUsers,
                'monthlySales' => $monthlySales,
            ]);
        }
        
        // Additional stats for cashiers
        if ($user->isCashier()) {
            $myTodaySales = Sale::where('user_id', $user->id)
                ->whereDate('created_at', today())
                ->where('status', 'completed')
                ->sum('total');
            
            $myTotalSales = Sale::where('user_id', $user->id)
                ->where('status', 'completed')
                ->count();
            
            $data = array_merge($data, [
                'myTodaySales' => $myTodaySales,
                'myTotalSales' => $myTotalSales,
            ]);
        }
        
        return Inertia::render('dashboard', $data);
    }
}