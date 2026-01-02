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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, AlertTriangle, CircleCheck, Info } from "lucide-react";

import Logo from "../assets/logo_phase_slash.svg";

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
      {/* Left Side - Cotton Candy Gradient */}
      <div className="hidden lg:block w-full relative h-full">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(225deg, #FFB3D9 0%, #FFD1DC 20%, #FFF0F5 40%, #E6F3FF 60%, #D1E7FF 80%, #C7E9F1 100%)`
          }}
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
          <div className="text-center space-y-6 max-w-md">
            <h2 className="text-3xl font-bold text-gray-800">Join us today</h2>
            <p className="text-lg text-gray-700">
              Create your account and start your journey with {realm.displayName}.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full h-full flex flex-col overflow-auto bg-background">
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
        </div>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <img src={Logo} alt="Logo" className="w-full h-auto max-w-2xl max-h-12" />
            </div>

            <Card className="flex flex-col gap-6 border-0 shadow-none lg:border lg:shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle id="kc-page-title" className="text-2xl">
                  {messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
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
                        className="w-full g-recaptcha"
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
                        className="w-full"
                        type="submit"
                      >
                        {msgStr("doRegister")}
                      </Button>
                    )}

                    {/* Back to Login Link */}
                    <div className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Button variant="link" asChild className="p-0 h-auto">
                        <a href={url.loginUrl}>{msg("backToLogin")}</a>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
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
      <div className="flex items-center space-x-3">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          checked={areTermsAccepted}
          onCheckedChange={(checked) => onAreTermsAcceptedValueChange(checked === true)}
          aria-invalid={messagesPerField.existsError("termsAccepted")}
        />
        <Label htmlFor="termsAccepted" className="text-sm">
          {msg("acceptTerms")}
        </Label>
      </div>
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
