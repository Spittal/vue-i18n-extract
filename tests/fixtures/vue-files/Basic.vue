<template functional>
  <div>
    <h1>{{ $t('header.title') }}</h1>
    <p>{{ $t("content.paragraph.p_1", { count: 'two' }) }}</p>
    <p>{{ $t('Key used as default translation.') }}</p>
    <p>{{ $tc(`content.paragraph.p.2`, 2) }}</p>
    <i18n path="content.link.a">
      <a place="link" href="#">{{ $t('content.link.b') }}</a>
    </i18n>
    <p v-t="'header.title'"></p>
  </div>
</template>
