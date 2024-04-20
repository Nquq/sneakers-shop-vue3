<template>
  <div v-auto-animate class="flex flex-col gap-4 flex-1">
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
import { inject } from 'vue'

const { cart, removeFromCart } = inject('cart')
</script>
