import { useRef, useEffect, useState, ReactNode } from "react";
import {
  Button,
  HStack,
  Input,
  InputGroup,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
} from "@chakra-ui/react";

interface Props {
  id: number | string;
  value: string;
}

export interface FormData {
  title: string;
  headers: {
    inputName: string;
    inputType: string;
    isRequired: boolean;
    maxLength?: number;
    data?: Props[];
    isLoading?: boolean;
    error?: string;
    onChange?: (e: any) => void;
  }[];
  setRefs: (refs: (HTMLInputElement | HTMLSelectElement | null)[]) => void;
  onSave: () => void;
  onCancel: () => void;
  others?: ReactNode;
}

const FormTemplate = ({
  title,
  headers,
  setRefs,
  onSave,
  onCancel,
  others,
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
    updatedErrors[index] =
      (headers[index].isRequired && value === "") ||
      value.length > (headers[index].maxLength ?? value.length + 1);
    setErrors(updatedErrors);
  };

  return (
    <>
      <Text marginBottom="3%" className="p2">
        {title}
      </Text>
      {headers.map((input, index) => (
        <div key={index}>
          <HStack marginBottom={{ base: "10%", md: "5%", lg: "2%" }}>
            <Text marginRight="1%" textAlign="left">
              {input.inputName}
            </Text>
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
              input?.isLoading ? (
                <Spinner />
              ) : input?.error ? (
                <Text color="var(--error)">{input?.error}</Text>
              ) : (
                <select
                  className="select-primary"
                  ref={(el) => {
                    localRefs.current[index] = el;
                  }}
                  onChange={(e) =>
                    input?.onChange ? input?.onChange(e) : null
                  }
                >
                  {input.data?.map((option) => (
                    <option value={option.id} key={option.id}>
                      {option.value}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <InputGroup className="basic_style">
                <Input
                  ref={(el) => {
                    localRefs.current[index] = el;
                  }}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  _focus={{ border: "2px solid var(--secondary-dark)" }}
                  maxLength={250}
                  style={{ backgroundColor: "var(--foreground)" }}
                />
              </InputGroup>
            )}
          </HStack>
          {input.isRequired && errors[index] && (
            <Text
              display="flex"
              className="small"
              marginBottom="2%"
              style={{ color: "var(--error)" }}
            >
              {localRefs.current[index]?.value == ""
                ? `Pole ${input.inputName}" nie może być puste.`
                : `Wartość pola ${input.inputName}" jest zbyt długa.`}
            </Text>
          )}
        </div>
      ))}
      {others}
      <HStack marginY="5%" justifyContent="center" spacing={6}>
        <Button
          colorScheme="blue"
          onClick={() => {
            const errorId = errors.findIndex(
              (e, index) =>
                (e == true && headers[index].isRequired) ||
                (e == true && (headers[index].maxLength ?? 0 > 0))
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
        <Button colorScheme="red" onClick={onCancel}>
          Anuluj
        </Button>
      </HStack>
    </>
  );
};

export default FormTemplate;
