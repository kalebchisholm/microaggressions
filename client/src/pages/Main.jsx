import React from "react";
import {
  Heading,
  HStack,
  IconButton,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Box,
} from "@chakra-ui/react";
import { TextEntry } from "../components/TextEntry";
import { AiOutlineGithub, AiOutlineInfoCircle } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs'

export function Main() {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack h="100vh" justify="space-between">
      <Heading
        m="none"
        p="30px"
        bg="linear-gradient(137deg, rgba(61,112,104,1) 0%, rgba(20,69,61,1) 100%)"
        textAlign="center"
        color="white"
        shadow="2px 2px 10px darkgray"
        fontSize="5xl"
      >
        MICROAGGRESSION DETECTOR
      </Heading>
      <TextEntry />
      <HStack justify="space-between" p="10px" bg="linear-gradient(137deg, rgba(61,112,104,1) 0%, rgba(20,69,61,1) 100%)">
        <HStack color='#F0E8D1'>
          <BsPersonCircle fontSize='18pt'/>
          <Text pr='20px'>Kaleb Chisholm, Sean Jamieson, Mark Alwast, Matt Bardal</Text>
          <AiOutlineGithub fontSize='20pt'/>
          <a href="https://github.com/kalebchisholm/microaggressions.git">Github Repository</a>
        </HStack>
        <IconButton
          variant="ghost"
          borderRadius='full'
          icon={
            <AiOutlineInfoCircle fontSize="28pt" color="#F0E8D1"/>
          }
          _hover={{bg: 'none', shadow: '2px 2px 10px darkgray'}}
          onClick={onOpen}
        />
        <InfoModal isOpen={isOpen} onClose={onClose}/>
      </HStack>
    </Stack>
  );
}

const InfoModal = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} motionPreset='slideInBottom' isCentered>
      <ModalOverlay />
      <ModalContent bg='rgba(61,112,104,1)' color='white' borderRadius='xl'>
        <ModalHeader>About Microaggression Detector</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text>some info about the page</Text>
          <Text fontSize='xl' fontWeight='bold' mt='10px'>Model Performance:</Text>
          <HStack justify='space-evenly' mt='20px'>
            <Box>
              <Stack bg='rgba(20,69,61,1)' p='5px' borderRadius='lg' m='5px' shadow='1px 1px 5px black'>
              <CircularProgress value={40} color='green.400' m='auto'>
                <CircularProgressLabel>40%</CircularProgressLabel>
              </CircularProgress>
              <Text>
                this is one stat
              </Text>
              </Stack>
            </Box>
            <Box>
              <Stack bg='rgba(20,69,61,1)' p='5px' borderRadius='lg' m='5px' shadow='1px 1px 5px black'>
                <CircularProgress value={40} color='green.400' m='auto'>
                  <CircularProgressLabel>40%</CircularProgressLabel>
                </CircularProgress>
                <Text>
                  bungy wungy
                </Text>
              </Stack>
            </Box>
            <Box>
              <Stack bg='rgba(20,69,61,1)' p='5px' borderRadius='lg' m='5px' shadow='1px 1px 5px black'>
                <CircularProgress value={40} color='green.400' m='auto'>
                  <CircularProgressLabel>40%</CircularProgressLabel>
                </CircularProgress>
                <Text>asdasdasdasdasd</Text>
              </Stack>
            </Box>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button
              onClick={props.onClose}
              border="2px solid black"
              shadow="2px 2px 10px rgba(20,69,61,1)"
              borderRadius="full"
              bg="#E36372"
              color='black'
              _hover={{ bg: "#ED97A1", shadow: 'none' }}
            >
              Close
            </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}