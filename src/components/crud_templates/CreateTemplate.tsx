import { useRef, useEffect } from "react";
import {
  Button,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";

export interface FormData {
  header: string;
  data: { inputName: string; inputType: string; isRequired: boolean }[];
  setRefs: (refs: (HTMLInputElement | null)[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormTemplate = ({
  header,
  data,
  setRefs,
  onSave,
  onCancel,
}: FormData) => {
  const localRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setRefs(localRefs.current);
  }, [setRefs]);

  return (
    <>
      <Text marginBottom="3%">{header}</Text>
      {data.map((input, index) => (
        <HStack key={index} marginBottom="2%">
          <Text>{input.inputName}</Text>
          {input.inputType === "number" ? (
            <NumberInput defaultValue={0}>
              <NumberInputField
                ref={(el) => {
                  if (input.isRequired) {
                    localRefs.current[index] = el;
                  }
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          ) : (
            <Input
              ref={(el) => {
                if (input.isRequired) {
                  localRefs.current[index] = el;
                }
              }}
            />
          )}
        </HStack>
      ))}
      <HStack>
        <Button onClick={onSave}>Zapisz</Button>
        <Button onClick={onCancel}>Anuluj</Button>
      </HStack>
    </>
  );
};

export default FormTemplate;
