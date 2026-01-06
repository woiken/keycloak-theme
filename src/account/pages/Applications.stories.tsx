import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "applications.ftl" });

const meta = {
  title: "account/applications.ftl",
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
          summary: "Access has been revoked successfully."
        }
      }}
    />
  )
};

export const WithWarningMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: {
          type: "warning",
          summary: "Some applications may take time to reflect the changes."
        }
      }}
    />
  )
};
