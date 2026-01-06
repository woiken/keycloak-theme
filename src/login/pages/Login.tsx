import type { JSX } from "keycloakify/tools/JSX";
import { cloneElement, useState, useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItemCustom, FormMessageCustom } from "@/components/ui/form";
import { Eye, EyeClosed } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertOctagon, AlertTriangle, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, message, isAppInitiatedAction } = kcContext;

  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

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
    document.title = msgStr("loginTitle", realm.displayName);
  }, []);

  if (!isReadyToRender) {
    return null;
  }

  const displayMessage = !messagesPerField.existsError("username", "password") && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction);

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
            <h2 className="text-3xl font-bold text-gray-800">Welcome back</h2>
            <p className="text-lg text-gray-700">
              Sign in to continue your journey with {realm.displayName}.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
            <Card className="flex flex-col gap-6 border-0 shadow-none lg:border lg:shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle id="kc-page-title" className="text-2xl">
                  {msg("loginAccountTitle")}
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

                {/* Login Form */}
                <div id="kc-form">
                  <div id="kc-form-wrapper">
                    {realm.password && (
                      <form
                        id="kc-form-login"
                        onSubmit={() => {
                          setIsLoginButtonDisabled(true);
                          return true;
                        }}
                        action={url.loginAction}
                        method="post"
                        className="space-y-4"
                      >
                        {!usernameHidden && (
                          <div>
                            <FormItemCustom>
                              <Label htmlFor="username">
                                {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                              </Label>
                              <Input
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete="username"
                                aria-invalid={messagesPerField.existsError("username", "password")}
                              />
                              {messagesPerField.existsError("username", "password") && (
                                <FormMessageCustom id="input-error" className="text-destructive text-sm" aria-live="polite">
                                  {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                                </FormMessageCustom>
                              )}
                            </FormItemCustom>
                          </div>
                        )}

                        <FormItemCustom>
                          <Label htmlFor="password">
                            {msg("password")}
                          </Label>
                          <PasswordWrapper i18n={i18n} passwordInputId="password">
                            <Input
                              tabIndex={3}
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              aria-invalid={messagesPerField.existsError("username", "password")}
                            />
                          </PasswordWrapper>
                          {usernameHidden && messagesPerField.existsError("username", "password") && (
                            <FormMessageCustom id="input-error" className="text-destructive text-sm" aria-live="polite">
                              {kcSanitize(messagesPerField.getFirstError("username", "password"))}
                            </FormMessageCustom>
                          )}
                        </FormItemCustom>

                        <div
                          className={cn(
                            "flex items-center gap-4",
                            realm.rememberMe && !usernameHidden && realm.resetPasswordAllowed
                              ? "justify-between"
                              : realm.resetPasswordAllowed
                                ? "justify-end"
                                : "justify-start"
                          )}
                        >
                          {realm.rememberMe && !usernameHidden && (
                            <div id="kc-form-options">
                              <div className="flex items-center gap-3">
                                <Checkbox tabIndex={5} id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} />
                                <Label htmlFor="rememberMe">{msg("rememberMe")}</Label>
                              </div>
                            </div>
                          )}
                          {realm.resetPasswordAllowed && (
                            <Button variant="link" asChild className="p-0 h-auto">
                              <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                {msg("doForgotPassword")}
                              </a>
                            </Button>
                          )}
                        </div>

                        <div id="kc-form-buttons" className="pt-2">
                          <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                          <Button
                            tabIndex={7}
                            disabled={isLoginButtonDisabled}
                            className="w-full"
                            name="login"
                            id="kc-login"
                            type="submit"
                          >
                            {msgStr("doLogIn")}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Social Providers */}
                {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                  <div id="kc-social-providers" className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          {msg("identity-provider-login-label")}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "grid gap-2",
                        social.providers.length === 1 && "grid-cols-1",
                        social.providers.length === 2 && "grid-cols-2",
                        social.providers.length === 3 && "grid-cols-3",
                        social.providers.length > 3 && "grid-cols-1"
                      )}
                    >
                      {social.providers.map((...[p]) => (
                        <Button variant="outline" asChild key={p.alias}>
                          <a id={`social-${p.alias}`} href={p.loginUrl}>
                            {kcSanitize(p.displayName)}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registration Link */}
                {realm.password && realm.registrationAllowed && !registrationDisabled && (
                  <div className="text-center text-sm text-muted-foreground pt-2">
                    {msg("noAccount")}{" "}
                    <Button variant="link" asChild className="p-0 h-auto">
                      <a tabIndex={8} href={url.registrationUrl}>
                        {msg("doRegister")}
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;

  const { msgStr } = i18n;
  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

  return (
    <div className="relative">
      {cloneElement(children, {
        type: isPasswordRevealed ? "text" : "password",
        className: clsx(children.props.className, "pr-10")
      })}
      <button
        type="button"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
      >
        {isPasswordRevealed ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
      </button>
    </div>
  );
}
