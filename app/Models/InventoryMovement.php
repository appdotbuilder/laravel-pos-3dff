<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\InventoryMovement
 *
 * @property int $id
 * @property int $product_id
 * @property int $user_id
 * @property string $type
 * @property int $quantity_change
 * @property int $stock_before
 * @property int $stock_after
 * @property string|null $reason
 * @property string|null $reference_number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Product $product
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement query()
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereQuantityChange($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereStockBefore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereStockAfter($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereReferenceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InventoryMovement whereUpdatedAt($value)
 * @method static \Database\Factories\InventoryMovementFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class InventoryMovement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'user_id',
        'type',
        'quantity_change',
        'stock_before',
        'stock_after',
        'reason',
        'reference_number',
    ];

    /**
     * Get the product for this movement.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who performed this movement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}