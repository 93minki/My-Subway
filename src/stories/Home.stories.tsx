import type { Meta, StoryObj } from "@storybook/react";

import Home from "@/pages/Home";
import { WebSocketProvider } from "@/provider/WebSocketProvider";

const meta = {
  title: "Page/Home",
  component: Home,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <WebSocketProvider>
        <Story />
      </WebSocketProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeStory: Story = {};
