import { TextNumeric } from "@repo/mantine/components";
import {
  Button,
  Checkbox,
  Container,
  FileInput,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from "@repo/mantine/core";
import { DatePickerInput } from "@repo/mantine/dates";
import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

export const Route = createFileRoute("/form")({
  component: RouteComponent,
});

const PROVINCES = [
  { value: "bangkok", label: "Bangkok" },
  { value: "chiang-mai", label: "Chiang Mai" },
  { value: "pattaya", label: "Pattaya" },
] as const;

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(9, "Phone is required")
    .refine((val) => val.replace(/-/g, "").length === 10, {
      message: "Phone number must be 10 digits",
    }),
  postcode: z.string().min(5, "Postcode is required"),
  province: z.string().min(1, "Province is required"),
  billDate: z.union([z.string(), z.date()], "Bill date is required"),
  billAmount: z.number(),
  file: z.instanceof(File),
  consentToS: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service",
  }),
  consentPDPA: z.boolean().refine((val) => val === true, {
    message: "You must agree to the PDPA privacy policy",
  }),
});

type FormValues = z.infer<typeof formSchema>;
const defaultValues = {
  firstName: "",
  lastName: "",
  phone: "",
  postcode: "",
  province: "",
  billDate: undefined as unknown as string,
  billAmount: "" as unknown as number,
  file: undefined as unknown as File,
  consentToS: false,
  consentPDPA: false,
} satisfies FormValues as FormValues;

// Helper to safely extract error message from TanStack Form field errors
function getFieldError(errors: unknown[]): string | undefined {
  const first = errors[0];
  if (!first) return undefined;
  if (typeof first === "string") return first;
  if (typeof first === "object" && first !== null && "message" in first) {
    return (first as { message: string }).message;
  }
  return String(first);
}

function RouteComponent() {
  const form = useForm({
    defaultValues,
    validators: {
      onDynamic: formSchema,
      onSubmit: formSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "change",
    }),
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
    },
  });

  const state = useStore(form.store, (state) => state.values.file);

  return (
    <Container size="md" className="py-10 bg-brand-ci">
      <Stack gap="lg">
        <Title order={1}>Registration Form</Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Stack gap="md">
            {/* Row 1: First Name, Last Name */}
            <Group grow>
              <form.Field name="firstName">
                {(field) => (
                  <TextInput
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={
                      typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : undefined
                    }
                  />
                )}
              </form.Field>

              <form.Field name="lastName">
                {(field) => (
                  <TextInput
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={
                      typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </Group>

            {/* Row 2: Phone (Full Width) */}
            <form.Field name="phone">
              {(field) => (
                <TextNumeric
                  wrapper={{
                    required: true,
                    label: "Phone",
                    error: getFieldError(field.state.meta.errors),
                  }}
                  input={{
                    value: field.state.value,
                    placeholder: "Enter phone number",
                    onChange: (e) => field.handleChange(e.target.value),
                  }}
                  mask="000-0000000"
                />
              )}
            </form.Field>

            {/* Row 3: Postcode, Province (Dropdown) */}
            <Group grow>
              <form.Field name="postcode">
                {(field) => (
                  <TextNumeric
                    wrapper={{
                      required: true,
                      label: "Postcode",
                      error: getFieldError(field.state.meta.errors),
                    }}
                    input={{
                      value: field.state.value,
                      placeholder: "Enter postcode",
                      onChange: (e) => field.handleChange(e.target.value),
                    }}
                    mask="00000"
                  />
                )}
              </form.Field>

              <form.Field name="province">
                {(field) => (
                  <Select
                    label="Province"
                    placeholder="Select province"
                    required
                    data={PROVINCES}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value || "")}
                    error={
                      typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : undefined
                    }
                  />
                )}
              </form.Field>
            </Group>

            {/* Row 4: Bill Date, Bill Amount */}
            <Group grow>
              <form.Field name="billDate">
                {(field) => (
                  <DatePickerInput
                    label="Bill Date"
                    placeholder="Select bill date"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value as string)}
                    clearable
                  />
                )}
              </form.Field>

              <form.Field name="billAmount">
                {(field) => (
                  <NumberInput
                    label="Bill Amount"
                    placeholder="Enter bill amount"
                    hideControls
                    min={0}
                    allowNegative={false}
                    decimalScale={2}
                    value={field.state.value || ""}
                    onChange={(value) => {
                      field.handleChange(+value);
                    }}
                  />
                )}
              </form.Field>
            </Group>

            {/* Row 5: File Input */}
            <form.Field name="file">
              {(field) => (
                <FileInput
                  label="Upload File"
                  placeholder="Upload a file"
                  accept="image/*,.pdf,.doc,.docx"
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value as File)}
                  clearable
                />
              )}
            </form.Field>

            {/* Row 6: Checkbox ToS Consent */}
            <form.Field name="consentToS">
              {(field) => (
                <Checkbox
                  required
                  label="I agree to the Terms of Service"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  error={
                    typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                  autoContrast
                />
              )}
            </form.Field>

            {/* Row 7: Checkbox PDPA Consent */}
            <form.Field name="consentPDPA">
              {(field) => (
                <Checkbox
                  required
                  label="I agree to the PDPA (Personal Data Protection Act)"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  error={
                    typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                  autoContrast
                />
              )}
            </form.Field>

            {/* Submit Button */}
            <Group mt="md">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    loading={isSubmitting}
                  >
                    Submit
                  </Button>
                )}
              </form.Subscribe>
              <Button
                variant="light"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </Container>
  );
}
