import React from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export function TextEntry() {
  const [input, setInput] = useState("");
  const [modelSelect, setModelSelect] = useState(1);
  const [microaggression, setMicroaggression] = useState(false);
  const [microtype, setMicrotype] = useState('none');
  const toast = useToast();

  const handleChange = (e) => {
    setInput(e.target.value);
    console.log(e.target.value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleSubmit = () => {
    console.log(input);


    // HERE IS WHERE FE WILL INTERACT WITH MODEL!!

    // send "input" to model
    // get back info
    // set microaggression boolean state 
    // set microtype 

    if (!microaggression) {
      toast({
        title: "This is a microaggression",
        description: "it is a thing type of microaggression",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    } else {
      toast({
        title: "This is not a microaggression",
        status: "success",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Center>
        <Stack w="50%">
          <Text fontSize="24pt" fontWeight="semibold" pb="20px">
            Check message for microaggressions:
          </Text>
          <RadioGroup onChange={setModelSelect} value={modelSelect}>
            <HStack
              my='-10px'
              bg="whitesmoke"
              p="10px"
              borderRadius="xl"
              w="min-content"
              whiteSpace="nowrap"
              shadow="2px 2px 10px darkgray"
              border='2px solid black'
              borderBottomLeftRadius='none'
              borderBottomRightRadius='none'
              fontWeight='semibold'
              spacing='20px'
            >
              <Radio value="1" size='lg' colorScheme='green' border='2px solid #404040 !important'>
                Exclusively BERT Transformer
              </Radio>
              <Radio value="2" size='lg' colorScheme='green' border='2px solid #404040 !important'>
                Count Vectorizer + BERT Transformer
              </Radio>
            </HStack>
          </RadioGroup>
          <Textarea
            placeholder="Enter your text here and see if it is considered a microaggression"
            value={input}
            onChange={handleChange}
            bg="white"
            border="2px solid black"
            borderRadius="xl"
            borderTopLeftRadius='none'
            maxH="30vh"
            shadow="2px 2px 10px darkgray"
            _hover={{ border: "2px solid #61A89D" }}
          />
          <HStack>
            <Button
              onClick={handleSubmit}
              border="2px solid black"
              shadow="2px 2px 10px darkgray"
              borderRadius="full"
              bg="#61A89D"
              _hover={{ bg: "#A3CCC6", shadow: "none" }}
            >
              Submit
            </Button>
            <Button
              onClick={handleClear}
              border="2px solid black"
              shadow="2px 2px 10px darkgray"
              borderRadius="full"
              bg="#E36372"
              _hover={{ bg: "#ED97A1", shadow: "none" }}
            >
              Clear
            </Button>
          </HStack>
        </Stack>
      </Center>
    </div>
  );
}
