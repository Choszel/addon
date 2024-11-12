import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
  Text,
  Button,
  Th,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Stack,
  Show,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";

export interface TableData<T> {
  title: string;
  headers: string[];
  data: T[];
  isLoading: boolean;
  error: string;
  canCreate?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  details?: boolean;
  routeName?: string;
  others?: ReactNode;
}

const ReadTemplate = <T extends object>({
  title,
  headers,
  data,
  isLoading,
  error,
  canCreate,
  canDelete,
  canEdit,
  details,
  routeName,
  others,
}: TableData<T>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { deleteData } = actionData(routeName ?? "");
  const navigate = useNavigate();

  return (
    <>
      <Text className="p2" marginBottom="1%">
        {title}
      </Text>
      {canCreate && (
        <button
          className="button_secondary"
          onClick={() => navigate(routeName + "/create")}
        >
          Dodaj
        </button>
      )}
      {error && (
        <Text marginTop="2%" color="var(--error)">
          {error}
        </Text>
      )}
      {isLoading && (
        <div>
          <Spinner marginTop="2%" size="xl"></Spinner>
        </div>
      )}
      <TableContainer
        marginX={{ base: "0%", md: "7%" }}
        marginY={{ base: "5%", md: "0%" }}
      >
        <Table size={{ base: "xs", md: "lg" }}>
          <Thead>
            <Tr>
              {headers.map((element, index) => (
                <>
                  <Show above="md">
                    <Th
                      key={index}
                      color="var(--primary-light)"
                      borderBottom="2px solid var(--copy)"
                    >
                      {element}
                    </Th>
                  </Show>
                  <Show below="md">
                    {index < 2 ? (
                      <Th
                        key={index}
                        color="var(--primary-light)"
                        borderBottom="2px solid var(--copy)"
                      >
                        {element}
                      </Th>
                    ) : null}
                  </Show>
                </>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <>
                    <Show above="md">
                      <Td key={cellIndex}>
                        {(row as any)[header]?.length > 20
                          ? (row as any)[header].substring(0, 20) + "..."
                          : (row as any)[header]}
                      </Td>
                    </Show>
                    <Show below="md">
                      {cellIndex < 2 ? (
                        <Td key={cellIndex}>
                          {(row as any)[header]?.length > 20
                            ? (row as any)[header].substring(0, 20) + "..."
                            : (row as any)[header]}
                        </Td>
                      ) : null}
                    </Show>
                  </>
                ))}
                <Td>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justify="center"
                    align="center"
                    marginY={{ base: "5%", md: "0%" }}
                  >
                    {details && (
                      <button
                        style={{ marginRight: "2%" }}
                        className="button_secondary"
                        onClick={() =>
                          navigate(
                            routeName +
                              "/details/" +
                              (routeName == "/user"
                                ? (row as any)[headers[1]]
                                : (row as any)[headers[0]])
                          )
                        }
                      >
                        Szczegóły
                      </button>
                    )}
                    {canEdit && (
                      <button
                        style={{ marginRight: "2%" }}
                        className="button_secondary"
                        onClick={() =>
                          navigate(
                            routeName + "/edit/" + (row as any)[headers[0]]
                          )
                        }
                      >
                        Edytuj
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="button_secondary"
                        onClick={() => {
                          setSelectedRow((row as any)[headers[0]]);
                          onOpen();
                        }}
                      >
                        Usuń
                      </button>
                    )}
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {others}

      {canDelete && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="var(--foreground)">
            <ModalCloseButton />
            <ModalBody>
              Czy na pewno chcesz usunąć rekord o id {selectedRow}?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  const formData = new URLSearchParams();
                  formData.append("id", (selectedRow ?? -1).toString());
                  deleteData(formData);
                  window.location.reload(); // nie widać po tym toast
                }}
              >
                Usuń
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Anuluj
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ReadTemplate;
