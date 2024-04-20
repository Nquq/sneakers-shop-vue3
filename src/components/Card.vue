<template>
  <div
    class="relative bg-white border border-gray-100 rounded-3xl p-8 cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
  >
    <div class="flex flex-col justify-between h-full">
      <img
        class="absolute top-8 left-8"
        @click="emit('onClickFavorite')"
        :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
        alt="Like-1"
      />
      <img :src="imageUrl" alt="Sneakers 1" />
      <p class="mt-2">{{ title }}</p>
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <span class="text-slate-400">Цена:</span>
          <b>{{ price }} руб.</b>
        </div>
        <img
          class="opacity-50 hover:opacity-100 transition"
          @click="emit('onClickAddButton')"
          :src="!isAdded ? '/plus.svg' : '/checked.svg'"
          alt="Plus"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CardFunctions, CardProps } from '@/types/card.types'

defineProps<CardProps>()
const emit = defineEmits<CardFunctions>()
</script>
