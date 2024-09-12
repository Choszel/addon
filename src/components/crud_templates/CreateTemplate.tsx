import { useRef, useEffect, useState } from "react";
import {
  Button,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
} from "@chakra-ui/react";

interface Props {
  id: number;
  value: string;
}

export interface FormData {
  title: string;
  headers: {
    inputName: string;
    inputType: string;
    isRequired: boolean;
    data?: Props[];
  }[];
  setRefs: (refs: (HTMLInputElement | HTMLSelectElement | null)[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FormTemplate = ({
  title,
  headers,
  setRefs,
  onSave,
  onCancel,
}: FormData) => {
  const localRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);
  const [errors, setErrors] = useState<boolean[]>(
    Array(headers.length).fill(true)
  );

  useEffect(() => {
    setRefs(localRefs.current);
  }, [setRefs]);

  const handleInputChange = (value: string, index: number) => {
    const updatedErrors = [...errors];
    updatedErrors[index] = headers[index].isRequired && value === "";
    setErrors(updatedErrors);
  };

  return (
    <>
      <Text marginBottom="3%">{title}</Text>
      {headers.map((input, index) => (
        <div key={index}>
          <HStack marginBottom="2%">
            <Text>{input.inputName}</Text>
            {input.inputType === "number" ? (
              <NumberInput
                defaultValue={0}
                onChange={(valueString) =>
                  handleInputChange(valueString, index)
                }
              >
                <NumberInputField
                  ref={(el) => {
                    localRefs.current[index] = el;
                  }}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            ) : input.inputType === "select" ? (
              <Select
                ref={(el) => {
                  localRefs.current[index] = el;
                }}
              >
                {input.data?.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.value}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                ref={(el) => {
                  localRefs.current[index] = el;
                }}
                onChange={(e) => handleInputChange(e.target.value, index)}
              />
            )}
          </HStack>
          {input.isRequired && errors[index] && (
            <Text
              display="flex"
              className="small"
              marginBottom="2%"
              style={{ color: "var(--error)" }}
            >
              Pole "{input.inputName}" nie może być puste.
            </Text>
          )}
        </div>
      ))}
      <HStack>
        <Button
          onClick={() => {
            const errorId = errors.findIndex(
              (e, index) => e == true && headers[index].isRequired
            );
            if (errorId != -1) {
              localRefs.current[errorId]?.focus();
              return;
            }
            onSave();
          }}
        >
          Zapisz
        </Button>
        <Button onClick={onCancel}>Anuluj</Button>
      </HStack>
    </>
  );
};

export default FormTemplate;
