<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import Drawer from '@/components/Drawer.vue'
import type { Card } from '@/types/card.types'
import { computed, provide, ref, watch } from 'vue'
import { CardKey, CartKey } from '@/types/symbols'
import axios, { type AxiosResponse } from 'axios'
import type { FavoriteResponse } from '@/types/favorites.types'

const cart = ref<Card[]>([])
const items = ref<Card[]>([])
const drawerOpen = ref<boolean>(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round(totalPrice.value * (5 / 100)))

const onOpenDrawer = () => {
  drawerOpen.value = true
}

const onCloseDrawer = () => {
  drawerOpen.value = false
}

const addToCart = (item: Card) => {
  cart.value.push(item)
  item.isAdded = true
}

const removeFromCart = (item: Card) => {
  cart.value = cart.value.filter((cartItem) => cartItem.id !== item.id)
  item.isAdded = false
}

watch(
  cart,
  () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
  },
  { deep: true }
)

const onClickAddToCartButton = (item: Card) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const addToFavorite = async (item: Card) => {
  try {
    if (!item.isFavorite) {
      const favoriteDtoRequest = {
        item_id: item.id
      }
      item.isFavorite = !item.isFavorite

      const { data }: AxiosResponse<FavoriteResponse> = await axios.post(
        'https://676e203f06f3a27b.mokky.dev/favorites',
        favoriteDtoRequest
      )
      item.favoriteId = data.id
    } else {
      item.isFavorite = false
      await axios.delete(`https://676e203f06f3a27b.mokky.dev/favorites/${item.favoriteId}`)
      item.favoriteId = null
    }
  } catch (err) {
    console.log(err)
  }
}

provide(CartKey, {
  cart,
  removeFromCart,
  addToCart,
  onClickAddToCartButton
})
provide(CardKey, {
  items,
  addToFavorite
})
</script>

<template>
  <Drawer
    :totalPrice="totalPrice"
    :vatPrice="vatPrice"
    v-if="drawerOpen"
    @on-close-drawer="onCloseDrawer"
  />

  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl my-14">
    <AppHeader :total-price="totalPrice" @on-open-drawer="onOpenDrawer" />

    <div class="p-10">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
