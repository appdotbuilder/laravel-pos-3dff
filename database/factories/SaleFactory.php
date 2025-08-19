<?php

namespace Database\Factories;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 10, 500);
        $taxAmount = $subtotal * 0.08; // 8% tax
        $discountAmount = $this->faker->boolean(30) ? $subtotal * 0.1 : 0; // 30% chance of 10% discount
        $total = $subtotal + $taxAmount - $discountAmount;
        $amountPaid = $total + $this->faker->randomFloat(2, 0, 50); // Some change
        $changeAmount = $amountPaid - $total;

        return [
            'transaction_number' => $this->faker->unique()->bothify('TXN-########'),
            'user_id' => User::factory(),
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'discount_amount' => $discountAmount,
            'total' => $total,
            'amount_paid' => $amountPaid,
            'change_amount' => $changeAmount,
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'digital']),
            'status' => $this->faker->randomElement(['completed', 'refunded']),
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate that the sale is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}