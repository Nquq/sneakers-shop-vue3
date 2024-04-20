<template>
  <div v-auto-animate class="grid grid-cols-4 gap-5">
    <Card
      v-for="item in items"
      :title="item.title"
      :key="item.id"
      :price="item.price"
      :image-url="item.imageUrl"
      :is-favorite="item.isFavorite"
      :is-added="item.isAdded"
      @on-click-favorite="() => emit('addToFavorite', item)"
      @on-click-add-button="() => emit('addToCart', item)"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import type { CardListFunctions, CardsListProps } from '@/types/card.types'

defineProps<CardsListProps>()
const emit = defineEmits<CardListFunctions>()
</script>
