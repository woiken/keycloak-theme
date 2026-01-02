import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
  title: "login/register.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />
};

export const WithTermsAcceptance: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        termsAcceptanceRequired: true
      }}
    />
  )
};

export const WithRecaptcha: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        recaptchaRequired: true,
        recaptchaVisible: true,
        recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      }}
    />
  )
};

export const WithErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        messagesPerField: {
          existsError: (fieldName: string) => fieldName === "email",
          exists: (fieldName: string) => fieldName === "global",
          get: (fieldName: string) => {
            if (fieldName === "email") {
              return "Email already exists";
            }
            return "";
          },
          getFirstError: () => "Email already exists",
          printIfExists: () => undefined
        },
        message: {
          type: "error",
          summary: "Please fix the errors below"
        }
      }}
    />
  )
};

export const WithCustomRealmName: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          displayName: "Woiken",
          displayNameHtml: "Woiken"
        }
      }}
    />
  )
};

export const WithMultipleLanguages: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        locale: {
          currentLanguageTag: "en",
          supported: [
            { languageTag: "en", label: "English", url: "#" },
            { languageTag: "de", label: "Deutsch", url: "#" },
            { languageTag: "fr", label: "Français", url: "#" }
          ]
        }
      }}
    />
  )
};

export const WithSuccessMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        messagesPerField: {
          existsError: () => false,
          exists: (fieldName: string) => fieldName === "global",
          get: () => "",
          getFirstError: () => "",
          printIfExists: () => undefined
        },
        message: {
          type: "success",
          summary: "Your account has been created. Please check your email to verify."
        }
      }}
    />
  )
};

export const WithWarningMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        messagesPerField: {
          existsError: () => false,
          exists: (fieldName: string) => fieldName === "global",
          get: () => "",
          getFirstError: () => "",
          printIfExists: () => undefined
        },
        message: {
          type: "warning",
          summary: "Password does not meet security requirements."
        }
      }}
    />
  )
};

export const WithTermsAndRecaptcha: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        termsAcceptanceRequired: true,
        recaptchaRequired: true,
        recaptchaVisible: true,
        recaptchaSiteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      }}
    />
  )
};

export const WoikenBranded: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          displayName: "Woiken",
          displayNameHtml: "Woiken"
        },
        locale: {
          currentLanguageTag: "en",
          supported: [
            { languageTag: "en", label: "English", url: "#" },
            { languageTag: "de", label: "Deutsch", url: "#" }
          ]
        }
      }}
    />
  )
};
