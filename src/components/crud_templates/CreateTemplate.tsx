import { useRef, useEffect, useState, ReactNode } from "react";
import {
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
    data?: Props[];
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
    updatedErrors[index] = headers[index].isRequired && value === "";
    setErrors(updatedErrors);
  };

  return (
    <>
      <Text marginBottom="3%" className="p2">
        {title}
      </Text>
      {headers.map((input, index) => (
        <div key={index}>
          <HStack marginBottom="2%">
            <Text marginRight="1%">{input.inputName}</Text>
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
              <select
                className="select-primary"
                style={{ width: "10%" }}
                ref={(el) => {
                  localRefs.current[index] = el;
                }}
              >
                {input.data?.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.value}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                className="basic_style"
                ref={(el) => {
                  localRefs.current[index] = el;
                }}
                onChange={(e) => handleInputChange(e.target.value, index)}
                _focus={{ border: "2px solid var(--secondary-dark)" }}
                maxLength={250}
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
      {others}
      <HStack marginY="5%" justifyContent="center" spacing={6}>
        <button
          className="button_success"
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
        </button>
        <button className="button_error" onClick={onCancel}>
          Anuluj
        </button>
      </HStack>
    </>
  );
};

export default FormTemplate;
