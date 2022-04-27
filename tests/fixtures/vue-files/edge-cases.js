// Should match
$t('single \' quote');
$t("single \" quote");
$t(`back \` tick`);
$t('Early ' string termination');

someFn(t('parentheses'));
const arr = [t('square brackets')];
const obj1 = {t('curly brackets')};
const obj2 = {v:t('colon')};

'start'+t('concatenation')+'end'
	t('leading tab') // make sure autoformat does not remove the leading tab!

`${t('in template literal')}`

// Should be suspected dynamic
<p>{{ t(`${dynamicKey}`) }}</p>

// Should not match
gt("FALSE POSITIVE 1");
;t("FALSE POSITIVE 2");
-t("FALSE POSITIVE 3");
_t("FALSE POSITIVE 4");
w0t("FALSE POSITIVE 5");
ಠ_ಠt("FALSE POSITIVE 6");
t(dynamicKey)
