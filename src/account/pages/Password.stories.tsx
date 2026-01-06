import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "password.ftl" });

const meta = {
  title: "account/password.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />
};

export const WithSuccessMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "success",
          summary: "Your password has been updated successfully."
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
          summary: "Failed to update password. Please check your current password."
        }
      }}
    />
  )
};

export const NoPasswordSet: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        password: {
          passwordSet: false
        }
      }}
    />
  )
};
