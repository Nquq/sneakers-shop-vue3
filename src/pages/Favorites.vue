<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import type { Favorite } from '@/types/favorites.types'
import type { Card } from '@/types/card.types'
import CardList from '@/components/CardList.vue'
import Title from '@/components/Title.vue'

const favorites = ref<Card[]>([])

onMounted(async () => {
  try {
    const { data }: AxiosResponse<Favorite[]> = await axios.get(
      'https://676e203f06f3a27b.mokky.dev/favorites?_relations=items'
    )

    favorites.value = data.map((fav) => fav.item)
  } catch (err) {
    console.log(err)
  }
})
</script>
<template>
  <Title title="Мои закладки" />

  <div class="mt-10">
    <CardList :items="favorites" />
  </div>
</template>
