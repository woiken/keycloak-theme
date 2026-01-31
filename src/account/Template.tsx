import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import { getKcClsx } from "keycloakify/account/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/account/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertOctagon, AlertTriangle, CircleCheck, Info, UserCircle, Lock, Monitor, AppWindow, LogOut } from "lucide-react";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    kcContext,
    doUseDefaultCss,
    classes,
    children,
    active
  } = props;

  const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

  const { url, account, message, referrer } = kcContext;

  useSetClassName({
    qualifiedName: "html",
    className: kcClsx("kcHtmlClass")
  });

  useSetClassName({
    qualifiedName: "body",
    className: kcClsx("kcBodyClass")
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

  if (!isReadyToRender) {
    return null;
  }

  const navigationItems = [
    {
      id: "account",
      label: "Account",
      icon: UserCircle,
      url: url.accountUrl,
      isActive: active === "account"
    },
    {
      id: "password",
      label: "Password",
      icon: Lock,
      url: url.passwordUrl,
      isActive: active === "password"
    },
    {
      id: "sessions",
      label: "Sessions",
      icon: Monitor,
      url: url.sessionsUrl,
      isActive: active === "sessions"
    },
    {
      id: "applications",
      label: "Applications",
      icon: AppWindow,
      url: url.applicationsUrl,
      isActive: active === "applications"
    }
  ];

  return (
    <div className={clsx("min-h-screen bg-background", kcClsx("kcBodyClass"))}>
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Account Management</h1>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
            <div className="flex items-center gap-4">
              {account.username && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Signed in as: </span>
                  <span className="font-medium">{account.username}</span>
                </div>
              )}
              {referrer?.url && (
                <Button variant="outline" asChild>
                  <a href={referrer.url}>Back to {referrer.name}</a>
                </Button>
              )}
              <Button variant="outline" asChild>
                <a href={url.getLogoutUrl()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={item.isActive ? "default" : "ghost"}
                    className="justify-start"
                    asChild
                  >
                    <a href={item.url}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </a>
                  </Button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main>
            <Card>
              <CardContent className="space-y-6 pt-6">
                {/* Alert Messages */}
                {message !== undefined && (
                  <Alert variant={message.type}>
                    {message.type === "success" && <CircleCheck />}
                    {message.type === "warning" && <AlertTriangle />}
                    {message.type === "error" && <AlertOctagon />}
                    {message.type === "info" && <Info />}
                    <AlertDescription>{kcSanitize(message.summary)}</AlertDescription>
                  </Alert>
                )}

                {/* Page Content */}
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
