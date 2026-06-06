import Alpine from 'alpinejs'

Alpine.data('alert', function () {
  return {
    isVisible: false,
    dismiss() {
      this.isVisible = false
    },
    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)
      setTimeout(() => {
        this.dismiss()
      }, 5000)
    },
  }
})

Alpine.data('cartUpdater', (initialItems) => ({
  items: initialItems,
  initialStateStr: JSON.stringify(initialItems),
  get hasChanges() {
    return JSON.stringify(this.items) !== this.initialStateStr
  }
}))

Alpine.start()
