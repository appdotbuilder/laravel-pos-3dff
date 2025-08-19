<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Sale;
use App\Models\Product;
use App\Models\InventoryMovement;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = Sale::with('user', 'saleItems.product')
            ->latest()
            ->paginate(20);
        
        return Inertia::render('sales/index', [
            'sales' => $sales
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::active()
            ->with('category')
            ->where('stock_quantity', '>', 0)
            ->get();
        
        return Inertia::render('sales/create', [
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSaleRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            
            // Create the sale
            $sale = Sale::create([
                'transaction_number' => Sale::generateTransactionNumber(),
                'user_id' => $request->user()->id,
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'discount_amount' => $validated['discount_amount'],
                'total' => $validated['total'],
                'amount_paid' => $validated['amount_paid'],
                'change_amount' => $validated['change_amount'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
            ]);
            
            // Process sale items and update inventory
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Create sale item
                $sale->saleItems()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['total_price'],
                ]);
                
                // Update product stock
                $stockBefore = $product->stock_quantity;
                $product->decrement('stock_quantity', $item['quantity']);
                $stockAfter = $product->fresh()->stock_quantity;
                
                // Create inventory movement record
                InventoryMovement::create([
                    'product_id' => $product->id,
                    'user_id' => $request->user()->id,
                    'type' => 'sale',
                    'quantity_change' => -$item['quantity'],
                    'stock_before' => $stockBefore,
                    'stock_after' => $stockAfter,
                    'reason' => 'Product sold',
                    'reference_number' => $sale->transaction_number,
                ]);
            }
            
            return redirect()->route('sales.show', $sale)
                ->with('success', 'Sale completed successfully.');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale)
    {
        $sale->load('user', 'saleItems.product.category');
        
        return Inertia::render('sales/show', [
            'sale' => $sale
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale)
    {
        // Sales should not be editable in a POS system for audit purposes
        return redirect()->route('sales.show', $sale)
            ->with('error', 'Sales cannot be edited for audit purposes.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreSaleRequest $request, Sale $sale)
    {
        // Sales should not be editable in a POS system for audit purposes
        return redirect()->route('sales.show', $sale)
            ->with('error', 'Sales cannot be updated for audit purposes.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale)
    {
        // Only allow refunds, not deletions
        return redirect()->route('sales.show', $sale)
            ->with('error', 'Sales cannot be deleted. Use refund functionality instead.');
    }
}