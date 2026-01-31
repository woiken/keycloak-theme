import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { AppWindow, Shield, ExternalLink, Trash2 } from "lucide-react";

export default function Applications(props: PageProps<Extract<KcContext, { pageId: "applications.ftl" }>, I18n>) {
  const { kcContext, i18n } = props;
  const { url, applications, stateChecker } = kcContext;
  const { msg } = i18n;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{msg("applicationsHtmlTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          Applications that have access to your account
        </p>
      </div>

      {applications.applications && applications.applications.length > 0 ? (
        <div className="space-y-4">
          {applications.applications.map((app, index) => {
            const clientName = app.client?.name || app.client?.clientId || "Unknown Application";
            const clientId = app.client?.clientId || "";
            const baseUrl = app.client?.baseUrl;
            const description = app.client?.description;
            const consentRequired = app.client?.consentRequired;

            return (
              <div
                key={index}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="rounded-full bg-muted p-3">
                      <AppWindow className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{clientName}</span>
                        {baseUrl && (
                          <a
                            href={baseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                      )}
                      {consentRequired && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Shield className="h-3 w-3" />
                          Consent required
                        </div>
                      )}
                      {app.realmRolesAvailable && app.realmRolesAvailable.length > 0 && (
                        <div className="pt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-1">Permissions:</div>
                          <div className="flex flex-wrap gap-1">
                            {app.realmRolesAvailable.map((role, roleIndex) => (
                              <span
                                key={roleIndex}
                                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs"
                              >
                                {role?.description || role?.name || "Unknown"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {consentRequired && clientId && (
                    <form action={url.applicationsUrl} method="post">
                      <input type="hidden" name="stateChecker" value={stateChecker} />
                      <input type="hidden" name="clientId" value={clientId} />
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        name="action"
                        value="revoke"
                        title="Revoke access"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <AppWindow className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium">No applications</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No applications have been granted access to your account yet.
          </p>
        </div>
      )}
    </div>
  );
}
