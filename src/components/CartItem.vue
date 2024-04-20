<template>
  <div class="border border-slate-200 p-4 rounded-xl flex items-center gap-4">
    <img class="w-16 h-16" :src="imageUrl" :alt="title" />

    <div class="flex flex-col flex-1">
      <p>{{ title }}</p>
      <div class="flex justify-between items-center mt-2">
        <b>{{ price }} руб.</b>
        <img
          @click="emit('removeFromCart')"
          class="opacity-40 hover:opacity-100 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl"
          src="/close.svg"
          alt="Close"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartProps } from '@/types/cart.types'

defineProps<CartProps>()
const emit = defineEmits<{ (event: 'removeFromCart'): void }>()
</script>
