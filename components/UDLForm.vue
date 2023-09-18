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
    v-model="modelValue.useDerivationRevenueShare"
    color="red-darken-4"
    class="switch"
    label="Derivation with Revenue Share"
  />
  <v-radio-group label="Commercial Use" v-if="modelValue.useUdl">
    <v-radio
      color="red-darken-4"
      label="Commercial Use Allowed"
      value="1"
      v-model="modelValue.commercialUse"/>
    <v-radio
      color="red-darken-4"
      label="Commercial Use Allowed With Credit"
      value="2"
      v-model="modelValue.commercialUseWithCredit"/>
    <v-radio
      color="red-darken-4"
      label="N/A"
      value="3"
    />
  </v-radio-group>
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.monthlyLicenseFee"
    color="red-darken-4"
    class="switch"
    label="Monthly License Fee"
  />
  <v-text-field
    v-if="modelValue.monthlyLicenseFee"
    v-model="modelValue.monthlyFeeNumber"
    hide-details
    single-line
    class="switch"
    type="number"
    label="Monthly Fee"
  />
  <v-switch
    v-if="modelValue.useUdl"
    v-model="modelValue.oneTimeLicenseFee"
    color="red-darken-4"
    class="switch"
    label="One Time License Fee"
  />
  <v-text-field
    v-if="modelValue.oneTimeLicenseFee"
    v-model="modelValue.oneTimeFeeNumber"
    hide-details
    single-line
    class="switch"
    type="number"
    label="One Time Fee"
  />
  <div v-if="modelValue.monthlyLicenseFee || modelValue.oneTimeLicenseFee">
    <br v-if="modelValue.oneTimeLicenseFee">
    <v-text-field
      v-model="modelValue.currency"
      color="red-darken-4"
      class="switch"
      single-line
      label="Currency"
      hint="Currency for License Fees"
    />
  </div>
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
    props.modelValue.useDerivationCredit = false
    props.modelValue.useDerivationIndication = false
    props.modelValue.useDerivationPassthrough = false
    props.modelValue.useDerivationRevenueShare = false
    props.modelValue.commercialUse = false
    props.modelValue.commercialUseWithCredit = false
    props.modelValue.monthlyLicenseFee = false
    props.modelValue.monthlyFeeNumber = 0
    props.modelValue.oneTimeLicenseFee = false
    props.modelValue.oneTimeFeeNumber = 0
    props.modelValue.currency = ""
    props.modelValue.licenseDuration = false
    props.modelValue.paymentAddress = false
    props.modelValue.paymentModeRandom = false
    props.modelValue.paymentModeGlobal = false
  }

})
</script>
