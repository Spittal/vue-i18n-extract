<template>
  <div>
    <h1>{{ $t('header.titles.title_a') }}</h1>
    <h2>{{ $t('header.titles.title_b') }}</h2>
    <h3>{{ $t('header.titles.title_c') }}</h3>
    <p>{{ $t(`header.paragraphs.p_a`) }}</p>
    <p>{{ $t('header.paragraphs.p_b') }}</p>
  </div>
</template>

<script>
export default {
  name: 'ex1',
  data () {
    return {
      a: t('header.paragraphs.p_c'),
    }
  }
}
</script>