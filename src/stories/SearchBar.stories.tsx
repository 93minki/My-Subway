import SearchBar from "@/components/SearchBar";
import { WebSocketProvider } from "@/provider/WebSocketProvider";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

const meta = {
  title: "/Component/SearchBar",
  component: SearchBar,
  decorators: [
    (Story) => (
      <WebSocketProvider>
        <Story />
      </WebSocketProvider>
    ),
  ],
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchBarStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const searchButton = canvas.getByRole("button", { name: "검색" });
    await expect(searchButton).toBeInTheDocument();
    const input = canvas.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await expect(input).toBeInTheDocument();

    await userEvent.type(input, "남성");
    await userEvent.click(searchButton);
  },
};
