import type { PageProps } from "keycloakify/account/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Globe, Clock, Trash2 } from "lucide-react";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "sessions.ftl" }>, I18n>) {
  const { kcContext, i18n } = props;
  const { url, sessions, stateChecker } = kcContext;
  const { msg } = i18n;

  const getDeviceIcon = (device?: string) => {
    if (!device) return Monitor;
    const lower = device.toLowerCase();
    if (lower.includes("mobile") || lower.includes("phone") || lower.includes("android") || lower.includes("iphone")) {
      return Smartphone;
    }
    return Monitor;
  };

  const formatDate = (dateStr?: string | number) => {
    if (!dateStr) return "Unknown";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Manage your active sessions across devices
      </p>

      {sessions.sessions && sessions.sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.sessions.map((session, index) => {
            const DeviceIcon = getDeviceIcon(session.clients?.join(", "));
            return (
              <Card key={index}>
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="flex gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center self-start rounded-full bg-muted">
                      <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {session.clients?.join(", ") || "Unknown Application"}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {session.ipAddress && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {session.ipAddress}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Started {formatDate(session.started)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last access: {formatDate(session.lastAccess)}
                      </div>
                    </div>
                  </div>
                  {index > 0 && (
                    <form action={url.sessionsUrl} method="post">
                      <input type="hidden" name="stateChecker" value={stateChecker} />
                      <input type="hidden" name="sessionId" value={session.id} />
                      <Button variant="ghost" size="sm" type="submit" name="action" value="logout">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Monitor className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium">No active sessions</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any other active sessions.
          </p>
        </div>
      )}

      {sessions.sessions && sessions.sessions.length > 1 && (
        <form action={url.sessionsUrl} method="post">
          <input type="hidden" name="stateChecker" value={stateChecker} />
          <Button variant="destructive" type="submit" name="action" value="logoutAll">
            {msg("doLogOutAllSessions")}
          </Button>
        </form>
      )}
    </div>
  );
}
