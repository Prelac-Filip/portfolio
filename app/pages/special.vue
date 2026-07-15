<script setup lang="ts">
const { data: page } = await useAsyncData('special', () => {
  return queryCollection('special').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const usedImageIds = [1, 2, 3, 5]
const carouselImages = computed(() =>
  page.value?.images.filter((image) => !usedImageIds.includes(image.id)) ?? []
)
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <img
        class="sm:rotate-4 size-36 rounded-lg object-cover ring ring-default ring-offset-3 ring-offset-bg"
        :src="page.images[0]?.src"
        :alt="page.images[0]?.alt"
      >
    </UPageHero>

    <UPageSection
      :title="page.about.title"
      :description="page.about.description"
      orientation="horizontal"
      :ui="{
        container: 'pt-0!',
        title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
        description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
      }"
    >
      <img
        :src="page.images.find((image) => image.id === 5)?.src"
        :alt="page.images.find((image) => image.id === 5)?.alt"
        class="rounded-lg ring ring-default"
      >
    </UPageSection>

    <UPageSection
      :title="page.reasons.title"
      :description="page.reasons.description"
      :ui="{
        container: 'pt-0! sm:gap-6 lg:gap-8',
        title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
        description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
      }"
    >
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="reason in page.reasons.items"
          :key="reason.label"
          :label="reason.label"
          color="primary"
          variant="soft"
          size="lg"
        />
      </div>

      <UCarousel
        v-slot="{ item }"
        arrows
        dots
        loop
        :items="carouselImages"
        :ui="{ item: 'basis-full sm:basis-1/2 lg:basis-1/3' }"
        class="mt-6 w-full"
      >
        <img
          :src="item.src"
          :alt="item.alt"
          class="aspect-square w-full rounded-lg object-cover ring ring-default"
        >
      </UCarousel>
    </UPageSection>

    <UPageSection
      :title="page.special.title"
      :description="page.special.description"
      orientation="horizontal"
      reverse
      :ui="{
        container: 'pt-0!',
        title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
        description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
      }"
    >
      <img
        :src="page.images.find((image) => image.id === 3)?.src"
        :alt="page.images.find((image) => image.id === 3)?.alt"
        class="rounded-lg ring ring-default"
      >
    </UPageSection>

    <UPageSection
      :title="page.end.title"
      :description="page.end.description"
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div class="flex justify-center">
        <img
          :src="page.images.find((image) => image.id === 2)?.src"
          :alt="page.images.find((image) => image.id === 2)?.alt"
          class="w-1/2 rounded-lg ring ring-default"
        >
      </div>
    </UPageSection>
  </UPage>
</template>
