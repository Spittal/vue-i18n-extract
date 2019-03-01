<template>
  <div>
    <h1>{{ $t('menu.titles.title_a') }}</h1>
    <h2>{{ $t('menu.titles.title_b') }}</h2>
    <h3>{{ $t('menu.titles.title_c') }}</h3>
    <p>{{ $t('menu.paragraphs.p_a') }}</p>
    <p>{{ $t('menu.paragraphs.p_b') }}</p>
    <p>{{ $t('menu.paragraphs.p_c') }}</p>
    <i18n path="link.a">
      <a href="#">{{ $tc('link.b', 3) }}</a>
    </i18n>
  </div>
</template>

<script>
export default {
  name: 'ex3',
  data () {
    return {}
  }
}
</script>
