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
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import actionData from "../../hooks/actionData";

export interface TableData<T> {
  title: string;
  headers: string[];
  data: T[];
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
      <Text>{title}</Text>
      {canCreate && (
        <Button onClick={() => navigate(routeName + "/create")}>Dodaj</Button>
      )}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              {headers.map((element, index) => (
                <Th key={index}>{element}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <Td key={cellIndex}>
                    {(row as any)[header]?.length > 20
                      ? (row as any)[header].substring(0, 20) + "..."
                      : (row as any)[header]}{" "}
                  </Td>
                ))}
                <Td>
                  {details && (
                    <Button
                      marginRight="2%"
                      onClick={() =>
                        navigate(
                          routeName +
                            "/details/" +
                            (routeName == "/user"
                              ? (row as any)[headers[2]]
                              : (row as any)[headers[0]])
                        )
                      }
                    >
                      Szczegóły
                    </Button>
                  )}
                  {canEdit && (
                    <Button
                      marginRight="2%"
                      onClick={() =>
                        navigate(
                          routeName + "/edit/" + (row as any)[headers[0]]
                        )
                      }
                    >
                      Edytuj
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      onClick={() => {
                        setSelectedRow((row as any)[headers[0]]);
                        onOpen();
                      }}
                    >
                      Usuń
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {others}

      {canDelete && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
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
