<script setup lang="ts">
const route = useRoute()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => {
  return queryCollection('projects').path(route.path).first()
})

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found',
    fatal: true
  })
}

const title = project.value.title
const description = project.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImage('Portfolio', { title, description })
</script>

<template>
  <UPage v-if="project">
    <UPageHero
      :title="project.title"
      :description="project.description"
      orientation="horizontal"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div class="flex items-center gap-2">
          <UButton
            to="/projects"
            variant="ghost"
            color="neutral"
            icon="i-lucide-arrow-left"
            label="Back to projects"
          />
          <UButton
            v-if="project.url !== '#'"
            :to="project.url"
            target="_blank"
            trailing-icon="i-lucide-external-link"
            label="Visit site"
          />
        </div>
      </template>
      <img
        :src="project.image"
        :alt="project.title"
        class="object-cover w-full max-h-96 rounded-lg"
      >
    </UPageHero>
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div
        v-if="project.tags?.length"
        class="flex flex-wrap gap-2 mb-8"
      >
        <UBadge
          v-for="tag in project.tags"
          :key="tag"
          :label="tag"
          variant="subtle"
          color="neutral"
        />
      </div>
      <ContentRenderer
        :value="project"
        class="prose prose-primary dark:prose-invert max-w-none"
      />
    </UPageSection>
  </UPage>
</template>
