import React from "react";
import {
  Button,
  Center,
  HStack,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

export function TextEntry() {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
    console.log(e.target.value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleSubmit = () => {
    // check for MAs here beep
    console.log(input);
  };

  return (
    <div>
      <Center>
        <Stack w="50%" mt="200px">
          <Text fontSize="24pt" fontWeight="semibold" pb="20px">
            Check message for microaggressions:
          </Text>
          <Textarea
            placeholder="Enter your text here and see if it is considered a microaggression"
            value={input}
            onChange={handleChange}
            bg="white"
            border="2px solid black"
            borderRadius="xl"
            maxH='30vh'
            shadow="2px 2px 10px darkgray"
            _hover={{ border: '2px solid #61A89D'}}
          />
          <HStack>
            <Button
              onClick={handleSubmit}
              border="2px solid black"
              shadow="2px 2px 10px darkgray"
              borderRadius="full"
              bg="#61A89D"
              _hover={{ bg: "#A3CCC6", shadow: 'none' }}
            >
              Submit
            </Button>
            <Button
              onClick={handleClear}
              border="2px solid black"
              shadow="2px 2px 10px darkgray"
              borderRadius="full"
              bg="#E36372"
              _hover={{ bg: "#ED97A1", shadow: 'none' }}
            >
              Clear
            </Button>
          </HStack>
        </Stack>
      </Center>
    </div>
  );
}
