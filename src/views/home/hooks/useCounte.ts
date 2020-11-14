import { ref, Ref, watch } from 'vue'

interface Range {
  min?: number
  max?: number
}

interface Result {
  current: Ref<number>
  set: (value: number) => void
  reset: () => void
}

export default function useCount(initValue: number, range?: Range): Result {
  const current = ref(initValue)
  const set = (val: number): void => {
    current.value = val
    console.log('set:', val)
  }
  const reset = (): void => {
    current.value = initValue
    console.log('reset!')
  }

  watch(current, (newVal: number, oldVal: number): void => {
    console.log('watch!', newVal, oldVal)
    if (newVal === oldVal) return
    if (range && range.min && newVal < range.min) {
      current.value = range.min
      return
    }
    if (range && range.max && newVal > range.max) {
      current.value = range.max
      return
    }
  })

  return {
    current,
    set,
    reset
  }
}
