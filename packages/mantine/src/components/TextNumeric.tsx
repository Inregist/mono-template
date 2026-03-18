import { Input, type InputWrapperProps } from "@mantine/core";
import { IMaskInput } from "react-imask";

type IMaskProps = Omit<
  React.ComponentProps<typeof IMaskInput>,
  "mask" | "size"
>;

interface TextNumericProps {
  wrapper: InputWrapperProps;
  input?: IMaskProps;
  mask: string;
}

export const TextNumeric = (props: TextNumericProps) => {
  const { wrapper, input, mask } = props;

  return (
    <Input.Wrapper {...wrapper}>
      <Input {...input} component={IMaskInput} mask={mask} />
    </Input.Wrapper>
  );
};
