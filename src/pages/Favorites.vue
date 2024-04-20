<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CardList from '@/components/CardList.vue'
import Title from '@/components/Title.vue'
import { injectStrict } from '@/utils/injectStrict'
import { CardKey, CartKey } from '@/types/symbols'
import { getFavorite, getItems } from '@/api/items'
import Loader from '@/components/Loader.vue'

const { items, addToFavorite } = injectStrict(CardKey)
const { onClickAddToCartButton, cart } = injectStrict(CartKey)
const isLoading = ref(false)

onMounted(() => {
  items.value = items.value.filter((item) => item.isFavorite)
})

const fetchFavorites = async () => {
  try {
    const favorites = await getFavorite()
    items.value = items.value.map((item) => {
      const favorite = favorites.find((fav) => fav.item_id === item.id)

      if (!favorite) return item
      return { ...item, isFavorite: true, favoriteId: favorite.id }
    })
  } catch (err) {
    console.error(err)
  }
}

const fetchItems = async () => {
  try {
    const data = await getItems()

    items.value = data.map((item) => ({
      ...item,
      isFavorite: false,
      isAdded: false,
      favoriteId: null
    }))
  } catch (err) {
    console.error(err)
  }
}
onMounted(async () => {
  isLoading.value = true
  await fetchItems()
  await fetchFavorites()

  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))

  isLoading.value = false
})

const favorites = computed(() => items.value.filter((item) => item.isFavorite))
</script>
<template>
  <Title title="Мои закладки" />

  <div class="mt-10">
    <Loader v-if="isLoading" />
    <CardList
      v-else
      :items="favorites"
      @add-to-cart="onClickAddToCartButton"
      @add-to-favorite="addToFavorite"
    />
  </div>
</template>
