import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "@/components/AvatarUpload";
import { Separator } from "@/components/ui/separator";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
  const { kcContext, i18n } = props;
  const { url, realm, messagesPerField, account } = kcContext;
  const { msg } = i18n;

  // Extract realm name from URL (e.g., /realms/myrealm/account)
  const getRealmName = (): string => {
    const match = url.accountUrl.match(/\/realms\/([^/]+)/);
    return match?.[1] ?? "master";
  };

  return (
    <form action={url.accountUrl} method="post">
      <input type="hidden" name="stateChecker" value={kcContext.stateChecker} />

      <div className="space-y-6">
        {/* Avatar upload section */}
        <AvatarUpload
          realm={getRealmName()}
          firstName={account.firstName ?? undefined}
          lastName={account.lastName ?? undefined}
        />

        <Separator />

        {/* Username field - only editable if allowed */}
        {realm.editUsernameAllowed ? (
          <div className="space-y-2">
            <Label htmlFor="username">
              {msg("username")}
              {realm.registrationEmailAsUsername ? null : <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              defaultValue={account.username ?? ""}
              autoComplete="username"
              aria-invalid={messagesPerField.existsError("username")}
            />
            {messagesPerField.existsError("username") && (
              <p className="text-sm text-destructive">{messagesPerField.get("username")}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label>{msg("username")}</Label>
            <p className="text-sm text-muted-foreground">{account.username}</p>
          </div>
        )}

        {/* Email field */}
        <div className="space-y-2">
          <Label htmlFor="email">
            {msg("email")}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue={account.email ?? ""}
            autoComplete="email"
            aria-invalid={messagesPerField.existsError("email")}
          />
          {messagesPerField.existsError("email") && (
            <p className="text-sm text-destructive">{messagesPerField.get("email")}</p>
          )}
        </div>

        {/* First Name field */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {msg("firstName")}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            defaultValue={account.firstName ?? ""}
            autoComplete="given-name"
            aria-invalid={messagesPerField.existsError("firstName")}
          />
          {messagesPerField.existsError("firstName") && (
            <p className="text-sm text-destructive">{messagesPerField.get("firstName")}</p>
          )}
        </div>

        {/* Last Name field */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            {msg("lastName")}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={account.lastName ?? ""}
            autoComplete="family-name"
            aria-invalid={messagesPerField.existsError("lastName")}
          />
          {messagesPerField.existsError("lastName") && (
            <p className="text-sm text-destructive">{messagesPerField.get("lastName")}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="flex gap-4 pt-4">
          <Button type="submit">{msg("doSave")}</Button>
          <Button type="reset" variant="outline">
            {msg("doCancel")}
          </Button>
        </div>
      </div>
    </form>
  );
}
