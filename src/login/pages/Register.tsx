import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect, useEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, AlertTriangle, CircleCheck, Info } from "lucide-react";

import wallpaper from "../assets/wallpaper.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
  const { kcContext, i18n, doUseDefaultCss, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const {
    messageHeader,
    url,
    messagesPerField,
    recaptchaRequired,
    recaptchaVisible,
    recaptchaSiteKey,
    recaptchaAction,
    termsAcceptanceRequired,
    realm,
    message,
    isAppInitiatedAction
  } = kcContext;

  const { msg, msgStr, advancedMsg, currentLanguage, enabledLanguages } = i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass")
  });

  useSetClassName({
    qualifiedName: "body",
    className: kcClsx("kcBodyClass")
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  useEffect(() => {
    document.title = msgStr("registerTitle") + " - " + realm.displayName;
  }, []);

  useLayoutEffect(() => {
    (window as any)["onSubmitRecaptcha"] = () => {
      // @ts-expect-error
      document.getElementById("kc-register-form").requestSubmit();
    };

    return () => {
      delete (window as any)["onSubmitRecaptcha"];
    };
  }, []);

  if (!isReadyToRender) {
    return null;
  }

  const displayMessage = messagesPerField.exists("global") && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);

  return (
    <main className="min-h-dvh w-dvw grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side - Wallpaper */}
      <div className="hidden lg:block w-full relative h-full">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${wallpaper})` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute inset-0 z-20 flex items-end p-12">
          <div className="space-y-3 max-w-md">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Join us today</h2>
            <p className="text-lg text-white/90 drop-shadow">
              Create your account and start your journey with {realm.displayName}.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="relative w-full h-full flex flex-col overflow-auto bg-background">
        {/* Subtle ambient glow so the form side isn't a flat empty panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
        />
        {/* Header with Language Selector */}
        <div className="flex justify-end items-center p-4 gap-2">
          {enabledLanguages.length > 1 && (
            <Select
              onValueChange={selectedTag => {
                const selectedLang = enabledLanguages.find(lang => lang.languageTag === selectedTag);
                if (selectedLang?.href) {
                  window.location.href = selectedLang.href;
                }
              }}
              defaultValue={currentLanguage.languageTag}
            >
              <SelectTrigger className="w-auto bg-transparent hover:bg-accent text-foreground px-2 py-1 h-auto rounded-md border-none shadow-none focus:ring-0">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {enabledLanguages.map(({ languageTag, label, href }) => (
                  <SelectItem key={languageTag} value={languageTag} data-href={href}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <ThemeToggle />
        </div>

        {/* Form Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1.5">
              <h1 id="kc-page-title" className="text-3xl font-bold tracking-tight">
                {messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
              </h1>
              <p className="text-base text-muted-foreground">
                Create your <span className="font-medium text-foreground">{realm.displayName}</span> account
              </p>
            </div>

            <div className="space-y-6">
                {/* Alert Messages */}
                {displayMessage && message !== undefined && (
                  <Alert variant={message.type}>
                    {message.type === "success" && <CircleCheck />}
                    {message.type === "warning" && <AlertTriangle />}
                    {message.type === "error" && <AlertOctagon />}
                    {message.type === "info" && <Info />}
                    <AlertDescription>{kcSanitize(message.summary)}</AlertDescription>
                  </Alert>
                )}

                {/* Registration Form */}
                <form
                  id="kc-register-form"
                  className="space-y-4"
                  action={url.registrationAction}
                  method="post"
                >
                  <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                  />

                  {/* Terms Acceptance */}
                  {termsAcceptanceRequired && (
                    <TermsAcceptance
                      i18n={i18n}
                      kcClsx={kcClsx}
                      messagesPerField={messagesPerField}
                      areTermsAccepted={areTermsAccepted}
                      onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                  )}

                  {/* Recaptcha */}
                  {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="flex justify-center">
                      <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                    </div>
                  )}

                  {/* Form Buttons */}
                  <div className="space-y-4 pt-2">
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                      <Button
                        className="w-full h-11 text-base font-semibold g-recaptcha"
                        data-sitekey={recaptchaSiteKey}
                        data-callback="onSubmitRecaptcha"
                        data-action={recaptchaAction}
                        type="submit"
                      >
                        {msg("doRegister")}
                      </Button>
                    ) : (
                      <Button
                        disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                        className="w-full h-11 text-base font-semibold"
                        type="submit"
                      >
                        {msgStr("doRegister")}
                      </Button>
                    )}

                    {/* Back to Login Link */}
                    <div className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Button variant="link" asChild className="p-0 h-auto font-medium text-primary">
                        <a href={url.loginUrl}>{msg("backToLogin")}</a>
                      </Button>
                    </div>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TermsAcceptance(props: {
  i18n: I18n;
  kcClsx: KcClsx;
  messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
  areTermsAccepted: boolean;
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
  const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

  const { msg } = i18n;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 bg-muted/50">
        <h4 className="font-medium mb-2">{msg("termsTitle")}</h4>
        <div id="kc-registration-terms-text" className="text-sm text-muted-foreground">
          {msg("termsText")}
        </div>
      </div>
      <Label htmlFor="termsAccepted" className="flex items-center gap-2.5 cursor-pointer py-1 text-sm font-normal text-foreground">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          checked={areTermsAccepted}
          onCheckedChange={(checked) => onAreTermsAcceptedValueChange(checked === true)}
          aria-invalid={messagesPerField.existsError("termsAccepted")}
          className="size-5"
        />
        {msg("acceptTerms")}
      </Label>
      {messagesPerField.existsError("termsAccepted") && (
        <p
          id="input-error-terms-accepted"
          className="text-destructive text-sm"
          aria-live="polite"
        >
          {kcSanitize(messagesPerField.get("termsAccepted"))}
        </p>
      )}
    </div>
  );
}
