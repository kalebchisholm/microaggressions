import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { TextEntry } from "../components/TextEntry";

export function Main() {
  return (
    <Box>
      <Heading
        m="none"
        p="30px"
        bg="linear-gradient(137deg, rgba(61,112,104,1) 0%, rgba(20,69,61,1) 100%)"
        textAlign="center"
        color="white"
        shadow='2px 2px 10px darkgray'
        fontSize='5xl'
      >
        MICROAGGRESSION CHECKER
      </Heading>
      <TextEntry />
    </Box>
  );
}
