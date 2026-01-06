import { useState } from "react";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Password(props: PageProps<Extract<KcContext, { pageId: "password.ftl" }>, I18n>) {
  const { kcContext, i18n } = props;
  const { url, password, account } = kcContext;
  const { msg } = i18n;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = newPassword === confirmPassword;
  const isFormValid = password.passwordSet
    ? currentPassword.length > 0 && newPassword.length > 0 && passwordsMatch
    : newPassword.length > 0 && passwordsMatch;

  return (
    <form action={url.passwordUrl} method="post">
      <input type="hidden" name="stateChecker" value={kcContext.stateChecker} />
      {/* Hidden username field for password managers */}
      <input
        type="text"
        id="username"
        name="username"
        defaultValue={account.username ?? ""}
        autoComplete="username"
        readOnly
        hidden
        aria-hidden="true"
      />

      <div className="space-y-6">
        {/* Current Password field - only shown if password is set */}
        {password.passwordSet && (
          <div className="space-y-2">
            <Label htmlFor="password">
              {msg("password")}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              autoFocus
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        )}

        {/* New Password field */}
        <div className="space-y-2">
          <Label htmlFor="password-new">
            {msg("passwordNew")}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="password"
            id="password-new"
            name="password-new"
            autoComplete="new-password"
            autoFocus={!password.passwordSet}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password field */}
        <div className="space-y-2">
          <Label htmlFor="password-confirm">
            {msg("passwordConfirm")}
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            type="password"
            id="password-confirm"
            name="password-confirm"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={confirmPassword.length > 0 && !passwordsMatch}
          />
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="text-sm text-destructive">{msg("passwordConfirmNotMatch")}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={!isFormValid}>
            {msg("doSave")}
          </Button>
        </div>
      </div>
    </form>
  );
}
