import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import { getKcClsx } from "keycloakify/account/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/account/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AlertOctagon, AlertTriangle, CircleCheck, Info, UserCircle, Lock, Monitor, AppWindow, LogOut, ArrowLeft } from "lucide-react";

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

  const activeItem = navigationItems.find(item => item.isActive);

  const displayName = [account.firstName, account.lastName].filter(Boolean).join(" ") || account.username || "";
  const initials =
    [account.firstName, account.lastName]
      .filter(Boolean)
      .map(name => name!.charAt(0).toUpperCase())
      .join("") ||
    account.username?.charAt(0).toUpperCase() ||
    "";

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                  {initials || <UserCircle className="size-5" />}
                </div>
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  {account.email && <span className="truncate text-xs text-sidebar-foreground/60">{account.email}</span>}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>
                          <Icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            {referrer?.url && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href={referrer.url}>
                    <ArrowLeft />
                    <span>Back to {referrer.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={url.getLogoutUrl()}>
                  <LogOut />
                  <span>Sign Out</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{activeItem?.label ?? "Account Management"}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Manage your account settings</p>
          </div>
          <ThemeToggle className="ml-auto" />
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
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
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
