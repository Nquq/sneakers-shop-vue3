<script setup lang="ts">
import CartItemList from '@/components/CartItemList.vue'
import InfoBlock from '@/components/InfoBlock.vue'
import axios from 'axios'
import { computed, onUnmounted, ref } from 'vue'
import { CartKey } from '@/types/symbols'
import { injectStrict } from '@/utils/injectStrict'

const emit = defineEmits<{ (event: 'onCloseDrawer'): void }>()
const { totalPrice } = defineProps<{
  totalPrice: number
  vatPrice: number
}>()

const { cart } = injectStrict(CartKey)
const isCreatingOrder = ref<boolean>(false)
const orderId = ref<number | null>(null)

const cartIsEmpty = computed(() => cart.value.length === 0)
const isCreateOrderButtonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value)

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await axios.post('https://676e203f06f3a27b.mokky.dev/orders', {
      items: cart.value,
      totalPrice: totalPrice
    })

    cart.value = []
    orderId.value = data.id
  } catch (err) {
    console.log(err)
  } finally {
    isCreatingOrder.value = false
  }
}

onUnmounted(() => {
  orderId.value = null
})
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <section class="flex flex-col justify-between h-full">
      <div class="flex gap-5 items-center mb-8">
        <img
          @click="emit('onCloseDrawer')"
          class="opacity-30 cursor-pointer rotate-180 hover:opacity-100 transition hover:-translate-x-1"
          src="/arrow-back.svg"
          alt="Back"
        />
        <h2 class="text-2xl font-bold">Корзина</h2>
      </div>

      <div v-if="!totalPrice || orderId" class="flex items-center h-full">
        <InfoBlock
          v-if="!totalPrice && !orderId"
          title="Корзина пустая :("
          image-url="/package-icon.png"
          description="Добавтьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        />
        <InfoBlock
          v-if="orderId"
          title="Заказ оформлен!"
          image-url="/order-success-icon.png"
          :description="`Ваш заказ #${orderId} будет передан курьерской доставке`"
        />
      </div>

      <CartItemList v-if="totalPrice" />

      <div v-if="totalPrice" class="flex flex-col gap-5 mt-6">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} руб.</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }} руб.</b>
        </div>

        <button
          :disabled="isCreateOrderButtonDisabled"
          @click="createOrder"
          class="mt-4 bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 transition active:bg-lime-700 disabled:bg-slate-300 cursor-pointer disabled:cursor-default"
        >
          Оформить заказ
        </button>
      </div>
    </section>
  </div>
</template>
