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
  <v-switch 
    v-if="modelValue.useUdl"
    v-model="modelValue.commercialUse"
    color="red-darken-4"
    class="switch"
    label="Commercial Use Allowed"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.commercialUseWithCredit"
    color="red-darken-4"
    class="switch"
    label="Commercial Use Allowed With Credit"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.monthlyLicenseFee"
    color="red-darken-4"
    class="switch"
    label="Monthly License Fee"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.oneTimeLicenseFee"
    color="red-darken-4"
    class="switch"
    label="One Time License Fee"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.currency"
    color="red-darken-4"
    class="switch"
    label="Currency"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.licenseDuration"
    color="red-darken-4"
    class="switch"
    label="License Duration"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.paymentAddress"
    color="red-darken-4"
    class="switch"
    label="Payment Address"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.paymentModeRandom"
    color="red-darken-4"
    class="switch"
    label="Payment Mode Random Distribution"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.paymentModeGlobal"
    color="red-darken-4"
    class="switch"
    label="Payment Mode Global Distribution"
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
    let x: any
    for (x in props.modelValue) {
      x = false
    }
  }
})
</script>
