// Should Match
$t('single \' quote');
$t("single \" quote");
$t(`back \` tick`);
$t('Early ' string termination');

// Should Not Match
gt("FALSE POSITIVE 1");
;t("FALSE POSITIVE 2");
