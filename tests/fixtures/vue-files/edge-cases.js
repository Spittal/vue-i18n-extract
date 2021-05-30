// Should match
$t('single \' quote');
$t("single \" quote");
$t(`back \` tick`);
$t('Early ' string termination');

// Should be suspected dynamic
<p>{{ t(`${dynamicKey}`) }}</p>

// Should not match
gt("FALSE POSITIVE 1");
;t("FALSE POSITIVE 2");
t(dynamicKey)
