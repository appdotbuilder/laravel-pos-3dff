<?php

namespace Database\Factories;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryMovement>
 */
class InventoryMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['stock_in', 'stock_out', 'adjustment', 'sale', 'refund']);
        $quantityChange = match($type) {
            'stock_in' => $this->faker->numberBetween(10, 100),
            'stock_out', 'sale' => -$this->faker->numberBetween(1, 10),
            'refund' => $this->faker->numberBetween(1, 5),
            'adjustment' => $this->faker->numberBetween(-10, 10),
            default => $this->faker->numberBetween(-10, 10),
        };
        
        $stockBefore = $this->faker->numberBetween(0, 100);
        $stockAfter = $stockBefore + $quantityChange;

        return [
            'product_id' => Product::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'quantity_change' => $quantityChange,
            'stock_before' => $stockBefore,
            'stock_after' => max(0, $stockAfter),
            'reason' => $this->faker->sentence(),
            'reference_number' => $type === 'sale' ? 'TXN-' . $this->faker->randomNumber(8) : null,
        ];
    }

    /**
     * Indicate that the movement is a sale.
     */
    public function sale(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'sale',
            'quantity_change' => -$this->faker->numberBetween(1, 5),
            'reason' => 'Product sold',
            'reference_number' => 'TXN-' . $this->faker->randomNumber(8),
        ]);
    }
}