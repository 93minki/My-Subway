/* eslint-disable react-refresh/only-export-components */
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export default async (component: React.ReactNode) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(component),
  };
};
