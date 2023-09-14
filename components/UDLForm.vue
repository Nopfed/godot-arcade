<template>
  <v-switch
    v-model="modelValue.useUdl"
    color="red-darken-4" 
    class="switch"
    label="Use Universal Data License"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.useDerivationCredit"
    color="red-darken-4"
    class="switch"
    label="Derivation with Credit"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.useDerivationIndication"
    color="red-darken-4"
    class="switch"
    label="Derivation with Indication"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.useDerivationPassthrough"
    color="red-darken-4"
    class="switch"
    label="Derivation with License Passthrough"
  />
  <a
    target="_blank" 
    href="https://arwiki.wiki/#/en/Universal-Data-License-How-to-use-it"
  >
    What is the Universal Data License?
  </a>
</template>

<script setup lang="ts">
import { UDLOptions } from '~/utils/udl'

const props = defineProps<{ modelValue: UDLOptions }>()
defineEmits(['update:modelValue'])

watch(props.modelValue, () => {
  console.log(props.modelValue)

  if (!props.modelValue.useUdl) {
    props.modelValue.useDerivationCredit = false
    props.modelValue.useDerivationIndication = false
    props.modelValue.useDerivationPassthrough = false
  }
})
</script>
