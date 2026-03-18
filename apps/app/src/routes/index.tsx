import {
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  PasswordInput,
  Radio,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@repo/mantine/core";
import { notifications } from "@repo/mantine/notifications";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleGenderChange = (value: string | null) => {
    console.log("Selected country:", value);
    notifications.show({
      title: "Gender Selected",
      message: `You selected: ${value}`,
      autoClose: 3000,
      loading: true,
    });
  };

  return (
    <Container size="sm" className="py-20">
      <Stack gap="lg" align="center">
        <Title order={1}>Mantine Theme Test</Title>
        <Title order={3} c="dimmed">
          Simple form to test the theme
        </Title>

        <Box component="form" maw={400}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="your@email.com"
              description="Enter your email address"
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              description="Must be at least 8 characters"
              required
            />

            <NumberInput
              label="Age"
              placeholder="Enter your age"
              min={0}
              max={120}
            />

            <Select
              label="Country"
              placeholder="Select your country"
              data={[
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
                { value: "jp", label: "Japan" },
                { value: "th", label: "Thailand" },
              ]}
            />

            <Radio.Group
              label="Gender"
              name="gender"
              onChange={handleGenderChange}
            >
              <Group mt="xs">
                <Radio value="male" label="Male" />
                <Radio value="female" label="Female" />
                <Radio value="other" label="Other" />
              </Group>
            </Radio.Group>

            <Textarea
              label="About"
              placeholder="Tell us about yourself"
              minRows={3}
            />

            <Checkbox label="I agree to the terms and conditions" required />

            <Group mt="md">
              <Button type="submit">Submit</Button>
              <Button variant="light" type="button">
                Cancel
              </Button>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
