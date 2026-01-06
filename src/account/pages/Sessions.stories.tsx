import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "sessions.ftl" });

const meta = {
  title: "account/sessions.ftl",
  component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <KcPageStory />
};

export const WithMultipleSessions: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        sessions: {
          sessions: [
            {
              id: "session-1",
              ipAddress: "192.168.1.100",
              started: "2024-01-15 10:30:00",
              lastAccess: "2024-01-15 14:45:00",
              expires: "2024-01-16 10:30:00",
              clients: ["account-console", "my-app"]
            },
            {
              id: "session-2",
              ipAddress: "192.168.1.50",
              started: "2024-01-14 09:15:00",
              lastAccess: "2024-01-14 16:20:00",
              expires: "2024-01-15 09:15:00",
              clients: ["my-app"]
            },
            {
              id: "session-3",
              ipAddress: "10.0.0.25",
              started: "2024-01-13 08:00:00",
              lastAccess: "2024-01-13 17:30:00",
              expires: "2024-01-14 08:00:00",
              clients: ["mobile-app", "my-app"]
            }
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
        message: {
          type: "success",
          summary: "Session has been logged out successfully."
        }
      }}
    />
  )
};
