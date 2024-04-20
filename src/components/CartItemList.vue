<template>
  <div v-auto-animate class="flex flex-col gap-4 flex-1 overflow-y-auto">
    <CartItem
      v-for="cartItem in cart"
      :key="cartItem.id"
      :image-url="cartItem.imageUrl"
      :is-favorite="cartItem.isFavorite"
      :price="cartItem.price"
      :title="cartItem.title"
      @remove-from-cart="() => removeFromCart(cartItem)"
    />
  </div>
</template>

<script setup lang="ts">
import CartItem from '@/components/CartItem.vue'
import { CartKey } from '@/types/symbols'
import { injectStrict } from '@/utils/injectStrict'

const { cart, removeFromCart } = injectStrict(CartKey)
</script>
