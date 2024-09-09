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
import { useState } from "react";

export interface TableData<T> {
  title: string;
  headers: string[];
  data: T[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ReadTemplate = <T extends object>({
  title,
  headers,
  data,
  onAdd,
  onDelete,
  onEdit,
}: TableData<T>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <>
      <Text>{title}</Text>
      <Button onClick={onAdd}>Dodaj</Button>
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
                  <Td key={cellIndex}>{(row as any)[header]} </Td>
                ))}
                <Td>
                  <Button
                    marginRight="2%"
                    onClick={() => onEdit((row as any)[headers[0]])}
                  >
                    Edytuj
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedRow((row as any)[headers[0]]);
                      onOpen();
                    }}
                  >
                    Usuń
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

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
              onClick={() => onDelete(selectedRow ?? -1)}
            >
              Usuń
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReadTemplate;
