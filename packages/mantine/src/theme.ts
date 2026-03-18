import { colorsTuple, createTheme } from "@mantine/core";

const mantineTheme = createTheme({
  colors: {
    "brand-ci": colorsTuple("#000"),
  },
  primaryColor: "red",
});

export default mantineTheme;
