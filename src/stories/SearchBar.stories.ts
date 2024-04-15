import type { Meta, StoryObj } from "@storybook/react";

import SearchBar from "@/components/SearchBar";

const meta = {
  title: "/Component/SearchBar",
  component: SearchBar,
  parameters: {},
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SearchBarStory:Story = {
  
}