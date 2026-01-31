import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/account";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/account/DefaultPage";
import Template from "./Template";

import "./main.css";

const Account = lazy(() => import("./pages/Account"));
const Password = lazy(() => import("./pages/Password"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Applications = lazy(() => import("./pages/Applications"));

export default function KcPage(props: { kcContext: KcContext }) {
  const { kcContext } = props;

  const { i18n } = useI18n({ kcContext });

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
          case "account.ftl":
            return (
              <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={false}
                classes={classes}
                active="account"
              >
                <Account
                  kcContext={kcContext}
                  i18n={i18n}
                  doUseDefaultCss={false}
                  classes={classes}
                  Template={Template}
                />
              </Template>
            );
          case "password.ftl":
            return (
              <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={false}
                classes={classes}
                active="password"
              >
                <Password
                  kcContext={kcContext}
                  i18n={i18n}
                  doUseDefaultCss={false}
                  classes={classes}
                  Template={Template}
                />
              </Template>
            );
          case "sessions.ftl":
            return (
              <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={false}
                classes={classes}
                active="sessions"
              >
                <Sessions
                  kcContext={kcContext}
                  i18n={i18n}
                  doUseDefaultCss={false}
                  classes={classes}
                  Template={Template}
                />
              </Template>
            );
          case "applications.ftl":
            return (
              <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={false}
                classes={classes}
                active="applications"
              >
                <Applications
                  kcContext={kcContext}
                  i18n={i18n}
                  doUseDefaultCss={false}
                  classes={classes}
                  Template={Template}
                />
              </Template>
            );
          default:
            return (
              <DefaultPage
                kcContext={kcContext}
                i18n={i18n}
                classes={classes}
                Template={Template}
                doUseDefaultCss={false}
              />
            );
        }
      })()}
    </Suspense>
  );
}

const classes = {} satisfies { [key in ClassKey]?: string };
