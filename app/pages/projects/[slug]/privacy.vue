<script setup lang="ts">
const route = useRoute()
const projectPath = `/projects/${route.params.slug}`

const { data: policy } = await useAsyncData(`privacy-${route.params.slug}`, () => {
  return queryCollection('privacy').path(route.path).first()
})
const { data: project } = await useAsyncData(`privacy-project-${route.params.slug}`, () => {
  return queryCollection('projects').path(projectPath).first()
})

if (!policy.value || !project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Privacy policy not found',
    fatal: true
  })
}

const title = policy.value.title
const description = policy.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })

// UTC, so the server and the reader's browser print the same day.
const updated = new Date(policy.value.updated).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
})
</script>

<template>
  <UPage v-if="policy && project">
    <UPageHero
      :title="policy.title"
      :description="policy.description"
      :ui="{
        headline: 'justify-start! text-left',
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start',
        container: 'pb-0!'
      }"
    >
      <template #headline>
        <span class="text-sm text-muted">Last updated: {{ updated }}</span>
      </template>
      <template #links>
        <UButton
          :to="projectPath"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          :label="`Back to ${project.title}`"
        />
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <ContentRenderer
        :value="policy"
        class="prose prose-primary dark:prose-invert max-w-none"
      />
    </UPageSection>
  </UPage>
</template>
