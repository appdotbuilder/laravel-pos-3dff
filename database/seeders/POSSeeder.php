<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\InventoryMovement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class POSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@pos.com',
            'password' => Hash::make('password'),
            'role' => 'administrator',
            'email_verified_at' => now(),
        ]);

        // Create cashier user
        $cashier = User::create([
            'name' => 'John Cashier',
            'email' => 'cashier@pos.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'email_verified_at' => now(),
        ]);

        // Create inventory manager user
        $inventoryManager = User::create([
            'name' => 'Jane Manager',
            'email' => 'inventory@pos.com',
            'password' => Hash::make('password'),
            'role' => 'inventory_manager',
            'email_verified_at' => now(),
        ]);

        // Create categories
        $electronics = Category::create([
            'name' => 'Electronics',
            'description' => 'Electronic devices and accessories',
            'is_active' => true,
        ]);

        $clothing = Category::create([
            'name' => 'Clothing',
            'description' => 'Apparel and fashion items',
            'is_active' => true,
        ]);

        $food = Category::create([
            'name' => 'Food & Beverage',
            'description' => 'Food items and drinks',
            'is_active' => true,
        ]);

        $books = Category::create([
            'name' => 'Books',
            'description' => 'Books and educational materials',
            'is_active' => true,
        ]);

        // Create products
        $products = [
            // Electronics
            ['name' => 'Wireless Headphones', 'sku' => 'WH-001', 'price' => 79.99, 'category_id' => $electronics->id, 'stock_quantity' => 25],
            ['name' => 'Bluetooth Speaker', 'sku' => 'BS-001', 'price' => 49.99, 'category_id' => $electronics->id, 'stock_quantity' => 15],
            ['name' => 'Phone Charger', 'sku' => 'PC-001', 'price' => 19.99, 'category_id' => $electronics->id, 'stock_quantity' => 50],
            ['name' => 'USB Cable', 'sku' => 'UC-001', 'price' => 12.99, 'category_id' => $electronics->id, 'stock_quantity' => 100],
            
            // Clothing
            ['name' => 'Cotton T-Shirt', 'sku' => 'TS-001', 'price' => 24.99, 'category_id' => $clothing->id, 'stock_quantity' => 40],
            ['name' => 'Denim Jeans', 'sku' => 'DJ-001', 'price' => 59.99, 'category_id' => $clothing->id, 'stock_quantity' => 20],
            ['name' => 'Running Shoes', 'sku' => 'RS-001', 'price' => 89.99, 'category_id' => $clothing->id, 'stock_quantity' => 15],
            
            // Food & Beverage
            ['name' => 'Energy Drink', 'sku' => 'ED-001', 'price' => 2.99, 'category_id' => $food->id, 'stock_quantity' => 75],
            ['name' => 'Protein Bar', 'sku' => 'PB-001', 'price' => 3.49, 'category_id' => $food->id, 'stock_quantity' => 60],
            ['name' => 'Coffee Beans', 'sku' => 'CB-001', 'price' => 14.99, 'category_id' => $food->id, 'stock_quantity' => 30],
            
            // Books
            ['name' => 'Business Guide', 'sku' => 'BG-001', 'price' => 29.99, 'category_id' => $books->id, 'stock_quantity' => 12],
            ['name' => 'Programming Book', 'sku' => 'PGM-001', 'price' => 45.99, 'category_id' => $books->id, 'stock_quantity' => 8],
        ];

        foreach ($products as $productData) {
            Product::create(array_merge($productData, [
                'description' => 'High-quality ' . strtolower($productData['name']),
                'low_stock_threshold' => 10,
                'is_active' => true,
            ]));
        }

        // Create some sample sales
        $products = Product::all();
        for ($i = 0; $i < 20; $i++) {
            $sale = Sale::create([
                'transaction_number' => Sale::generateTransactionNumber(),
                'user_id' => $cashier->id,
                'subtotal' => 0,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total' => 0,
                'amount_paid' => 0,
                'change_amount' => 0,
                'payment_method' => fake()->randomElement(['cash', 'card', 'digital']),
                'status' => 'completed',
                'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            ]);

            $subtotal = 0;
            $itemCount = fake()->numberBetween(1, 5);
            
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $products->random();
                $quantity = fake()->numberBetween(1, 3);
                $unitPrice = $product->price;
                $totalPrice = $quantity * $unitPrice;
                $subtotal += $totalPrice;

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                ]);
            }

            $taxAmount = $subtotal * 0.08;
            $total = $subtotal + $taxAmount;
            $amountPaid = $total + fake()->randomFloat(2, 0, 20);
            $changeAmount = $amountPaid - $total;

            $sale->update([
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total' => $total,
                'amount_paid' => $amountPaid,
                'change_amount' => $changeAmount,
            ]);
        }
    }
}