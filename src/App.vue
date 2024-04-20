<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import Drawer from '@/components/Drawer.vue'
import type { Card } from '@/types/card.types'
import { computed, provide, ref, watch } from 'vue'

const cart = ref<Card[]>([])
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

provide('cart', {
  cart,
  removeFromCart,
  addToCart,
  onCloseDrawer,
  onOpenDrawer
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
