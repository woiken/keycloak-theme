/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    // Keep the primary auth actions in consistent title case across the UI.
    en: {
      loginAccountTitle: "Sign in",
      doLogIn: "Sign In",
      doRegister: "Sign Up"
    }
  })
  .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
