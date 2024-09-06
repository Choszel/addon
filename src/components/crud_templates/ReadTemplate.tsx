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
} from "@chakra-ui/react";

export interface TableData<T> {
  title: string;
  headers: string[];
  data: T[];
  onAdd: () => void;
}

const ReadTemplate = <T extends object>({
  title,
  headers,
  data,
  onAdd,
}: TableData<T>) => {
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
                  <Button marginRight="2%">Edytuj</Button>
                  <Button>Usuń</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ReadTemplate;
