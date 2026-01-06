import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "account.ftl" });

const meta = {
  title: "account/account.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />
};

export const WithErrors: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        messagesPerField: {
          existsError: (fieldName: string) => {
            return fieldName === "email";
          },
          get: (fieldName: string) => {
            if (fieldName === "email") {
              return "Invalid email format.";
            }
            return "";
          }
        }
      }}
    />
  )
};

export const WithSuccessMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "success",
          summary: "Your account has been updated successfully."
        }
      }}
    />
  )
};

export const WithErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "error",
          summary: "Failed to update account. Please try again."
        }
      }}
    />
  )
};

export const ReadOnlyUsername: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: {
          editUsernameAllowed: false
        }
      }}
    />
  )
};
