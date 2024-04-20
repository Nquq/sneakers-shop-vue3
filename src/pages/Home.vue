<script setup lang="ts">
import CardList from '@/components/CardList.vue'
import type { Card } from '@/types/card.types'
import axios, { type AxiosResponse } from 'axios'
import type { FavoriteResponse } from '@/types/favorites.types'
import { inject, onMounted, reactive, ref, watch } from 'vue'
import type { Params } from '@/types/params.types'
import Title from '@/components/Title.vue'
import debounce from 'lodash.debounce'

const { cart, addToCart, removeFromCart } = inject('cart')
const items = ref<Card[]>([])
const filters = reactive({
  sortBy: 'title',
  searchQuery: ''
})

const onChangeSelect = ({ target }: Event) => {
  filters.sortBy = (target as HTMLSelectElement).value
}

const onChangeSearchInput = debounce(({ target }: Event) => {
  filters.searchQuery = (target as HTMLInputElement).value
}, 400)

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

const fetchFavorites = async () => {
  try {
    const { data: favorites }: AxiosResponse<FavoriteResponse[]> = await axios.get(
      'https://676e203f06f3a27b.mokky.dev/favorites'
    )
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
    const params: Params = {
      sortBy: filters.sortBy
    }

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }

    const { data }: AxiosResponse<Card[]> = await axios.get(
      'https://676e203f06f3a27b.mokky.dev/items',
      { params }
    )

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
  await fetchItems()
  await fetchFavorites()

  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id)
  }))
})

watch(filters, fetchItems)
watch(cart, () => {
  items.value = items.value.map((item) => ({ ...item, isAdded: false }))
})
</script>

<template>
  <div class="flex items-center justify-between">
    <Title title="Все кроссовки" />

    <div class="flex items-center gap-5">
      <select
        @change="onChangeSelect"
        class="py-2 px-3 border rounded-md outline-none"
        name="filter"
        id="filter"
      >
        <option value="title">По названию</option>
        <option value="price">По возрастанию цены</option>
        <option value="-price">По убыванию цены</option>
      </select>

      <div class="relative">
        <img class="absolute left-3 top-3" src="/search.svg" alt="Search" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-10 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>

  <div class="mt-10">
    <CardList
      :items="items"
      @add-to-favorite="addToFavorite"
      @add-to-cart="onClickAddToCartButton"
    />
  </div>
</template>
