import React from "react";
//import ip_addr from "./ip.js"; // uncomment for GCP 
import {
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
  const [modelSelect, setModelSelect] = useState('bert');
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
  // const url = `http://${ip_addr}:8080/`; // uncomment for GCP
    // update fetch as fetch(url, { ...} // for GCP
    fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Allow-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelSelect,
        phrase: input,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.is_microaggression) {
          toast({
            title: "This is a microaggression",
            description: `This may fall under the "${data.microaggression_type}" category of microaggressions`,
            status: "error",
            duration: 1000,
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
      });
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
              

              <Radio value="bert+poly_svm+lin_SVM" size='lg' colorScheme='green'>
                BERT+Poly_SVM+lin_SVM
              </Radio>
              <Radio value="cv+poly_svm+CNB" size='lg' colorScheme='green'>
                CV+Poly_SVM+Complement_NB
              </Radio>    
              <Radio value="bert+rfc+lin_SVM" size='lg' colorScheme='green'>
                BERT+RFC+lin_SVM
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
            maxW="1500"
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
